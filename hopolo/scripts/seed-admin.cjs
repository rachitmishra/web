const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Configuration
const ENCRYPTION_KEY =
  process.env.VITE_ENCRYPTION_KEY || "OneRingToRuleThemAllMyPrecious!!"; // Must be 32 chars
const ADMIN_PHONE = process.env.VITE_ADMIN_PHONE || "+919967457062";
const ADMIN_UID = "d9934223-dcfa-41ce-af64-90e68dd2f7ae";

// Path to service account key (assumed to be in project root or specified via env)
const serviceAccountPath =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.join(__dirname, "../service-account-secret.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error(
    `Error: Service account key not found at ${serviceAccountPath}`
  );
  console.error(
    'Please download your service account key from Firebase Console and save it as "service-account.json" in the project root, or set GOOGLE_APPLICATION_CREDENTIALS environment variable.'
  );
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

console.log("Firebase Admin SDK initialized.");

// Encryption Helper (matches src/lib/encryption.server.ts)
const encrypt = (text) => {
  if (ENCRYPTION_KEY.length !== 32) {
    throw new Error("Encryption key must be exactly 32 characters.");
  }
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
};

const DUMMY_PRODUCTS = [
  {
    name: "Classic Leather Belt",
    price: 45,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1551028919-ac7bcb81d8b9?auto=format&fit=crop&w=500&q=60",
    description: "Handcrafted leather belt with a timeless buckle.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Brown", "Black"],
    isBestSeller: true,
    stock: 50,
  },
  {
    name: "Streetwear Oversized Hoodie",
    price: 75,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=60",
    description: "Heavyweight cotton blend, oversized fit for ultimate comfort.",
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Grey", "Slate"],
    isBestSeller: true,
    stock: 25,
  },
  {
    name: "Minimalist Ceramic Vase",
    price: 55,
    category: "home",
    image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=500&q=60",
    description: "Matte finish ceramic vase, perfect for any modern interior.",
    colors: ["Sand", "Off-White"],
    isBestSeller: false,
    stock: 15,
  },
  {
    name: "Wireless ANC Headphones",
    price: 199,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=60",
    description: "Premium sound with advanced active noise cancellation.",
    colors: ["Silver", "Black"],
    isBestSeller: true,
    stock: 10,
  },
  {
    name: "Graphic T-Shirt",
    price: 35,
    category: "clothing",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=60",
    description: "100% organic cotton with a unique avant-garde print.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White"],
    isBestSeller: false,
    stock: 40,
  }
];

const seedCategories = async () => {
  console.log("Seeding categories...");
  const categories = ["Accessories", "Clothing", "Home", "Electronics"];
  const batch = db.batch();

  for (const cat of categories) {
    const catRef = db.collection("categories").doc(cat.toLowerCase());
    batch.set(catRef, { name: cat, id: cat.toLowerCase() }, { merge: true });
  }

  await batch.commit();
  console.log("Categories seeded.");
};

const seedProducts = async () => {
  console.log("Seeding products...");
  const batch = db.batch();

  for (const prod of DUMMY_PRODUCTS) {
    const prodRef = db.collection("products").doc();
    batch.set(prodRef, {
      ...prod,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  console.log("Products seeded.");
};

const seedUsers = async () => {
  console.log("Seeding user profiles...");

  // 1. Ensure Auth User Exists
  try {
    await admin.auth().createUser({
      uid: ADMIN_UID,
      phoneNumber: ADMIN_PHONE,
      displayName: "Admin User",
    });
    console.log(`Auth user created: ${ADMIN_PHONE} (UID: ${ADMIN_UID})`);
  } catch (error) {
    if (error.code === "auth/uid-already-exists") {
      console.log(`Auth user already exists: ${ADMIN_UID}`);
    } else {
      console.error("Error creating auth user:", error);
    }
  }

  // 2. Create Encrypted Profile
  const profiles = [
    {
      uid: ADMIN_UID,
      phoneNumber: ADMIN_PHONE,
      email: "admin@hopolo.com", // Optional
      role: "admin",
      // Encrypt sensitive fields
      displayName: encrypt("Admin User"),
      emoji: encrypt("🛠️"),
      addresses: encrypt(
        JSON.stringify([
          {
            street: "123 Admin St",
            city: "Headquarters",
            zip: "00000",
          },
        ])
      ),
    },
  ];

  const batch = db.batch();
  for (const profile of profiles) {
    const userRef = db.collection("profiles").doc(profile.uid);
    batch.set(
      userRef,
      {
        ...profile,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }
  await batch.commit();
  console.log("Encrypted user profiles seeded.");
};

const seedSettings = async () => {
  console.log("Seeding storefront settings...");
  const settingsRef = db.collection("settings").doc("storefront");
  await settingsRef.set({
    bannerText: "Welcome to Hopolo!",
    bannerColor: "#5D3FD3",
    bannerVisible: true,
    heroTitle: "Hopolo Boutique",
    heroSubtitle: "Discover unique products curated just for you. Minimalist design, playful details.",
    heroImage: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1920&q=80&fm=webp",
    heroCtaText: "Shop the Collection",
    isMaintenanceMode: false,
    reviews: [
      { name: "Sarah L.", emoji: "😊", text: "Amazing quality and fast delivery. Highly recommended!" },
      { name: "Marcus T.", emoji: "😊", text: "Minimalist design that fits perfectly in my home." },
      { name: "Elena G.", emoji: "😊", text: "The emoji-based review system is so fun and easy!" },
    ]
  }, { merge: true });
  console.log("Storefront settings seeded.");
};

const clearCollection = async (collectionPath) => {
  const snapshot = await db.collection(collectionPath).get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  console.log(`Cleared collection: ${collectionPath}`);
};

const run = async () => {
  try {
    await clearCollection("categories");
    await clearCollection("products");
    await seedCategories();
    await seedProducts();
    await seedSettings();
    await seedUsers();
    console.log("Database seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

run();
