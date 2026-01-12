import { collection, addDoc, setDoc, doc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

const DUMMY_PRODUCTS = [
  {
    name: "Minimalist Watch",
    price: 120,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=60",
    description: "A sleek, modern timepiece for everyday wear.",
    sizes: ["One Size"],
    colors: ["Black", "Silver"],
    deliveryTime: "3-5 days",
    priceDisclaimer: "Includes tax",
    specifications: { "Material": "Stainless Steel", "Water Resistance": "3ATM" }
  },
  {
    name: "Canvas Tote",
    price: 35,
    category: "Bags",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=60",
    description: "Durable canvas tote bag, perfect for groceries or books.",
    sizes: ["Standard"],
    colors: ["Beige", "Navy"],
    deliveryTime: "2-4 days"
  },
  {
    name: "Ceramic Vase",
    price: 45,
    category: "Home",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=500&q=60",
    description: "Handcrafted ceramic vase with a matte finish.",
    sizes: ["Small", "Large"],
    colors: ["White", "Terracotta"],
    deliveryTime: "5-7 days",
    artDetails: { "Artist": "Studio Clay", "Origin": "Portland, OR" }
  }
];

const DUMMY_REVIEWS = [
  { rating: 5, comment: "Absolutely love it! High quality.", userName: "Alice" },
  { rating: 4, comment: "Great design, but shipping was slow.", userName: "Bob" },
  { rating: 5, comment: "Perfect gift for my friend.", userName: "Charlie" }
];

export const seedCategories = async () => {
  const categories = ["Accessories", "Bags", "Home"];
  for (const cat of categories) {
    // Check if exists (simple check)
    const q = query(collection(db, 'categories'), where('name', '==', cat));
    const snap = await getDocs(q);
    if (snap.empty) {
      await addDoc(collection(db, 'categories'), { name: cat, id: cat.toLowerCase() });
    }
  }
};

export const seedProducts = async () => {
  await seedCategories(); // Ensure categories exist
  
  for (const prod of DUMMY_PRODUCTS) {
    await addDoc(collection(db, 'products'), {
      ...prod,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
};

export const seedReviews = async () => {
  // Get all products
  const productsSnap = await getDocs(collection(db, 'products'));
  if (productsSnap.empty) return;

  const products = productsSnap.docs.map(d => d.id);

  for (const review of DUMMY_REVIEWS) {
    // Assign random product
    const randomProductId = products[Math.floor(Math.random() * products.length)];
    await addDoc(collection(db, 'reviews'), {
      ...review,
      productId: randomProductId,
      userId: 'dummy_user_' + Math.random().toString(36).substring(7),
      createdAt: serverTimestamp()
    });
  }
};

export const seedUserProfile = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user logged in");

  const userRef = doc(db, 'profiles', user.uid);
  
  await setDoc(userRef, {
    uid: user.uid,
    displayName: "Test User",
    emoji: "🚀",
    role: 'admin', // Promote to admin for ease of testing
    addresses: [
      { street: "123 Test Lane", city: "Testerville", zip: "12345" },
      { street: "456 Mock Blvd", city: "Mock City", zip: "67890" }
    ],
    updatedAt: serverTimestamp()
  }, { merge: true });
};
