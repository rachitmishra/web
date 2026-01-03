import * as admin from "firebase-admin";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

dotenv.config();

const BUCKET_NAME = process.env.VITE_FIREBASE_STORAGE_BUCKET || "typotamus.firebasestorage.app";
const SERVICE_ACCOUNT_PATH = process.env.FIREBASE_SERVICE_ACCOUNT;

// Initialize Firebase Admin
try {
    if (SERVICE_ACCOUNT_PATH && fs.existsSync(SERVICE_ACCOUNT_PATH)) {
        console.log(`[AUTH] Using service account from: ${SERVICE_ACCOUNT_PATH}`);
        const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8"));
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: BUCKET_NAME
        });
    } else {
        console.log("[AUTH] Using default application credentials...");
        admin.initializeApp({
            storageBucket: BUCKET_NAME
        });
    }
} catch (e) {
    console.log("Initialization issue:", e);
}

const storage = admin.storage();
const bucket = storage.bucket(); // Uses the one from initializeApp options


// Ensure local cache directories exist
const LOCAL_CACHE_DIR = path.join(__dirname, "../generated_images");
const ORIGINALS_DIR = path.join(LOCAL_CACHE_DIR, "originals");

if (!fs.existsSync(LOCAL_CACHE_DIR)) fs.mkdirSync(LOCAL_CACHE_DIR);
if (!fs.existsSync(ORIGINALS_DIR)) fs.mkdirSync(ORIGINALS_DIR);

const ANIMAL_MAP: Record<string, Array<{ name: string; emoji: string; sound: string }>> = {
  a: [{ name: "Alligator", emoji: "🐊", sound: "" }, { name: "Ant", emoji: "🐜", sound: "" }],
// ... (rest of map is fine, no changes needed to map structure) ...
  b: [{ name: "Bear", emoji: "🐻", sound: "" }, { name: "Bee", emoji: "🐝", sound: "" }],
  c: [{ name: "Cat", emoji: "🐱", sound: "" }, { name: "Cow", emoji: "🐮", sound: "" }],
  d: [{ name: "Dog", emoji: "🐶", sound: "" }, { name: "Duck", emoji: "🦆", sound: "" }],
  e: [{ name: "Elephant", emoji: "🐘", sound: "" }],
  f: [{ name: "Frog", emoji: "🐸", sound: "" }, { name: "Fox", emoji: "🦊", sound: "" }],
  g: [{ name: "Giraffe", emoji: "🦒", sound: "" }, { name: "Goat", emoji: "🐐", sound: "" }],
  h: [{ name: "Horse", emoji: "🐴", sound: "" }, { name: "Hippo", emoji: "🦛", sound: "" }],
  i: [{ name: "Iguana", emoji: "🦎", sound: "" }],
  j: [{ name: "Jellyfish", emoji: "🪼", sound: "" }],
  k: [{ name: "Kangaroo", emoji: "🦘", sound: "" }, { name: "Koala", emoji: "🐨", sound: "" }],
  l: [{ name: "Lion", emoji: "🦁", sound: "" }],
  m: [{ name: "Monkey", emoji: "🐒", sound: "" }, { name: "Mouse", emoji: "🐭", sound: "" }],
  n: [{ name: "Narwhal", emoji: "🦄", sound: "" }],
  o: [{ name: "Owl", emoji: "🦉", sound: "" }, { name: "Octopus", emoji: "🐙", sound: "" }],
  p: [{ name: "Pig", emoji: "🐷", sound: "" }, { name: "Panda", emoji: "🐼", sound: "" }],
  q: [{ name: "Queen Bee", emoji: "👑🐝", sound: "" }],
  r: [{ name: "Rabbit", emoji: "🐰", sound: "" }, { name: "Raccoon", emoji: "🦝", sound: "" }],
  s: [{ name: "Sheep", emoji: "🐑", sound: "" }, { name: "Snake", emoji: "🐍", sound: "" }],
  t: [{ name: "Tiger", emoji: "🐯", sound: "" }, { name: "Turtle", emoji: "🐢", sound: "" }],
  u: [{ name: "Urial", emoji: "🐑", sound: "" }],
  v: [{ name: "Vulture", emoji: "🦅", sound: "" }],
  w: [{ name: "Wolf", emoji: "🐺", sound: "" }, { name: "Whale", emoji: "🐳", sound: "" }],
  x: [{ name: "X-ray Fish", emoji: "🐠", sound: "" }],
  y: [{ name: "Yak", emoji: "🐂", sound: "" }],
  z: [{ name: "Zebra", emoji: "🦓", sound: "" }],
};

const ALL_ANIMALS = Object.values(ANIMAL_MAP).flat();

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Missing GEMINI_API_KEY in .env");
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

  console.log(`Starting processing for ${ALL_ANIMALS.length} animals...`);

  for (const animal of ALL_ANIMALS) {
    const sanitizedName = animal.name.toLowerCase().replace(/\s+/g, '-');
    const localFilePath = path.join(LOCAL_CACHE_DIR, `${sanitizedName}.png`);
    const originalFilePath = path.join(ORIGINALS_DIR, `${sanitizedName}.png`);
    const remoteFilePath = `animals/${sanitizedName}.png`;
    const remoteFile = bucket.file(remoteFilePath);

    let originalBuffer: Buffer | null = null;

    try {
      // 1. Resolve Original Image
      if (fs.existsSync(originalFilePath)) {
        // Original exists, use it
        // console.log(`[ORIGINAL] Found ${animal.name}`);
        originalBuffer = fs.readFileSync(originalFilePath);
      } else if (fs.existsSync(localFilePath)) {
        // Only optimized exists (or it's the original in the wrong place).
        // Move it to originals to become the source of truth.
        console.log(`[MOVE] Moving existing ${animal.name} to originals`);
        fs.renameSync(localFilePath, originalFilePath);
        originalBuffer = fs.readFileSync(originalFilePath);
      } else {
        // Generate new original
        console.log(`[GENERATE] ${animal.name}...`);
        const prompt = `A very cute, bright, high-quality cartoon illustration of a ${animal.name} for a children's book, soft colors, friendly face, simple white background, 3d render style`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

        if (imagePart && imagePart.inlineData) {
          originalBuffer = Buffer.from(imagePart.inlineData.data, "base64");
          fs.writeFileSync(originalFilePath, originalBuffer);
          console.log(`[SAVED] Original ${animal.name} saved`);
        } else {
          console.error(`[FAIL] No image generation data for ${animal.name}`);
          continue;
        }
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // 2. Compress/Optimize (Always regenerate compressed version from original)
      // Resize to max 800px width/height, quality 80, png
      // console.log(`[COMPRESS] Processing ${animal.name}...`);
      const compressedBuffer = await sharp(originalBuffer)
        .resize({ width: 800, height: 800, fit: 'inside' })
        .png({ quality: 80, compressionLevel: 9 })
        .toBuffer();
      
      fs.writeFileSync(localFilePath, compressedBuffer);

      // 3. Upload to Firebase (Always overwrite to ensure we have the optimized version)
      console.log(`[UPLOAD] Uploading optimized ${animal.name}...`);
      await remoteFile.save(compressedBuffer, {
        metadata: { contentType: "image/png" },
        public: true,
      });
      console.log(`[DONE] ${animal.name}`);

    } catch (err: any) {
      console.error(`[ERROR] ${animal.name}:`, err.message);
    }
  }
}

main();
