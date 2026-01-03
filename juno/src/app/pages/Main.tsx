import React, { useState, useEffect, useMemo } from 'react';
// Import Redwood SDK hooks
import { useAuth, useStore, useCollection } from '@redwood.dev/react';

// --- Firebase Configuration ---
// The appId is still needed for Firestore paths
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
// Firebase config and auth tokens are no longer needed here;
// Redwood handles initialization via its providers.

// --- Icon Components (from Lucide-React) ---
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
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);


// --- Database (Meal Plan) ---
const mealData = {
  breakfast: [
    {
      name: "Greek Yogurt / Curd Bowl",
      calories: "~250-350 kcal",
      recipe: "1. Take 1 full bowl (approx. 200g) of Greek yogurt or thick curd.\n2. Add a handful of mixed berries (fresh or frozen).\n3. Top with 1 tablespoon of mixed nuts and seeds (like almonds, walnuts, or chia seeds).\n4. Optional: A small drizzle of honey or maple syrup."
    },
    {
      name: "Paneer Bhurji",
      calories: "~350-400 kcal",
      recipe: "1. Crumble 100g of paneer.\n2. Sauté 1 small chopped onion, 1/2 green chili, and 1 small chopped tomato in 1 tsp of oil.\n3. Add turmeric, coriander powder, and salt.\n4. Add the crumbled paneer and cook for 3-5 minutes.\n5. Garnish with fresh coriander.\n6. Serve with 1 multigrain roti or toast."
    },
    {
      name: "Besan or Moong Dal Chilla",
      calories: "~300-350 kcal",
      recipe: "1. Make a batter using 1 cup of besan (gram flour) or soaked moong dal, water, salt, turmeric, and ajwain.\n2. Add finely chopped onions, tomatoes, and coriander to the batter.\n3. Lightly grease a non-stick pan with 1/2 tsp of oil.\n4. Pour a ladleful of batter and spread into a thin circle, like a pancake.\n5. Cook on both sides until golden brown.\n6. Serve 2 chillas with mint chutney and a side of curd."
    },
    {
      name: "South Indian Idli & Sambhar",
      calories: "~250-300 kcal",
      recipe: "1. Serve 2-3 steamed idlis.\n2. Accompany with 1 large bowl of homemade sambhar (ensure it is thick with lentils and vegetables for protein and fiber).\n3. Have 1 tablespoon of coconut chutney (in moderation)."
    },
  ],
  lunch: [
    {
      name: "The Balanced Indian Plate",
      calories: "~400-500 kcal",
      recipe: "1. Fill 50% of your plate (1-2 cups) with a non-starchy sabzi (e.g., bhindi, lauki, spinach, cauliflower).\n2. Fill 25% of your plate (1 cup) with a protein source (e.g., Dal Tadka, Rajma, Chana Masala, or Paneer Sabzi).\n3. Fill the remaining 25% with carbs (e.g., 1-2 multigrain rotis OR 1/2 cup cooked brown rice).\n4. A side of cucumber-tomato salad or small bowl of raita is great."
    },
    {
      name: "Paneer Tikka Salad",
      calories: "~350-400 kcal",
      recipe: "1. Cube 100g of paneer. Marinate in 2 tbsp curd, 1 tsp ginger-garlic paste, 1/2 tsp turmeric, and 1/2 tsp garam masala for 15 minutes.\n2. Grill or pan-sear the paneer cubes until golden.\n3. Toss with 2-3 cups of mixed greens (lettuce, spinach, rocket), cucumber, cherry tomatoes, and sliced onion.\n4. Drizzle with a simple lemon-tahini dressing or just lemon juice and black salt."
    },
    {
      name: "South Indian Sambhar & Rice",
      calories: "~350-450 kcal",
      recipe: "1. Serve 1 large bowl of homemade sambhar, rich with lentils and vegetables.\n2. Add 1/2 cup of cooked brown rice.\n3. Serve with a generous portion (1 cup) of a vegetable poriyal (e.g., cabbage, beans, or carrot) made with minimal coconut and oil."
    },
  ],
  snack: [
    {
      name: "Roasted Makhana or Chana",
      calories: "~100-150 kcal",
      recipe: "1. Take 1 large bowl (about 30g) of makhana (fox nuts) or roasted chana (chickpeas).\n2. If making makhana, dry roast in a pan for 5-7 minutes until crispy.\n3. Add a pinch of salt and black pepper. A tiny (1/4 tsp) drizzle of ghee can be added for flavor."
    },
    {
      name: "Sprouts Chaat",
      calories: "~100-150 kcal",
      recipe: "1. Take 1 cup of boiled moong sprouts.\n2. Add chopped tomato, onion, and cucumber.\n3. Squeeze fresh lemon juice.\n4. Season with a pinch of chaat masala and black salt. Mix well."
    },
    {
      name: "Small Bowl of Curd",
      calories: "~80-100 kcal",
      recipe: "1. Have 1 small bowl (approx. 100g) of plain, homemade curd.\n2. Optional: Add a pinch of roasted cumin powder."
    }
  ],
  dinner: [
    {
      name: "Paneer & Veggie Stir-fry",
      calories: "~350-400 kcal",
      recipe: "1. Cube 100g of paneer. Pat dry and lightly pan-sear in a non-stick pan until golden. Set aside.\n2. In the same pan, add 1 tsp of sesame or olive oil.\n3. Add 2 cloves of minced garlic and 1/2 inch grated ginger. Sauté for 30 seconds.\n4. Add 2 cups of chopped mixed vegetables (broccoli, bell peppers, mushrooms, onions, carrots).\n5. Stir-fry on high heat for 3-4 minutes until crisp-tender.\n6. Add the paneer back. Add 1 tbsp soy sauce, 1 tsp vinegar, and 1/2 tsp black pepper.\n7. Toss to combine and serve hot."
    },
    {
      name: "Light Vegetable Stew (Ishtu)",
      calories: "~350-400 kcal (with 2 Appams)",
      recipe: "1. In 1 tsp coconut oil, temper 2 cardamoms, 3 cloves, 1-inch cinnamon, and 1/2 tsp pepperrns.\n2. Sauté 1 sliced onion, 1-inch julienned ginger, and 1 slit green chili until soft.\n3. Add 2 cups of mixed diced vegetables (potato, carrot, green beans) and 1/2 cup water. Add salt, cover, and cook until tender (about 10-12 mins).\n4. Add 1/2 cup green peas and cook for 2 more minutes.\n5. Turn heat to low and stir in 1.5 cups of *light* coconut milk. Heat gently for 3-4 minutes. Do not boil.\n6. Serve with 1-2 appams."
    },
    {
      name: "High-Protein Dal & Sabzi",
      calories: "~300-350 kcal",
      recipe: "1. Have 1 large bowl of thick dal (like moong or masoor) or sambhar.\n2. Pair with 1.5-2 cups of a dry or semi-dry vegetable (sabzi) like Bhindi Masala, Baingan Bharta, or Cabbage Matar.\n3. This meal is filling and high in fiber and protein, with minimal carbs if you skip the roti/rice."
    }
  ],
  fallback: [
    {
      name: "Time to Hydrate!",
      calories: "0 kcal",
      recipe: "It's outside of your planned eating window (9am - 7pm). This is a great time to focus on hydration.\n\n1. Drink a large glass of water.\n2. You can also have herbal tea (like peppermint or chamomile) or green tea."
    }
  ]
};

