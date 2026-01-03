const ADJECTIVES = [
  "Swift", "Clever", "Brave", "Happy", "Eager", "Calm", "Bright", "Sharp", "Kind", "Wise",
  "Gentle", "Bold", "Proud", "Noble", "Loyal", "Fair", "Free", "Just", "True", "Warm",
  "Cool", "Fresh", "Keen", "Grand", "High", "Rich", "Pure", "Soft", "Firm", "Safe",
  "Mighty", "Quick", "Smart", "Jolly", "Lively", "Nice", "Good", "Great", "Super", "Best"
];

const ANIMALS = [
  { name: "Tiger", emoji: "🐯" },
  { name: "Lion", emoji: "🦁" },
  { name: "Bear", emoji: "🐻" },
  { name: "Wolf", emoji: "🐺" },
  { name: "Fox", emoji: "🦊" },
  { name: "Eagle", emoji: "🦅" },
  { name: "Owl", emoji: "🦉" },
  { name: "Horse", emoji: "🐴" },
  { name: "Unicorn", emoji: "🦄" },
  { name: "Panda", emoji: "🐼" },
  { name: "Koala", emoji: "🐨" },
  { name: "Cat", emoji: "🐱" },
  { name: "Dog", emoji: "🐶" },
  { name: "Rabbit", emoji: "🐰" },
  { name: "Mouse", emoji: "🐭" },
  { name: "Dragon", emoji: "🐲" },
  { name: "Monkey", emoji: "🐵" },
  { name: "Frog", emoji: "🐸" },
  { name: "Penguin", emoji: "🐧" },
  { name: "Whale", emoji: "🐳" },
  { name: "Bee", emoji: "🐝" },
  { name: "Butterfly", emoji: "🦋" },
  { name: "Turtle", emoji: "🐢" },
  { name: "Dolphin", emoji: "🐬" }
];

export function generateRandomProfile() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(Math.random() * 900) + 100;
  
  return {
      name: `${adj} ${animal.name} ${num}`,
      emoji: animal.emoji
  };
}