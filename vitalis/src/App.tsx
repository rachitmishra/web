import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  collection, 
  onSnapshot,
  Timestamp,
  query,
  orderBy
} from 'firebase/firestore';

// --- Firebase Configuration ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- Icon Components ---
const ChevronDown = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const Target = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const Plus = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const History = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

const Clock = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const Zap = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const Sparkles = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

const Camera = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

const Calendar = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
    <path d="M17 14h-6" />
    <path d="M13 18H7" />
  </svg>
);

const RefreshCw = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

const ShoppingBag = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const Dumbbell = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6.5 6.5 11 11" />
    <path d="m21 21-1-1" />
    <path d="m3 3 1 1" />
    <path d="m18 22 4-4" />
    <path d="m2 6 4-4" />
    <path d="m3 10 7-7" />
    <path d="m14 21 7-7" />
  </svg>
);

const ArrowRight = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const Leaf = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

// --- Exercise Schedule ---
const exerciseSchedule = [
  { 
    day: "Sunday", 
    focus: "Rest & Recovery", 
    intensity: "Low",
    description: "Take it easy today. Focus on stretching, yoga, or a gentle 30-minute walk to help your muscles recover.",
    routine: ["Light Yoga Flow (20 mins)", "Hamstring Stretch", "Child's Pose", "Cat-Cow Stretch"]
  },
  { 
    day: "Monday", 
    focus: "Full Body Strength", 
    intensity: "High",
    description: "Start the week strong! Focus on compound movements.",
    routine: ["Bodyweight Squats: 3x15", "Push-ups (knees if needed): 3x10", "Lunges: 3x12 (each leg)", "Plank: 3x30 seconds"]
  },
  { 
    day: "Tuesday", 
    focus: "Cardio & Endurance", 
    intensity: "Medium",
    description: "Get your heart rate up to burn calories.",
    routine: ["Brisk Walk / Jog: 30-40 mins", "Jumping Jacks: 3x20", "High Knees: 3x30 seconds"]
  },
  { 
    day: "Wednesday", 
    focus: "Lower Body & Core", 
    intensity: "High",
    description: "Target the legs and glutes, finishing with core.",
    routine: ["Glute Bridges: 3x15", "Side Lunges: 3x12", "Wall Sit: 3x45 seconds", "Russian Twists: 3x20"]
  },
  { 
    day: "Thursday", 
    focus: "Active Cardio / HIIT", 
    intensity: "High",
    description: "Short bursts of intense activity followed by rest.",
    routine: ["20s Sprint / 40s Walk (Repeat 10 times)", "Mountain Climbers: 3x30 seconds", "Burpees (slow): 3x10"]
  },
  { 
    day: "Friday", 
    focus: "Upper Body Strength", 
    intensity: "Medium",
    description: "Focus on arms, chest, and back.",
    routine: ["Push-ups: 3xMax", "Tricep Dips (chair): 3x12", "Superman (back extension): 3x15", "Arm Circles: 30 seconds"]
  },
  { 
    day: "Saturday", 
    focus: "Active Fun", 
    intensity: "Low-Medium",
    description: "Do something you enjoy! Hiking, swimming, or a long walk.",
    routine: ["45-60 minute scenic walk", "Sport of choice", "Dance workout"]
  }
];