// --- Helper Functions ---
function getMealForCurrentTime() {
  const hour = new Date().getHours();
  // 7am - 10:59am: Breakfast
  if (hour >= 7 && hour < 11) {
    return { type: 'Breakfast', meals: mealData.breakfast };
  }
  // 11am - 3:59pm: Lunch
  if (hour >= 11 && hour < 16) {
    return { type: 'Lunch', meals: mealData.lunch };
  }
  // 4pm - 5:59pm: Snack
  if (hour >= 16 && hour < 18) {
    return { type: 'Snack', meals: mealData.snack };
  }
  // 6pm - 8:59pm: Dinner
  if (hour >= 18 && hour < 21) {
    return { type: 'Dinner', meals: mealData.dinner };
  }
  // All other times
  return { type: 'Rest Period', meals: mealData.fallback };
}

// --- React Components ---

/**
 * Meal Suggestion Card Component
 */
function MealSuggestionCard() {
  const [suggestedMeal, setSuggestedMeal] = useState(null);
  const [mealType, setMealType] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Determine meal type and select a random meal on component mount
    const { type, meals } = getMealForCurrentTime();
    const randomMeal = meals[Math.floor(Math.random() * meals.length)];
    setSuggestedMeal(randomMeal);
    setMealType(type);
  }, []);

  if (!suggestedMeal) {
    return <div className="bg-white p-6 rounded-xl shadow-lg animate-pulse h-48 w-full max-w-lg"></div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg transition-all duration-300">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Today's Suggestion</h2>
            <p className="text-sm text-gray-500">It's {mealType} time!</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle recipe"
        >
          <ChevronDown className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-blue-700">{suggestedMeal.name}</h3>
        <p className="text-sm font-medium text-gray-600 flex items-center mt-1">
          <Zap className="w-4 h-4 mr-1 text-yellow-500" />
          {suggestedMeal.calories}
        </p>
      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-2">Recipe / Guide:</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
            {suggestedMeal.recipe}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Progress Tracker Card Component
 */
function ProgressTracker() {
  const { currentUser } = useAuth(); // Get user from Redwood
  const userId = currentUser?.uid;

  const [targetWeight, setTargetWeight] = useState(80);
  const [newWeightInput, setNewWeightInput] = useState("");
  const [message, setMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const startWeight = 92; // As per your initial data

  // Define Firestore paths using useMemo
  const targetDocPath = useMemo(() => {
    if (!userId) return null;
    return `artifacts/${appId}/users/${userId}/settings/goal`;
  }, [userId]);

  const historyCollectionPath = useMemo(() => {
    if (!userId) return null;
    return `artifacts/${appId}/users/${userId}/weightEntries`;
  }, [userId]);

  // Use Redwood hooks to interact with Firestore
  const [goalData, { set: setGoal, loading: goalLoading }] = useStore(targetDocPath);
  const [weightHistory, { add: addWeightEntry, loading: historyLoading }] = useCollection(historyCollectionPath, {
    orderBy: ["date", "desc"]
  });

  // Effect to sync Firestore goal data with local state
  useEffect(() => {
    if (goalData && typeof goalData.target === 'number') {
      setTargetWeight(goalData.target);
    } else if (!goalLoading && !goalData && setGoal) {
      // No goal doc exists, create it with the default
      setGoal({ target: 80 }).catch(e => console.error("Failed to set initial goal:", e));
    }
  }, [goalData, goalLoading, setGoal]);
  
  const handleTargetChange = (e) => {
    setTargetWeight(Number(e.target.value));
  };
  
  const saveTargetWeight = async () => {
    try {
      await setGoal({ target: targetWeight });
      showMessage("Target weight updated!");
    } catch (e) {
      console.error("Error setting target weight: ", e);
      showMessage("Error saving target.", "error");
    }
  };

  const handleAddWeight = async (e) => {
    e.preventDefault();
    const weight = parseFloat(newWeightInput);
    if (isNaN(weight) || weight < 40 || weight > 200) {
      showMessage("Please enter a valid weight.", "error");
      return;
    }

    try {
      await addWeightEntry({
        weight: weight,
        date: new Date() // Redwood SDK handles JS Date to Timestamp conversion
      });
      setNewWeightInput("");
      showMessage("Weight logged successfully!");
    } catch (e) {
      console.error("Error adding weight entry: ", e);
      showMessage("Error logging weight.", "error");
    }
  };
  
  const showMessage = (msg, type = "success") => {
    setMessage({ text: msg, type: type });
    setTimeout(() => setMessage(""), 3000);
  };

  // --- Progress Calculation ---
  const currentWeight = (weightHistory && weightHistory.length > 0) ? weightHistory[0].weight : startWeight;
  const totalWeightToLose = startWeight - targetWeight;
  const weightLostSoFar = startWeight - currentWeight;
  
  let percentageAchieved = 0;
  if (totalWeightToLose > 0) {
    percentageAchieved = (weightLostSoFar / totalWeightToLose) * 100;
  }
  percentageAchieved = Math.max(0, Math.min(100, percentageAchieved));
  // --- End of Progress Calculation ---
  
  if (!userId) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <p className="text-gray-600 text-center">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 text-green-600 p-2 rounded-full">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Progress Tracker</h2>
            <p className="text-xs text-gray-400" title="This is your unique ID for data storage">User ID: {userId}</p>
          </div>
        </div>
         <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle progress details"
        >
          <ChevronDown className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {/* --- Progress Bar --- */}
      <div className="mb-4">
        <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
          <span>Goal: {percentageAchieved.toFixed(0)}% Complete</span>
          <span>
            <span className="font-bold">{currentWeight.toFixed(1)}kg</span> / {targetWeight}kg
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-green-500 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${percentageAchieved}%` }}
          ></div>
        </div>
      </div>
      {/* --- End of Progress Bar --- */}


      {/* Collapsible Content */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-screen' : 'max-h-0'}`}
      >
        {/* Target Weight Slider */}
        <div className="mb-4 pt-4 border-t">
          <label htmlFor="targetWeight" className="block text-sm font-medium text-gray-700 mb-1">
            Set Your Target Weight: <span className="font-bold text-blue-600">{targetWeight} kg</span>
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-500">80 kg</span>
            <input
              type="range"
              id="targetWeight"
              min="80"
              max="92"
              step="0.5"
              value={targetWeight}
              onChange={handleTargetChange}
              onMouseUp={saveTargetWeight} // Save when user releases slider
              onTouchEnd={saveTargetWeight} // Save for touch devices
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-sm font-medium text-gray-500">92 kg</span>
          </div>
        </div>

        {/* Add New Weight */}
        <form onSubmit={handleAddWeight} className="mb-4">
          <label htmlFor="currentWeight" className="block text-sm font-medium text-gray-700 mb-1">
            Log Your Current Weight
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              step="0.1"
              id="currentWeight"
              value={newWeightInput}
              onChange={(e) => setNewWeightInput(e.target.value)}
              className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 91.5"
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {message && (
             <p className={`text-sm mt-2 ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
               {message.text}
             </p>
          )}
        </form>

        {/* Weight History */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <History className="w-5 h-5 mr-2 text-gray-500" />
            Weight History
          </h3>
          <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
            {(historyLoading && !weightHistory) ? (
              <p className="text-sm text-gray-500 text-center py-4">Loading history...</p>
            ) : (weightHistory && weightHistory.length === 0) ? (
              <p className="text-sm text-gray-500 text-center py-4">No weight logged yet. Add your first entry!</p>
            ) : (
              weightHistory.map((entry) => (
                <div key={entry.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="font-semibold text-gray-700">{entry.weight} kg</span>
                  <span className="text-xs text-gray-500">
                    {/* Redwood SDK converts Firestore Timestamps to JS Date objects */}
                    {entry.date.toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div> {/* End of collapsible content */}
    </div>
  );
}

// --- AI COMPONENT ---

/**
 * AI Recipe Helper Card
 */
function RecipeHelper() {
  const [ingredients, setIngredients] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateRecipe = async () => {
    if (!ingredients.trim()) {
      setError("Please enter some ingredients.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    setGeneratedRecipe("");

    const systemPrompt = "You are a helpful nutritionist and chef specializing in healthy, vegetarian Indian cuisine for weight loss. The user is on a diet plan to go from 92kg to 80kg and eats dairy (paneer, curd, yogurt) but not eggs or tofu. Their meals are generally in the 300-500 calorie range. When given ingredients, create a simple, healthy, low-calorie recipe. Start with a creative 'Recipe Name:', then 'Approx. Calories:', then 'Ingredients:' (using the provided ones and adding any simple extras), and finally 'Instructions:'. If the ingredients are unsuitable for a healthy meal, politely explain why and suggest an alternative.";
    
    const userPrompt = `Create a recipe using the following ingredients: ${ingredients}`;
    const apiKey = ""; // This will be handled by the environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
    };

    try {
      // --- Start of network request with exponential backoff ---
      let response;
      let delay = 1000; // start with 1 second
      for (let i = 0; i < 5; i++) { // Retry up to 5 times
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          break; // Success
        } else if (response.status === 429 || response.status >= 500) {
          // Retry on rate limiting or server errors
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Double the delay
        } else {
          // Don't retry on other client errors (e.g., 400 Bad Request)
          throw new Error(`API error: ${response.statusText}`);
        }
      }
      // --- End of network request with exponential backoff ---

      if (!response.ok) {
        throw new Error(`API error after retries: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts[0].text) {
        const text = result.candidates[0].content.parts[0].text;
        setGeneratedRecipe(text);
      } else {
        // Handle cases where the response might be blocked or empty
        if (result.candidates && result.candidates[0].finishReason === "SAFETY") {
          throw new Error("The response was blocked due to safety settings.");
        } else {
          throw new Error("Invalid response structure from API.");
        }
      }

    } catch (err) {
      console.error("Error generating recipe:", err);
      setError(`Sorry, I couldn't generate a recipe right now. ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">✨ AI Recipe Helper</h2>
          <p className="text-sm text-gray-500">Got ingredients? Get a recipe!</p>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-1">
          Enter ingredients you have (e.g., "paneer, spinach, tomato"):
        </label>
        <textarea
          id="ingredients"
          rows="3"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., cauliflower, peas, onion, curd..."
        />
      </div>

      <button
        onClick={handleGenerateRecipe}
        disabled={isLoading}
        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        ) : (
          <Sparkles className="w-5 h-5 mr-2" />
        )}
        {isLoading ? "Generating..." : "Generate Recipe"}
      </button>

      {error && (
        <p className="text-sm text-red-600 mt-3">{error}</p>
      )}

      {generatedRecipe && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-2">Your Custom Recipe:</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-md">
            {generatedRecipe}
          </p>
        </div>
      )}
    </div>
  );
}


/**
 * Main App Component
 */
export default function App() {
  const { currentUser, loading: authLoading } = useAuth(); // Get auth state from Redwood

  // Show loading spinner while auth state is being determined
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-gray-600">Loading Your Plan...</p>
      </div>
    );
  }

  // Show a login prompt if user is not authenticated.
  // In a real Redwood app, a router would likely handle this.
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome!</h1>
          <p className="text-gray-600">Please sign in to access your diet and progress hub.</p>
          {/* In a real app, a <LoginButton /> component would go here */}
        </div>
      </div>
    );
  }

  // User is authenticated, show the main app
  return (
    <div className="antialiased text-gray-900 bg-gray-100 min-h-screen p-4 md:p-8 font-['Inter',_sans-serif]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Your Personal Diet & Progress Hub
        </h1>
        <div className="flex flex-col gap-6 items-center">
          {/* Card 1: Progress Tracker */}
          {/* It will now get the userId from its own useAuth() hook */}
          <ProgressTracker />

          {/* Card 2: Meal Suggestion */}
          <MealSuggestionCard />

          {/* Card 3: AI Helper */}
          <RecipeHelper />
        </div>
      </div>
    </div>
  );
}
