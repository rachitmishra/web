export interface CustomerReview {
  name: string;
  emoji: string;
  text: string;
}

export interface StorefrontSettings {
  bannerText: string;
  bannerColor: string;
  bannerLink: string;
  bannerVisible: boolean;
  isMaintenanceMode: boolean;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroCtaText: string;
  reviews: CustomerReview[];
}

export const DEFAULT_SETTINGS: StorefrontSettings = {
  bannerText: "Welcome to Hopolo!",
  bannerColor: "#5D3FD3",
  bannerLink: "",
  bannerVisible: false,
  isMaintenanceMode: false,
  heroTitle: "Hopolo Boutique",
  heroSubtitle: "Discover unique products curated just for you. Minimalist design, playful details.",
  heroImage: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1920&q=80&fm=webp",
  heroCtaText: "Shop the Collection",
  reviews: [
    {
      name: "Sarah L.",
      emoji: "😊",
      text: "Amazing quality and fast delivery. Highly recommended!",
    },
    {
      name: "Marcus T.",
      emoji: "😊",
      text: "Minimalist design that fits perfectly in my home.",
    },
    {
      name: "Elena G.",
      emoji: "😊",
      text: "The emoji-based review system is so fun and easy!",
    },
  ],
};
