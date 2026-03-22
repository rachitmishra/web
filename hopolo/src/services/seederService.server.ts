import { adminDb, FieldValue } from '../lib/firebase-admin.server';

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
    const q = await adminDb.collection('categories').where('name', '==', cat).get();
    if (q.empty) {
      await adminDb.collection('categories').add({ name: cat, id: cat.toLowerCase() });
    }
  }
};

export const seedProducts = async () => {
  await seedCategories();
  for (const prod of DUMMY_PRODUCTS) {
    await adminDb.collection('products').add({
      ...prod,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
  }
};

export const seedReviews = async () => {
  const productsSnap = await adminDb.collection('products').get();
  if (productsSnap.empty) return;

  const products = productsSnap.docs.map(d => d.id);

  for (const review of DUMMY_REVIEWS) {
    const randomProductId = products[Math.floor(Math.random() * products.length)];
    await adminDb.collection('reviews').add({
      ...review,
      productId: randomProductId,
      userId: 'dummy_user_' + Math.random().toString(36).substring(7),
      createdAt: FieldValue.serverTimestamp()
    });
  }
};

export async function seedUserProfile(uid: string) {
  const userRef = adminDb.collection('profiles').doc(uid);
  await userRef.set({
    uid,
    displayName: "Test User",
    emoji: "🚀",
    role: 'admin',
    addresses: [
      { street: "123 Test Lane", city: "Testerville", zip: "12345" },
      { street: "456 Mock Blvd", city: "Mock City", zip: "67890" }
    ],
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });
}
