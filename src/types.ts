export const GAME_CATEGORIES = [
  'Action',
  'Puzzle',
  'Sports',
  'Racing',
  'Adventure',
  'Strategy',
  'Simulation',
  'Arcade',
  'Horror',
] as const;

export const CATEGORY_FILTERS = ['All', ...GAME_CATEGORIES] as const;

export type Category = (typeof GAME_CATEGORIES)[number];
export type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

export type Game = {
  id: string;
  name: string;
  category: Category;
  description: string;
  image: string;
  rating: number;
  players: string;
  difficulty: string;
  accent: string;
};

export type RootStackParamList = {
  Home: undefined;
  Favorites: undefined;
  Details: { gameId: string };
};
