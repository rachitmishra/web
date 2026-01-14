const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'test_secret_key_32_chars_long_!!';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '+1234567890';
const ADMIN_UID = 'admin_test_user';

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
    throw new Error('Encryption key must be exactly 32 characters.');
  }
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
};

const DUMMY_PRODUCTS = [
  {
    name: "Classic Leather Belt",
    price: 45,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1551028919-ac7bcb81d8b9?auto=format&fit=crop&w=500&q=60",
    description: "Handcrafted leather belt with a timeless buckle.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Brown", "Black"],
    deliveryTime: "3-5 days",
    priceDisclaimer: "Taxes included",
    stock: 50,
  },
  {
    name: "Denim Jacket",
    price: 85,
    category: "Clothing",
    image:
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=500&q=60",
    description: "Vintage wash denim jacket, essential for layering.",
    sizes: ["S", "M", "L"],
    colors: ["Blue"],
    deliveryTime: "2-4 days",
    stock: 30,
  },
  // Add more products as needed...
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
      displayName: 'Admin User'
    });
    console.log(`Auth user created: ${ADMIN_PHONE} (UID: ${ADMIN_UID})`);
  } catch (error) {
    if (error.code === 'auth/uid-already-exists') {
      console.log(`Auth user already exists: ${ADMIN_UID}`);
    } else {
      console.error('Error creating auth user:', error);
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
      addresses: encrypt(JSON.stringify([{
        street: "123 Admin St",
        city: "Headquarters",
        zip: "00000"
      }]))
    }
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

const run = async () => {
  try {
    await seedCategories();
    await seedProducts();
    await seedUsers();
    console.log("Database seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

run();