// Avatar options for chat identity
// Using emoji-based avatars and public domain/historical figures to avoid copyright issues

export interface AvatarOption {
  id: string;
  display: string;
  category: string;
  name: string;
}

export const avatarOptions: AvatarOption[] = [
  // Classic Emojis
  { id: "smile", display: "😊", category: "Classic", name: "Happy Face" },
  { id: "cool", display: "😎", category: "Classic", name: "Cool" },
  { id: "star", display: "⭐", category: "Classic", name: "Star" },
  { id: "fire", display: "🔥", category: "Classic", name: "Fire" },
  { id: "rocket", display: "🚀", category: "Classic", name: "Rocket" },
  { id: "brain", display: "🧠", category: "Classic", name: "Brain" },
  { id: "heart", display: "❤️", category: "Classic", name: "Heart" },
  { id: "strong", display: "💪", category: "Classic", name: "Strong" },
  
  // Nature & Animals
  { id: "lion", display: "🦁", category: "Nature", name: "Lion" },
  { id: "eagle", display: "🦅", category: "Nature", name: "Eagle" },
  { id: "wolf", display: "🐺", category: "Nature", name: "Wolf" },
  { id: "phoenix", display: "🔥🐦", category: "Nature", name: "Phoenix" },
  { id: "tree", display: "🌳", category: "Nature", name: "Tree" },
  { id: "mountain", display: "🏔️", category: "Nature", name: "Mountain" },
  { id: "ocean", display: "🌊", category: "Nature", name: "Ocean" },
  { id: "sun", display: "☀️", category: "Nature", name: "Sun" },
  
  // Warriors & Heroes
  { id: "warrior", display: "⚔️", category: "Heroes", name: "Warrior" },
  { id: "shield", display: "🛡️", category: "Heroes", name: "Shield" },
  { id: "crown", display: "👑", category: "Heroes", name: "Crown" },
  { id: "ninja", display: "🥷", category: "Heroes", name: "Ninja" },
  { id: "viking", display: "⚡", category: "Heroes", name: "Viking" },
  { id: "samurai", display: "🗡️", category: "Heroes", name: "Samurai" },
  
  // Wisdom & Knowledge
  { id: "book", display: "📚", category: "Wisdom", name: "Scholar" },
  { id: "lightbulb", display: "💡", category: "Wisdom", name: "Thinker" },
  { id: "crystal", display: "🔮", category: "Wisdom", name: "Mystic" },
  { id: "telescope", display: "🔭", category: "Wisdom", name: "Explorer" },
  { id: "atom", display: "⚛️", category: "Wisdom", name: "Scientist" },
  
  // Zen & Peace
  { id: "lotus", display: "🧘", category: "Zen", name: "Meditator" },
  { id: "peace", display: "☮️", category: "Zen", name: "Peace" },
  { id: "yin-yang", display: "☯️", category: "Zen", name: "Balance" },
  { id: "leaf", display: "🍃", category: "Zen", name: "Zen Leaf" },
  { id: "bamboo", display: "🎋", category: "Zen", name: "Bamboo" },
  
  // Gaming & Pop Culture
  { id: "controller", display: "🎮", category: "Gaming", name: "Gamer" },
  { id: "dice", display: "🎲", category: "Gaming", name: "Dice" },
  { id: "trophy", display: "🏆", category: "Gaming", name: "Champion" },
  { id: "medal", display: "🥇", category: "Gaming", name: "Gold Medal" },
  
  // Historical Figures (Public Domain)
  { id: "einstein", display: "👨‍🔬", category: "Historical", name: "Einstein" },
  { id: "philosopher", display: "🧙", category: "Historical", name: "Philosopher" },
  { id: "artist", display: "👨‍🎨", category: "Historical", name: "Artist" },
  { id: "musician", display: "🎵", category: "Historical", name: "Musician" },
];

// Anonymous username generators
export const usernameAdjectives = [
  "Brave", "Wise", "Strong", "Calm", "Swift", "Noble", "Fierce", "Bright",
  "Bold", "Silent", "Free", "Rising", "Golden", "Silver", "Crystal", "Mystic",
  "Ancient", "Eternal", "Phoenix", "Dragon", "Tiger", "Eagle", "Wolf", "Lion",
  "Storm", "Thunder", "Ocean", "Mountain", "Forest", "Cosmic", "Lunar", "Solar"
];

export const usernameNouns = [
  "Warrior", "Sage", "Guardian", "Seeker", "Wanderer", "Dreamer", "Phoenix",
  "Spirit", "Soul", "Knight", "Monk", "Ranger", "Scholar", "Hero", "Champion",
  "Voyager", "Pioneer", "Explorer", "Sentinel", "Defender", "Pathfinder",
  "Traveler", "Nomad", "Pilgrim", "Keeper", "Watcher", "Shadow", "Light"
];

export const generateAnonymousUsername = (): string => {
  const adj = usernameAdjectives[Math.floor(Math.random() * usernameAdjectives.length)];
  const noun = usernameNouns[Math.floor(Math.random() * usernameNouns.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  return `${adj}${noun}${number}`;
};

export const getCategoryAvatars = (category: string) => {
  return avatarOptions.filter(a => a.category === category);
};

export const getAllCategories = () => {
  const categories = avatarOptions.map(a => a.category);
  return Array.from(new Set(categories));
};
