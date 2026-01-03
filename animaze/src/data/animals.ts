import type { Animal } from "../types";

export const ANIMAL_MAP: Record<string, Array<Animal>> = {
  a: [{ name: "Alligator", emoji: "🐊", sound: "Snap! Snap! The alligator chomps its big jaws." }, { name: "Ant", emoji: "🐜", sound: "Scuttle scuttle! The tiny ant is marching." }],
  b: [{ name: "Bear", emoji: "🐻", sound: "Grrr! The bear is hungry for honey." }, { name: "Bee", emoji: "🐝", sound: "Bzzzzzz! I'm busy making honey." }],
  c: [{ name: "Cat", emoji: "🐱", sound: "Meow! Purr... purr..." }, { name: "Cow", emoji: "🐮", sound: "Moooo! Eat more grass." }],
  d: [{ name: "Dog", emoji: "🐶", sound: "Woof! Woof! I want to play fetch!" }, { name: "Duck", emoji: "🦆", sound: "Quack! Quack! Splash!" }],
  e: [{ name: "Elephant", emoji: "🐘", sound: "Pawoo! The elephant sprays water everywhere." }],
  f: [{ name: "Frog", emoji: "🐸", sound: "Ribbit! Ribbit! Hop hop hop." }, { name: "Fox", emoji: "🦊", sound: "Yip yip! The fox is sneaky." }],
  g: [{ name: "Giraffe", emoji: "🦒", sound: "Munch munch! The leaves are so high up here." }, { name: "Goat", emoji: "🐐", sound: "Maaaa! Maaaa!" }],
  h: [{ name: "Horse", emoji: "🐴", sound: "Neigh! Gallop gallop gallop!" }, { name: "Hippo", emoji: "🦛", sound: "Grunt! The hippo loves the water." }],
  i: [{ name: "Iguana", emoji: "🦎", sound: "Hiss... The iguana sits in the sun." }],
  j: [{ name: "Jellyfish", emoji: "🪼", sound: "Bloop bloop. Floating in the sea." }],
  k: [{ name: "Kangaroo", emoji: "🦘", sound: "Boing! Boing! I have a baby in my pouch." }, { name: "Koala", emoji: "🐨", sound: "Yawn... I love sleeping in eucalyptus trees." }],
  l: [{ name: "Lion", emoji: "🦁", sound: "ROAR! I am the king of the jungle!" }],
  m: [{ name: "Monkey", emoji: "🐒", sound: "Ooh ooh ah ah! Banana time!" }, { name: "Mouse", emoji: "🐭", sound: "Squeak squeak! Is that cheese?" }],
  n: [{ name: "Narwhal", emoji: "🦄", sound: "Splash! I'm the unicorn of the sea." }],
  o: [{ name: "Owl", emoji: "🦉", sound: "Hoo hoo! Who's there?" }, { name: "Octopus", emoji: "🐙", sound: "Glub glub. Look at all my arms!" }],
  p: [{ name: "Pig", emoji: "🐷", sound: "Oink oink! Mud is fun!" }, { name: "Panda", emoji: "🐼", sound: "Crunch crunch. Bamboo is delicious." }],
  q: [{ name: "Queen Bee", emoji: "👑🐝", sound: "Bow down to the Queen Bee! Bzzzzz!" }],
  r: [{ name: "Rabbit", emoji: "🐰", sound: "Hop hop! What's up doc?" }, { name: "Raccoon", emoji: "🦝", sound: "Chitter chatter! Trash is treasure." }],
  s: [{ name: "Sheep", emoji: "🐑", sound: "Baaaa! Time for a haircut." }, { name: "Snake", emoji: "🐍", sound: "Hiss... I'm slithering by." }],
  t: [{ name: "Tiger", emoji: "🐯", sound: "Grrr! I have stripes!" }, { name: "Turtle", emoji: "🐢", sound: "Slow and steady wins the race." }],
  u: [{ name: "Urial", emoji: "🐑", sound: "Baaaa! I have big curved horns." }],
  v: [{ name: "Vulture", emoji: "🦅", sound: "Caw caw! Circling in the sky." }],
  w: [{ name: "Wolf", emoji: "🐺", sound: "Awoooo! The moon is full." }, { name: "Whale", emoji: "🐳", sound: "Whaaaalesoooong..." }],
  x: [{ name: "X-ray Fish", emoji: "🐠", sound: "Bloop. You can see my bones!" }],
  y: [{ name: "Yak", emoji: "🐂", sound: "Grunt! It's cold in the mountains." }],
  z: [{ name: "Zebra", emoji: "🦓", sound: "Clip clop. Stripes are always in fashion." }],
};

export const ALL_ANIMALS: Animal[] = Object.values(ANIMAL_MAP).flat();
