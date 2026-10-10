import rawGames from './games.json';
import { GAME_CATEGORIES, type Category, type Game } from '../types';

const games = validateGames(rawGames);

function createRecordContext(index: number, id?: string): string {
  const gameLabel = id ? ` with id "${id}"` : '';
  return `Game at index ${index}${gameLabel}`;
}

function requireNonEmptyString(
  value: unknown,
  field: string,
  context: string,
): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${context}: "${field}" must be a non-empty string.`);
  }

  return value;
}

function requireCategory(value: unknown, context: string): Category {
  const category =
    typeof value === 'string'
      ? GAME_CATEGORIES.find((validCategory) => validCategory === value)
      : undefined;

  if (!category) {
    throw new Error(
      `${context}: "category" must be one of ${GAME_CATEGORIES.join(', ')}.`,
    );
  }

  return category;
}

function requireRating(value: unknown, context: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 5) {
    throw new Error(`${context}: "rating" must be a finite number from 0 to 5.`);
  }

  return value;
}

function requireImageUrl(value: unknown, context: string): string {
  const image = requireNonEmptyString(value, 'image', context);

  // Avoid URL.hostname here: React Native's Hermes URL implementation may not
  // implement every URL accessor. The catalog only needs an absolute web URL.
  const isWebUrl = /^https?:\/\/[a-z0-9.-]+(?::\d+)?(?:[/?#][^\s]*)?$/i.test(image);
  if (!isWebUrl) {
    throw new Error(`${context}: "image" must be a valid HTTP or HTTPS URL.`);
  }

  return image;
}

function requireAccent(value: unknown, context: string): string {
  const accent = requireNonEmptyString(value, 'accent', context);
  if (!/^#[0-9A-Fa-f]{6}$/.test(accent)) {
    throw new Error(`${context}: "accent" must be a six-digit hex color.`);
  }

  return accent;
}

function validateGames(data: unknown): Game[] {
  if (!Array.isArray(data)) {
    throw new Error('Invalid game catalog: root value must be an array.');
  }

  const seenIds = new Set<string>();

  return data.map((record: unknown, index: number): Game => {
    if (typeof record !== 'object' || record === null || Array.isArray(record)) {
      throw new Error(`Game at index ${index} must be an object.`);
    }

    const fields = record as Record<string, unknown>;
    const id = requireNonEmptyString(fields.id, 'id', createRecordContext(index));
    const context = createRecordContext(index, id);

    if (seenIds.has(id)) {
      throw new Error(`${context}: "id" must be unique.`);
    }
    seenIds.add(id);

    return {
      id,
      name: requireNonEmptyString(fields.name, 'name', context),
      category: requireCategory(fields.category, context),
      description: requireNonEmptyString(fields.description, 'description', context),
      image: requireImageUrl(fields.image, context),
      rating: requireRating(fields.rating, context),
      players: requireNonEmptyString(fields.players, 'players', context),
      difficulty: requireNonEmptyString(fields.difficulty, 'difficulty', context),
      accent: requireAccent(fields.accent, context),
    };
  });
}

export async function loadGames(): Promise<Game[]> {
  // Keep an async boundary so the UI handles local and remote data the same way.
  await new Promise<void>((resolve) => setTimeout(resolve, 250));
  return games;
}

export function getGameById(id: string): Game | undefined {
  return games.find((game) => game.id === id);
}