// --- Database ---
const mealData = {
  breakfast: [
    {
      name: "Multigrain Thalipeeth",
      imagePrompt: "A rustic wooden plate featuring two golden-brown multigrain thalipeeth (flatbreads) with visible coriander and spices, served with a dollop of white butter and a side of thick yogurt. Marathi breakfast, warm lighting.",
      calories: "~300-350 kcal",
      ingredients: ["Bhajani Flour (Mix of Jowar, Bajra, Rice, Chana)", "Onion (finely chopped)", "Coriander", "Sesame Seeds", "Yogurt (Side)"],
      recipe: "1. Mix 1 cup Bhajani flour with onion, chili, coriander, and salt.\n2. Knead into a dough with warm water.\n3. Pat onto a pan to make a flatbread with a hole in the center.\n4. Cook with minimal oil until crisp.\n5. Serve with curd."
    },
    {
      name: "Kanda Poha (Healthy Version)",
      imagePrompt: "A steaming bowl of fluffy flattened rice (poha) garnished with fresh yellow sev, coriander, and a lemon wedge. Soft morning light, traditional Indian breakfast.",
      calories: "~250-300 kcal",
      ingredients: ["Poha (thick)", "Onion", "Mustard Seeds", "Turmeric", "Peanuts (roasted)", "Green Peas (optional)", "Lemon"],
      recipe: "1. Rinse 1.5 cups poha.\n2. Sauté mustard seeds, curry leaves, peanuts, and onion in 1 tsp oil.\n3. Add turmeric and salt.\n4. Add poha and steam for 2 mins.\n5. Finish with lemon juice and coriander."
    },
    {
      name: "Greek Yogurt & Berry Bowl",
      imagePrompt: "Close up food photography of a white ceramic bowl filled with thick greek yogurt, topped with fresh strawberries, blueberries, roasted almonds, and a drizzle of honey. Soft morning natural light, high resolution, appetizing.",
      calories: "~250-350 kcal",
      ingredients: ["Greek Yogurt (200g)", "Mixed Berries (1 handful)", "Almonds/Walnuts (1 tbsp)", "Honey (optional)"],
      recipe: "1. Take 1 full bowl (approx. 200g) of Greek yogurt or thick curd.\n2. Add a handful of mixed berries (fresh or frozen).\n3. Top with 1 tablespoon of mixed nuts and seeds.\n4. Optional: A small drizzle of honey."
    },
    {
      name: "Paneer Bhurji & Toast",
      imagePrompt: "A plate with scrambled indian cottage cheese (paneer) cooked with turmeric and coriander, served alongside a slice of toasted multigrain bread. Indian breakfast, warm lighting, steam rising.",
      calories: "~350-400 kcal",
      ingredients: ["Paneer (100g)", "Onion (1 small)", "Tomato (1 small)", "Green Chili", "Multigrain Bread (1 slice)", "Spices (Turmeric, Salt)"],
      recipe: "1. Crumble 100g of paneer.\n2. Sauté chopped onion, chili, and tomato in 1 tsp oil.\n3. Add turmeric, salt, and paneer. Cook 3-5 mins.\n4. Garnish with coriander.\n5. Serve with 1 multigrain toast."
    },
  ],
  lunch: [
    {
      name: "Jowar Bhakri & Pitla",
      imagePrompt: "A traditional Marathi meal setting with a rustic Jowar Bhakri (sorghum flatbread) and a bowl of yellow Pitla (gram flour curry), served with raw onion slices and green chili. Authentic village food style.",
      calories: "~350-400 kcal",
      ingredients: ["Jowar Flour (for 1 Bhakri)", "Besan (Gram Flour)", "Onion", "Green Chili", "Garlic", "Mustard Seeds"],
      recipe: "1. Make a dough of Jowar flour and hot water; pat into a bhakri and roast on flame.\n2. For Pitla: Sauté mustard seeds, garlic, chili, and onion.\n3. Add water, boil, then slowly whisk in besan to form a thick paste.\n4. Cook for 5 mins."
    },
    {
      name: "Sprouted Matki Usal",
      imagePrompt: "A bowl of spicy sprouted moth bean (matki) curry topped with coriander and coconut, served with a small portion of brown rice. Vibrant red gravy, healthy lunch.",
      calories: "~300-350 kcal",
      ingredients: ["Sprouted Matki (1.5 cups)", "Onion", "Tomato", "Godaa Masala (Marathi Spice)", "Brown Rice (1/2 cup)"],
      recipe: "1. Sauté onion, ginger-garlic paste, and tomato.\n2. Add turmeric, red chili powder, and Goda masala.\n3. Add sprouts and water. Pressure cook or simmer until soft.\n4. Serve with a small portion of rice or 1 chapati."
    },
    {
      name: "The Balanced Indian Plate",
      imagePrompt: "A stainless steel thali plate containing a bowl of yellow dal, a large portion of green spinach sabzi, a small bowl of cucumber salad, and two multigrain rotis. Balanced healthy indian meal, bright lighting.",
      calories: "~400-500 kcal",
      ingredients: ["Spinach/Seasonal Veg (2 cups)", "Dal/Rajma/Paneer (1 cup)", "Multigrain Atta (for 2 rotis)", "Salad Veggies (Cucumber, Tomato)"],
      recipe: "1. 50% Plate: Non-starchy sabzi (spinach, cauliflower, etc).\n2. 25% Plate: Protein (Dal, Rajma, or Paneer).\n3. 25% Plate: 1-2 multigrain rotis OR brown rice.\n4. Side: Salad or Raita."
    },
  ],
  snack: [
    {
      name: "Roasted Chana & Peanuts",
      imagePrompt: "A small bowl containing a mix of roasted bengal gram (chana) and skin-on peanuts. Simple healthy snack, wooden background.",
      calories: "~150-180 kcal",
      ingredients: ["Roasted Chana (1/2 cup)", "Roasted Peanuts (1 tbsp)", "Optional: Pinch of Chaat Masala"],
      recipe: "1. Mix roasted chana and a small handful of peanuts.\n2. Excellent source of fiber and protein to curb hunger."
    },
    {
      name: "Roasted Makhana",
      imagePrompt: "A wooden bowl filled with roasted fox nuts (makhana) sprinkled with black pepper and salt. Healthy snack, cozy vibe.",
      calories: "~100-150 kcal",
      ingredients: ["Makhana/Fox Nuts (1 cup)", "Black Pepper", "Rock Salt", "Ghee (1/4 tsp)"],
      recipe: "1. Dry roast 1 cup makhana in a pan until crisp (5-7 mins).\n2. Season with salt and black pepper.\n3. Optional: 1/4 tsp ghee for flavor."
    },
  ],
  dinner: [
    {
      name: "Masoor Amti (Whole Lentil Soup)",
      imagePrompt: "A comforting bowl of brown Masoor Amti (whole lentil curry) with a thin consistency, garnished with fresh coriander. Served in a copper bowl. Marathi comfort food.",
      calories: "~300-350 kcal",
      ingredients: ["Whole Masoor (Brown Lentils)", "Kokum or Tamarind", "Jaggery (tiny piece)", "Godaa Masala", "Garlic"],
      recipe: "1. Boil soaked masoor lentils.\n2. Temper with mustard seeds, curry leaves, garlic.\n3. Add cooked lentils, Goda masala, Kokum, and salt.\n4. Simmer for 10 mins. Have as a soup or with little rice."
    },
    {
      name: "Paneer & Veggie Stir-fry",
      imagePrompt: "A stir-fry pan filled with cubed paneer, broccoli florets, red bell peppers, and mushrooms coated in a light soy glaze. Steam rising, delicious healthy dinner.",
      calories: "~350-400 kcal",
      ingredients: ["Paneer (100g)", "Broccoli", "Bell Peppers (Red/Yellow)", "Mushrooms", "Soy Sauce", "Vinegar", "Garlic"],
      recipe: "1. Pan-sear 100g paneer cubes.\n2. Stir-fry 2 cups veggies (broccoli, peppers, mushrooms) in 1 tsp oil.\n3. Combine with paneer and 1 tbsp soy sauce/vinegar glaze."
    },
    {
      name: "Light Vegetable Stew",
      imagePrompt: "A creamy white vegetable stew with carrots, peas, and potatoes in a bowl, served with two soft appams. Kerala cuisine, food photography.",
      calories: "~350-400 kcal",
      ingredients: ["Carrots", "Peas", "Potatoes", "Light Coconut Milk (1.5 cups)", "Whole Spices (Cardamom, Clove)", "Appam Batter"],
      recipe: "1. Sauté spices, onion, ginger, chili.\n2. Cook diced veggies in water.\n3. Add peas and simmer.\n4. Finish with 1.5 cups LIGHT coconut milk (don't boil).\n5. Serve with 1-2 Appams."
    }
  ],
  fallback: [
    {
      name: "Hydration Time",
      imagePrompt: "A refreshing glass of water with mint leaves and lemon slices, sitting on a table in sunlight. Hydration concept.",
      calories: "0 kcal",
      ingredients: ["Water", "Lemon slices (optional)", "Mint leaves (optional)"],
      recipe: "1. Drink a large glass of water.\n2. Try herbal tea or green tea."
    }
  ]
};

