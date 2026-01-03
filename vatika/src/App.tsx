import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithCustomToken, 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  serverTimestamp, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { 
  Leaf, 
  Droplets, 
  Calendar, 
  Plus, 
  Trash2, 
  Loader2, 
  Check, 
  AlertCircle, 
  Sparkles,
  MessageSquare,
  Send,
  X,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Pencil
} from 'lucide-react';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'default-app-id';

// --- AI Configuration ---
const apiKey = "your-api-key"; // Injected by environment

// --- Helper Functions ---
const calculateNextWatering = (lastWateredDate, frequencyDays) => {
  if (!lastWateredDate) return new Date();
  const last = new Date(lastWateredDate);
  const next = new Date(last);
  next.setDate(last.getDate() + frequencyDays);
  return next;
};

const getDaysUntil = (date) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffTime = target - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

// Compress image to avoid Firestore 1MB limit
const compressImage = (base64Str, maxWidth = 600, quality = 0.7) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      // Return as JPEG with reduced quality
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      // If image fails to load, return original (risky but better than crash) or null
      resolve(base64Str); 
    };
  });
};

// --- Components ---

const PlantDoctor = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setAnswer(null);

    try {
      const promptText = `You are a helpful, friendly expert botanist named Dr. Green. The user is asking: "${question}". Provide a concise, practical answer (max 3 sentences).`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      });

      if (!response.ok) throw new Error("Failed to get answer");
      const data = await response.json();
      const aiText = data.candidates[0].content.parts[0].text;
      setAnswer(aiText);
    } catch (error) {
      console.error(error);
      setAnswer("I'm having trouble connecting to the garden network right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
        <MessageSquare size={20} className="text-emerald-500" />
        <h3>Ask Dr. Green</h3>
      </div>
      
      <form onSubmit={handleAsk} className="relative flex items-center">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="E.g., Why are my basil leaves turning yellow?"
          className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className="absolute right-2 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>

      {answer && (
        <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="bg-white p-1.5 rounded-full shadow-sm">
            <Leaf size={16} className="text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="text-slate-700 text-sm leading-relaxed">{answer}</p>
          </div>
          <button 
            onClick={() => setAnswer(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

const GardenStats = ({ plants, filter, onFilterChange }) => {
  const stats = useMemo(() => {
    let overdue = 0;
    let today = 0;
    plants.forEach(plant => {
      const nextWatering = calculateNextWatering(plant.lastWatered?.toDate(), plant.frequencyDays);
      const daysUntil = getDaysUntil(nextWatering);
      if (daysUntil < 0) overdue++;
      else if (daysUntil === 0) today++;
    });
    return { overdue, today };
  }, [plants]);

  if (stats.overdue === 0 && stats.today === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 animate-in fade-in slide-in-from-top-4">
      {stats.overdue > 0 && (
        <button 
          onClick={() => onFilterChange(filter === 'overdue' ? 'all' : 'overdue')}
          className={`text-left transition-all duration-200 rounded-2xl p-5 flex items-center gap-4 border ${filter === 'overdue' ? 'bg-red-100 border-red-300 ring-2 ring-red-200' : 'bg-red-50 border-red-100 hover:shadow-md'}`}
        >
          <div className="bg-white p-3 rounded-full text-red-500 shadow-sm">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-red-800 font-bold text-lg">{stats.overdue} Plants Overdue</p>
            <p className="text-red-600 text-sm">Tap to view needs</p>
          </div>
        </button>
      )}
      
      {stats.today > 0 && (
        <button 
          onClick={() => onFilterChange(filter === 'today' ? 'all' : 'today')}
          className={`text-left transition-all duration-200 rounded-2xl p-5 flex items-center gap-4 border ${filter === 'today' ? 'bg-blue-100 border-blue-300 ring-2 ring-blue-200' : 'bg-blue-50 border-blue-100 hover:shadow-md'}`}
        >
          <div className="bg-white p-3 rounded-full text-blue-500 shadow-sm">
            <Droplets size={24} />
          </div>
          <div>
            <p className="text-blue-800 font-bold text-lg">{stats.today} Plants to Water</p>
            <p className="text-blue-600 text-sm">Tap to start watering</p>
          </div>
        </button>
      )}
    </div>
  );
};

const PlantCard = ({ plant, onWater, onDelete, onEdit }) => {
  const nextWatering = calculateNextWatering(plant.lastWatered?.toDate(), plant.frequencyDays);
  const daysUntil = getDaysUntil(nextWatering);
  
  let statusColor = "bg-green-100 text-green-800";
  let statusText = "Healthy";
  let cardBorder = "border-slate-100";
  
  if (daysUntil < 0) {
    statusColor = "bg-red-100 text-red-800";
    statusText = "Overdue";
    cardBorder = "border-red-200 ring-1 ring-red-100";
  } else if (daysUntil === 0) {
    statusColor = "bg-blue-100 text-blue-800";
    statusText = "Water Today";
    cardBorder = "border-blue-200 ring-1 ring-blue-100";
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm ${cardBorder} overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col h-full`}>
      <div className="relative h-48 bg-slate-50 overflow-hidden">
        {plant.imageUrl ? (
          <img 
            src={plant.imageUrl} 
            alt={plant.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-200">
            <Leaf size={64} />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor} shadow-sm`}>
            {statusText}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-800 line-clamp-1" title={plant.name}>
            {plant.name}
          </h3>
        </div>
        
        <div className="flex-grow mb-4 relative">
          <p className="text-sm text-slate-500 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
            {plant.careInstructions || plant.advice || "No specific advice."}
          </p>
        </div>

        <div className="space-y-3 mt-auto">
          <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-emerald-500" />
              <span>Every {plant.frequencyDays} days</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Next: {formatDate(nextWatering)}</span>
            <span className={`font-medium ${daysUntil <= 0 ? 'text-red-500' : 'text-emerald-600'}`}>
              {daysUntil === 0 ? 'Today' : daysUntil < 0 ? `${Math.abs(daysUntil)}d late` : `in ${daysUntil}d`}
            </span>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onWater(plant)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-sm"
            >
              <Droplets size={16} />
              Water
            </button>
            <button
              onClick={() => onEdit(plant)}
              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
              title="Edit Last Watered Date"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => onDelete(plant.id)}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              title="Remove Plant"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditPlantModal = ({ plant, isOpen, onClose, onUpdate }) => {
  const [date, setDate] = useState('');

  useEffect(() => {
    if (plant?.lastWatered) {
       // Convert Firestore Timestamp to YYYY-MM-DD
       setDate(new Date(plant.lastWatered.toDate()).toISOString().split('T')[0]);
    }
  }, [plant]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) return;
    // Send back Date object
    onUpdate(plant.id, new Date(date));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 bg-slate-800 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Pencil size={20} />
            Edit Last Watered
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Correct Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-lg"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg shadow-emerald-200 transition-all"
            >
              Save Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const AddPlantModal = ({ isOpen, onClose, onAdd }) => {
  const [plantName, setPlantName] = useState('');
  const [lastWatered, setLastWatered] = useState(new Date().toISOString().split('T')[0]);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plantName.trim()) return;

    setIsAnalysing(true);
    setError('');
    
    try {
      // Step 1: Get Schedule & Advice from Gemini
      setLoadingStep('Consulting botanist AI...');
      
      const promptText = `
        I have a plant named "${plantName}". 
        Please provide a JSON response with:
        1. "frequency_days": an integer representing the ideal watering interval in days (e.g. 7 for weekly).
        2. "care_instructions": a concise paragraph (2-3 sentences) regarding light, soil, and humidity requirements.
        3. "scientific_name": the scientific name if known, or just the common name.
        
        Return ONLY the JSON object.
      `;

      const textResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (!textResponse.ok) throw new Error("Failed to get plant advice");
      const textData = await textResponse.json();
      const aiResponse = JSON.parse(textData.candidates[0].content.parts[0].text);

      // Step 2: Generate Illustration with Imagen
      setLoadingStep('Sketching plant portrait...');
      
      const imagePrompt = `A high-quality, artistic botanical illustration of a ${aiResponse.scientific_name || plantName} plant, clean white background, soft lighting, detailed leaves, isolated on white.`;
      
      let imageUrl = null;
      try {
        const imageResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            instances: [{ prompt: imagePrompt }],
            parameters: { sampleCount: 1 }
          })
        });
        
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          if (imageData.predictions && imageData.predictions[0]) {
             const originalBase64 = `data:image/png;base64,${imageData.predictions[0].bytesBase64Encoded}`;
             // Compress image to ensure it fits in Firestore
             imageUrl = await compressImage(originalBase64);
          }
        }
      } catch (imgErr) {
        console.error("Image generation failed, continuing without image", imgErr);
      }

      // Complete
      await onAdd({
        name: plantName, // Use user's name
        scientificName: aiResponse.scientific_name,
        frequencyDays: aiResponse.frequency_days || 7,
        careInstructions: aiResponse.care_instructions || "Water when the soil feels dry.",
        imageUrl: imageUrl,
        createdAt: serverTimestamp(),
        lastWatered: Timestamp.fromDate(new Date(lastWatered))
      });

      setPlantName('');
      setLastWatered(new Date().toISOString().split('T')[0]);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Could not analyze plant. Please try again.');
    } finally {
      setIsAnalysing(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 bg-emerald-600 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles size={24} />
            Add New Plant
          </h2>
          <p className="text-emerald-100 mt-1">AI will determine the schedule & draw it.</p>
        </div>
        
        <div className="p-8">
          {!isAnalysing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What kind of plant is it?
                </label>
                <input
                  type="text"
                  value={plantName}
                  onChange={(e) => setPlantName(e.target.value)}
                  placeholder="e.g., Monstera, Fiddle Leaf Fig, Basil"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-lg"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  When did you last water it?
                </label>
                <input
                  type="date"
                  value={lastWatered}
                  onChange={(e) => setLastWatered(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-lg"
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!plantName.trim()}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:translate-y-[-1px]"
                >
                  Analyze & Add
                </button>
              </div>
            </form>
          ) : (
            <div className="py-12 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Leaf size={20} className="text-emerald-600 animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-slate-800">{loadingStep}</h3>
              <p className="text-sm text-slate-400 max-w-[200px]">
                This usually takes about 5-10 seconds.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'overdue', 'today'
  const [editingPlant, setEditingPlant] = useState(null);

  // Inject Custom Font
  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  // Auth initialization
  useEffect(() => {
    const initAuth = async () => {
      const __initial_auth_token = '';
      try {
        if (__initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }
    };
    
    initAuth();
    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  // Data fetching
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Rule 1 & 2 compliant: Simple collection query
    const q = collection(db, 'artifacts', appId, 'users', user.uid, 'plants');
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const plantData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort in memory (Rule 2 compliant)
      plantData.sort((a, b) => {
        const nextA = calculateNextWatering(a.lastWatered?.toDate(), a.frequencyDays);
        const nextB = calculateNextWatering(b.lastWatered?.toDate(), b.frequencyDays);
        return nextA - nextB;
      });

      setPlants(plantData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Group plants by status and dynamic dates
  const plantSections = useMemo(() => {
    const sections = [];
    const overdue = [];
    const today = [];
    const tomorrow = [];
    
    // We will filter plants into these buckets
    const futurePlants = [];

    plants.forEach(plant => {
      const nextWatering = calculateNextWatering(plant.lastWatered?.toDate(), plant.frequencyDays);
      const daysUntil = getDaysUntil(nextWatering);

      if (daysUntil < 0) {
        overdue.push(plant);
      } else if (daysUntil === 0) {
        today.push(plant);
      } else if (daysUntil === 1) {
        tomorrow.push(plant);
      } else {
        futurePlants.push(plant);
      }
    });

    if (overdue.length > 0) {
      sections.push({ title: 'Attention Needed', icon: AlertCircle, color: 'text-red-600', plants: overdue });
    }
    if (today.length > 0) {
      sections.push({ title: 'Water Today', icon: Droplets, color: 'text-blue-600', plants: today });
    }
    if (tomorrow.length > 0) {
      sections.push({ title: 'Tomorrow', icon: Clock, color: 'text-amber-500', plants: tomorrow });
    }

    // Dynamically group future plants by date string
    const seenDates = new Set();
    futurePlants.forEach(plant => {
      const nextWatering = calculateNextWatering(plant.lastWatered?.toDate(), plant.frequencyDays);
      const dateKey = nextWatering.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });

      if (!seenDates.has(dateKey)) {
        seenDates.add(dateKey);
        
        // Find all plants matching this date
        const batch = futurePlants.filter(p => {
           const pNext = calculateNextWatering(p.lastWatered?.toDate(), p.frequencyDays);
           return pNext.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          }) === dateKey;
        });

        sections.push({ title: dateKey, icon: Calendar, color: 'text-emerald-600', plants: batch });
      }
    });

    return sections;
  }, [plants]);

  const filteredSections = useMemo(() => {
    return plantSections.filter(section => {
      if (filter === 'all') return true;
      if (filter === 'overdue') return section.title === 'Attention Needed';
      if (filter === 'today') return section.title === 'Water Today';
      return true;
    });
  }, [plantSections, filter]);

  const handleAddPlant = async (plantData) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'plants'), plantData);
    } catch (error) {
      console.error("Error adding plant:", error);
    }
  };

  const handleWater = async (plant) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'plants', plant.id), {
        lastWatered: serverTimestamp()
      });
    } catch (error) {
      console.error("Error watering plant:", error);
    }
  };

  const handleUpdateDate = async (plantId, newDate) => {
     if (!user) return;
     try {
       await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'plants', plantId), {
         lastWatered: Timestamp.fromDate(newDate)
       });
     } catch (error) {
       console.error("Error updating date:", error);
     }
  };

  const handleDelete = async (plantId) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'plants', plantId));
    } catch (error) {
      console.error("Error deleting plant:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 size={40} className="animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['Outfit'] text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-xl">
              <Leaf className="text-emerald-600" size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Vatika</h1>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Plant</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        <PlantDoctor />

        {plants.length > 0 && (
          <GardenStats 
            plants={plants} 
            filter={filter}
            onFilterChange={setFilter}
          />
        )}

        {plants.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
              <Sparkles className="text-emerald-400" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">Your garden is empty</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Add your first plant! Our AI will identify the best watering schedule and generate a custom illustration for it.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-emerald-600 font-medium hover:text-emerald-700 hover:underline"
            >
              Get Started &rarr;
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {filter !== 'all' && (
              <div className="flex items-center gap-2 mb-6 animate-in fade-in slide-in-from-top-2">
                <button 
                  onClick={() => setFilter('all')}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back to Garden
                </button>
                <span className="font-semibold text-slate-800">
                  {filter === 'overdue' ? 'Showing Overdue Plants' : 'Showing Plants to Water Today'}
                </span>
              </div>
            )}

            {filteredSections.length === 0 && filter !== 'all' ? (
               <div className="text-center py-12 text-slate-500">
                 <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-400" />
                 <p>No plants in this category. Great job!</p>
               </div>
            ) : (
              filteredSections.map((section) => (
                <section key={section.title} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className={`flex items-center gap-3 mb-6 ${section.color}`}>
                    <div className="p-2 rounded-lg bg-current/10">
                      <section.icon size={24} />
                    </div>
                    <h2 className="text-2xl font-bold capitalize tracking-tight">{section.title}</h2>
                    <span className="ml-auto text-sm font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-500">
                      {section.plants.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {section.plants.map(plant => (
                      <PlantCard 
                        key={plant.id} 
                        plant={plant} 
                        onWater={handleWater} 
                        onDelete={handleDelete} 
                        onEdit={setEditingPlant}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        )}
      </main>

      <AddPlantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddPlant}
      />

      <EditPlantModal 
        plant={editingPlant}
        isOpen={!!editingPlant}
        onClose={() => setEditingPlant(null)}
        onUpdate={handleUpdateDate}
      />
    </div>
  );
}
