import { useState, useCallback, useRef, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { ANIMAL_MAP, ALL_ANIMALS } from "../data/animals";
import type { Animal } from "../types";
import { playClickSound, pcmToWav } from "../utils/audioUtils";
import { genAI } from "../utils/ai";
import { storage } from "../firebase";

export const useGameLogic = () => {
  const [displayType, setDisplayType] = useState<"single" | "multiple">("single");
  const [currentAnimals, setCurrentAnimals] = useState<Animal[]>([]);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);
  const [lastPressId, setLastPressId] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageCache = useRef<Record<string, string>>({});
  const soundCache = useRef<Record<string, string>>({});
  const processingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getRandomAnimal = () =>
    ALL_ANIMALS[Math.floor(Math.random() * ALL_ANIMALS.length)];

  const generateAnimalImage = async (animalName: string) => {
    const localStorageKey = `cached_image_${animalName}`;
    
    // 1. Check LocalStorage
    try {
      const cached = localStorage.getItem(localStorageKey);
      if (cached) {
        return cached;
      }
    } catch (e) {
      // Ignore localStorage errors
    }

    // 2. Check Session Cache (RAM)
    if (imageCache.current[animalName]) {
      return imageCache.current[animalName];
    }

    try {
      setIsGeneratingImage(true);
      const sanitizedName = animalName.toLowerCase().replace(/\s+/g, '-');
      const storageRef = ref(storage, `animals/${sanitizedName}.png`);

      // 3. Fetch from Firebase Storage
      const url = await getDownloadURL(storageRef);
      
      // 4. Download and convert to Base64 for caching
      // Note: This requires CORS to be configured on the Firebase Storage bucket
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fetch failed");
        
        const blob = await response.blob();
        
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            
            // Update RAM cache
            imageCache.current[animalName] = base64data;
            
            // Update LocalStorage
            try {
              localStorage.setItem(localStorageKey, base64data);
            } catch (e) {
              console.warn("LocalStorage full, could not cache image:", animalName);
            }
            
            setIsGeneratingImage(false);
            resolve(base64data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (fetchErr) {
        console.warn("CORS or network error prevented local caching. Using direct URL instead.", fetchErr);
        // Fallback: Just return the URL. <img> tags can display it without CORS, 
        // though we won't be able to store it in LocalStorage.
        setIsGeneratingImage(false);
        return url;
      }

    } catch (err) {
      console.error("Image fetch error", err);
      setIsGeneratingImage(false);
      return null;
    }
  };

  const playAnimalSound = async (animal: Animal, isFunnyMode = false) => {
    if (isSpeaking) return;
    
    const cacheKey = `${animal.name}-${isFunnyMode ? 'funny' : 'sound'}`;
    if (soundCache.current[cacheKey]) {
        setIsSpeaking(true);
        const audio = new Audio(soundCache.current[cacheKey]);
        audio.onended = () => setIsSpeaking(false);
        await audio.play();
        return;
    }

    setIsSpeaking(true);
    setError(null);

    const prompt = isFunnyMode 
        ? `Make a short, funny, silly sound effect for a ${animal.name}. Then say something funny as the ${animal.name}.`
        : `Say in the style of a nature documentary narrator: ${animal.sound}`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-tts" });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } },
        } as any,
      });

      const response = await result.response;
      const audioPart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      
      if (!audioPart || !audioPart.inlineData) throw new Error("No audio data");

      const audioBlob = pcmToWav(audioPart.inlineData.data, 24000);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      soundCache.current[cacheKey] = audioUrl;

      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsSpeaking(false);
      };

      await audio.play();
    } catch (err) {
      console.error(err);
      setError("Couldn't hear the animal right now.");
      setIsSpeaking(false);
    }
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key;
      setLastKeyPressed(key === " " ? "Space" : key);
      setLastPressId(Date.now());
      playClickSound();

      if (key === " ") {
        event.preventDefault();
      }

      if (processingTimeout.current) {
        clearTimeout(processingTimeout.current);
      }

      processingTimeout.current = setTimeout(async () => {
        if (/^\d$/.test(key)) {
          const count = parseInt(key, 10);
          if (count === 0) {
            setDisplayType("single");
            setCurrentAnimals([]);
          } else {
            const baseAnimal = getRandomAnimal();
            const batch = Array(count).fill(baseAnimal);
            setDisplayType("multiple");
            setCurrentAnimals(batch);
          }
          return;
        }

        if (key === " ") {
          const animal = getRandomAnimal();
          setDisplayType("single");
          setCurrentAnimals([animal]);
          playAnimalSound(animal, true);
          return;
        }

        if (/^[a-zA-Z]$/.test(key)) {
          const char = key.toLowerCase();
          const animalsForChar = ANIMAL_MAP[char];

          if (animalsForChar && animalsForChar.length > 0) {
            const animal = animalsForChar[Math.floor(Math.random() * animalsForChar.length)];

            setDisplayType("single");
            setCurrentAnimals([animal]);

            const imageUrl = await generateAnimalImage(animal.name);
            if (imageUrl) {
              setCurrentAnimals([{ ...animal, imageUrl }]);
            }
          } else {
            setError(`No animal found for ${key.toUpperCase()}!`);
          }
          return;
        }
      }, 300);
    },
    [isSpeaking]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (processingTimeout.current) {
        clearTimeout(processingTimeout.current);
      }
    };
  }, [handleKeyDown]);

  return {
    displayType,
    currentAnimals,
    lastKeyPressed,
    lastPressId,
    isSpeaking,
    isGeneratingImage,
    error
  };
};