// --- Helper Functions ---
function getMealForTime(dateObj) {
  const hour = dateObj.getHours();
  if (hour >= 7 && hour < 11) return { type: 'Breakfast', meals: mealData.breakfast };
  if (hour >= 11 && hour < 16) return { type: 'Lunch', meals: mealData.lunch };
  if (hour >= 16 && hour < 18) return { type: 'Snack', meals: mealData.snack };
  if (hour >= 18 && hour < 21) return { type: 'Dinner', meals: mealData.dinner };
  return { type: 'Rest Period', meals: mealData.fallback };
}

function getUpcomingMeals(count = 5) {
  const meals = [];
  const now = new Date();
  let currentHour = now.getHours();
  let currentDate = new Date(now);

  const slots = [
    { type: 'Breakfast', start: 7, end: 11, displayTime: '9:00 AM', key: 'breakfast' },
    { type: 'Lunch', start: 11, end: 16, displayTime: '1:00 PM', key: 'lunch' },
    { type: 'Snack', start: 16, end: 18, displayTime: '4:30 PM', key: 'snack' },
    { type: 'Dinner', start: 18, end: 21, displayTime: '7:30 PM', key: 'dinner' }
  ];

  let nextSlotIndex = slots.findIndex(s => currentHour < s.end);
  if (nextSlotIndex === -1) {
    nextSlotIndex = 0;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  for (let i = 0; i < count; i++) {
    const slot = slots[nextSlotIndex];
    const mealOptions = mealData[slot.key];
    const seed = currentDate.getDate() + nextSlotIndex + (currentDate.getMonth() * 30); 
    const meal = mealOptions[seed % mealOptions.length];

    meals.push({
      ...meal,
      type: slot.type,
      time: slot.displayTime,
      date: new Date(currentDate),
      isTomorrow: currentDate.getDate() !== now.getDate()
    });

    nextSlotIndex++;
    if (nextSlotIndex >= slots.length) {
      nextSlotIndex = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  
  return meals;
}

function getExerciseForDay() {
  const dayIndex = new Date().getDay();
  return exerciseSchedule[dayIndex];
}

// --- React Components ---

function Timeline() {
  const upcomingMeals = useMemo(() => getUpcomingMeals(5), []);

  return (
    <div className="w-full mb-8 mt-8">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-['Playfair_Display']">
          <Clock className="w-5 h-5 text-violet-500" /> Upcoming Timeline
        </h3>
        <div className="flex items-center gap-1 text-xs font-medium text-gray-400">
          <span>Scroll</span> <ArrowRight className="w-3 h-3" />
        </div>
      </div>
      
      <div className="flex overflow-x-auto pb-6 gap-4 snap-x snap-mandatory hide-scrollbar px-2">
        {upcomingMeals.map((meal, idx) => (
          <div key={idx} className="min-w-[260px] bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-lg snap-center transition-all hover:scale-105 hover:shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-violet-400 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${meal.isTomorrow ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {meal.isTomorrow ? 'Tomorrow' : 'Today'} • {meal.time}
                </span>
              </div>
              <div className="mb-1">
                <span className="text-xs font-semibold text-violet-500 uppercase tracking-wide">{meal.type}</span>
              </div>
              <h4 className="font-bold text-gray-800 leading-tight mb-2 text-sm font-['Playfair_Display']">{meal.name}</h4>
              <div className="flex flex-wrap gap-1 mb-2">
                {meal.ingredients.slice(0, 2).map((ing, i) => (
                   <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{ing.split(' ')[0]}</span>
                ))}
                {meal.ingredients.length > 2 && <span className="text-[10px] text-gray-400 px-1.5 py-0.5">+ {meal.ingredients.length - 2}</span>}
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
               <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                  <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {meal.calories}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExerciseCard() {
  const exercise = getExerciseForDay();

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden w-full border border-white/50 transition-all duration-300 hover:shadow-2xl">
      <div className="p-5 bg-gradient-to-r from-rose-50 to-orange-50 border-b border-rose-100">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 font-['Playfair_Display']">
              <Dumbbell className="w-5 h-5 text-rose-500" /> Movement of the Day
            </h3>
            <p className="text-xs font-medium text-rose-600 uppercase tracking-wider mt-1">
              {exercise.day} • {exercise.focus}
            </p>
          </div>
          <div className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold">
            {exercise.intensity} Intensity
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {exercise.description}
        </p>
        
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-inner">
          <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Routine</h4>
          <ul className="space-y-2">
            {exercise.routine.map((move, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="min-w-[20px] h-5 flex items-center justify-center bg-rose-100 text-rose-600 rounded-full text-[10px] font-bold mt-0.5">{idx + 1}</span>
                {move}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MealCard({ title, subtitle, accentColor, isFuture = false, timeOffset = 0 }) {
  const [meal, setMeal] = useState(null);
  const [mealType, setMealType] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const targetTime = new Date();
    targetTime.setHours(targetTime.getHours() + timeOffset);
    
    const { type, meals } = getMealForTime(targetTime);
    const seed = targetTime.getDate() + targetTime.getHours();
    const randomMeal = meals[seed % meals.length];
    
    setMeal(randomMeal);
    setMealType(type);
  }, [timeOffset]);

  useEffect(() => {
    if (meal && meal.imagePrompt) {
      generateMealImage(meal.imagePrompt);
    }
  }, [meal]);

  const generateMealImage = async (prompt) => {
    setImageLoading(true);
    setImageUrl(null);
    
    const cacheKey = `img_${meal.name}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        setImageUrl(cached);
        setImageLoading(false);
        return;
    }

    try {
      const apiKey = ""; 
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instances: [{ prompt: prompt }],
            parameters: { sampleCount: 1 }
          }),
        }
      );

      if (!response.ok) throw new Error(response.statusText);
      
      const result = await response.json();
      if (result.predictions && result.predictions[0]) {
        const base64Image = `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
        setImageUrl(base64Image);
        try { localStorage.setItem(cacheKey, base64Image); } catch(e) {}
      }
    } catch (error) {
      console.error("Failed to generate meal image:", error);
    } finally {
      setImageLoading(false);
    }
  };

  if (!meal) return <div className="bg-white/50 p-6 rounded-3xl shadow-sm animate-pulse h-64 w-full"></div>;

  return (
    <div className={`bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden w-full border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isFuture ? 'border-indigo-200 ring-2 ring-indigo-50' : 'border-white/50'}`}>
      <div className="p-5 flex justify-between items-center border-b border-gray-100/50">
        <div>
            <h3 className="text-lg font-bold text-gray-800 font-['Playfair_Display']">{title}</h3>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1">
                {isFuture ? <Calendar className="w-3 h-3" /> : <Clock className="w-3 h-3" />} 
                {mealType} • {subtitle}
            </p>
        </div>
        {isFuture && (
            <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <ShoppingBag className="w-3 h-3" /> Prep
            </div>
        )}
      </div>

      <div className="relative h-48 w-full bg-gray-100 overflow-hidden group cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        {imageLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 border-2 border-${accentColor}-500 border-t-transparent rounded-full animate-spin mb-2`}></div>
              <p className="text-xs text-gray-400 font-medium">AI Chef Cooking...</p>
            </div>
          </div>
        ) : imageUrl ? (
          <img 
            src={imageUrl} 
            alt={meal.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <Camera className="w-10 h-10" />
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 text-white">
            <h4 className="font-bold text-lg leading-tight shadow-black drop-shadow-md font-['Playfair_Display']">{meal.name}</h4>
            <div className="flex items-center gap-2 text-xs font-medium mt-1 opacity-90">
                <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                {meal.calories}
            </div>
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded || isFuture ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 bg-orange-50/50 border-b border-orange-100/50">
            <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-3 flex items-center gap-1">
                <ShoppingBag className="w-3 h-3" /> Ingredients Needed
            </h4>
            <div className="flex flex-wrap gap-2">
                {meal.ingredients && meal.ingredients.map((item, idx) => (
                    <span key={idx} className="text-xs font-medium bg-white border border-orange-100 text-gray-600 px-2 py-1 rounded-md shadow-sm">
                        {item}
                    </span>
                ))}
            </div>
        </div>

        <div className="p-5 bg-gray-50/50">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Preparation Guide</h4>
            <p className="text-gray-600 whitespace-pre-line leading-relaxed text-sm font-light">
              {meal.recipe}
            </p>
        </div>
      </div>

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full py-2 flex items-center justify-center text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors ${isExpanded ? 'text-gray-400' : `text-${accentColor}-500`}`}
      >
        {isExpanded ? "Close Details" : "View Ingredients & Recipe"} <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}

function ProgressTracker({ db, userId }) {
  const [targetWeight, setTargetWeight] = useState(80);
  const [newWeightInput, setNewWeightInput] = useState("");
  const [weightHistory, setWeightHistory] = useState([]);
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const startWeight = 92;
  
  const targetDocRef = useMemo(() => {
    if (!userId || !db) return null;
    return doc(db, `artifacts/${appId}/users/${userId}/settings/goal`);
  }, [db, userId]);

  const historyCollectionRef = useMemo(() => {
    if (!userId || !db) return null;
    return collection(db, `artifacts/${appId}/users/${userId}/weightEntries`);
  }, [db, userId]);

  useEffect(() => {
    if (!targetDocRef) return;
    getDoc(targetDocRef).then(snap => {
      if (snap.exists()) setTargetWeight(snap.data().target);
      else setDoc(targetDocRef, { target: 80 });
    });
  }, [targetDocRef]);

  useEffect(() => {
    if (!historyCollectionRef) return;
    const q = query(historyCollectionRef, orderBy("date", "desc"));
    return onSnapshot(q, (snapshot) => {
      setWeightHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [historyCollectionRef]);

  const saveTargetWeight = async () => {
    if (!targetDocRef) return;
    await setDoc(targetDocRef, { target: targetWeight });
    showMessage("Target updated!");
  };

  const handleAddWeight = async (e) => {
    e.preventDefault();
    const w = parseFloat(newWeightInput);
    if (!w || w < 40 || w > 200) return showMessage("Invalid weight", "error");
    await addDoc(historyCollectionRef, { weight: w, date: Timestamp.now() });
    setNewWeightInput("");
    showMessage("Weight logged!");
  };

  const showMessage = (msg, type = "success") => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(""), 3000);
  };

  const currentWeight = weightHistory[0]?.weight || startWeight;
  const totalToLose = startWeight - targetWeight;
  const lost = startWeight - currentWeight;
  const percent = Math.min(100, Math.max(0, (lost / totalToLose) * 100));

  if (!userId) return null;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 w-full border border-white/50">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl shadow-sm">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800 font-['Playfair_Display']">My Progress</h2>
            <p className="text-xs text-gray-400 font-medium">Goal: {targetWeight}kg</p>
          </div>
        </div>
        <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors">
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2 font-medium">
          <span className="text-emerald-600">{percent.toFixed(0)}% Achieved</span>
          <span className="text-gray-700">{currentWeight} <span className="text-gray-400">/ {targetWeight} kg</span></span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-1000 ease-out relative" style={{ width: `${percent}%` }}>
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className={`transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="pt-6 border-t border-gray-100 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Update Target Goal</label>
            <input 
              type="range" min="70" max="92" step="0.5" 
              value={targetWeight} 
              onChange={(e) => setTargetWeight(Number(e.target.value))}
              onMouseUp={saveTargetWeight}
              onTouchEnd={saveTargetWeight}
              className="w-full accent-emerald-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <form onSubmit={handleAddWeight} className="flex gap-2">
            <input 
              type="number" step="0.1" placeholder="Log current weight..." 
              value={newWeightInput} onChange={e => setNewWeightInput(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow shadow-sm"
            />
            <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95">
              <Plus className="w-5 h-5" />
            </button>
          </form>
          
          {message && <p className={`text-xs text-center font-medium ${message.type === 'error' ? 'text-red-500' : 'text-emerald-600'}`}>{message.text}</p>}

          <div className="bg-gray-50 rounded-xl p-4 max-h-32 overflow-y-auto border border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-1"><History className="w-3 h-3"/> Recent Logs</h4>
            {weightHistory.map(entry => (
              <div key={entry.id} className="flex justify-between text-sm py-2 border-b border-gray-200/50 last:border-0">
                <span className="text-gray-500 font-medium">{new Date(entry.date.seconds * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                <span className="font-bold text-gray-700">{entry.weight} kg</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RecipeHelper() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!ingredients.trim()) return;
    setLoading(true);
    setRecipe("");
    try {
      const apiKey = ""; 
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Create a healthy vegetarian recipe for weight loss using: ${ingredients}. Keep it simple. Return Title, Calories, Ingredients, Instructions.` }] }]
        })
      });
      const data = await res.json();
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        setRecipe(data.candidates[0].content.parts[0].text);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 w-full border border-white/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-violet-100 text-violet-600 p-2 rounded-xl shadow-sm">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 font-['Playfair_Display']">Chef AI</h2>
          <p className="text-xs text-gray-400">Custom recipes from your fridge</p>
        </div>
      </div>

      <textarea
        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none mb-4 resize-none shadow-inner transition-shadow"
        rows="2"
        placeholder="What ingredients do you have? (e.g. spinach, paneer)"
        value={ingredients}
        onChange={e => setIngredients(e.target.value)}
      />
      
      <button 
        onClick={generate} 
        disabled={loading}
        className="w-full bg-violet-600 text-white py-3 rounded-xl font-bold hover:bg-violet-700 transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2"
      >
        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {loading ? "Creating Magic..." : "Generate Recipe"}
      </button>

      {recipe && (
        <div className="mt-4 p-5 bg-violet-50/50 rounded-xl text-sm text-gray-700 whitespace-pre-line leading-relaxed border border-violet-100 shadow-sm">
          {recipe}
        </div>
      )}
    </div>
  );
}

/**
 * Main App
 */
export default function App() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@300;400;500;600&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      <AppContent />
    </>
  );
}

function AppContent() {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isFirebaseConfigured, setIsFirebaseConfigured] = useState(false);
  const [nextBreakfastOffset, setNextBreakfastOffset] = useState(12);

  useEffect(() => {
    if (firebaseConfig.apiKey) {
      setIsFirebaseConfigured(true);
      const app = initializeApp(firebaseConfig);
      setDb(getFirestore(app));
      const authInstance = getAuth(app);
      setAuth(authInstance);
      
      onAuthStateChanged(authInstance, async (u) => {
        if (u) {
          setUserId(u.uid);
        } else {
          try {
            if (initialAuthToken) {
              await signInWithCustomToken(authInstance, initialAuthToken);
            } else {
              await signInAnonymously(authInstance);
            }
          } catch (error) {
            console.error("Firebase auth failed", error);
            // Fallback to offline mode if auth fails
            setUserId("offline_user");
          }
        }
      });
    } else {
      console.warn("Firebase config not provided. Running in offline mode.");
      setUserId("offline_user"); // Use a string to indicate offline mode
    }

    const now = new Date();
    const currentHour = now.getHours();
    const hoursUntilTomorrow9Am = (24 - currentHour) + 9;
    setNextBreakfastOffset(hoursUntilTomorrow9Am);

  }, []);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 md:p-8 text-gray-900">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-teal-900 tracking-tight mb-3 font-['Playfair_Display']">
            Vitalis
          </h1>
          <p className="text-gray-500 font-medium tracking-wide uppercase text-xs">Nourish • Strength • Flow</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Tracker & AI & Exercise */}
          <div className="md:col-span-5 flex flex-col gap-8">
            {isFirebaseConfigured && userId !== 'offline_user' && <ProgressTracker db={db} userId={userId} />}
            <ExerciseCard />
            <RecipeHelper />
          </div>

          {/* Right Column: Meals */}
          <div className="md:col-span-7 flex flex-col gap-8">
            {/* Current Meal */}
            <MealCard 
                title="On The Menu" 
                subtitle="Eat Now" 
                accentColor="emerald" 
                timeOffset={0}
            />
            
            {/* Future Meal (Tomorrow's Breakfast) */}
            <MealCard 
                title="Meal Prep Radar" 
                subtitle="Tomorrow Morning" 
                accentColor="indigo" 
                isFuture={true}
                timeOffset={nextBreakfastOffset}
            />

            {/* NEW Timeline Component - Moved Below */}
            <Timeline />
          </div>
        </div>
        
        <footer className="text-center text-gray-400 text-xs mt-16 pb-8 font-medium">
          Images generated by Google Imagen 3 • Powered by Gemini
        </footer>
      </div>
    </div>
  );
}