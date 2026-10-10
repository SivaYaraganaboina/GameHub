import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ActivityIndicator, FlatList, Keyboard, Pressable, Text, View } from 'react-native';
import type { ListRenderItem } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { loadGames } from '../data/games';
import { CategoryFilters, type CategoryFilter } from '../components/CategoryFilters';
import { EmptyState } from '../components/EmptyState';
import { GameCard } from '../components/GameCard';
import { FavoriteHeart } from '../components/FavoriteHeart';
import { SearchBar } from '../components/SearchBar';
import { useFavoritesStore } from '../store/favorites';
import type { Game, RootStackParamList } from '../types';
import { styles } from './HomeScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const hasHydrated = useFavoritesStore((state) => state.hasHydrated);
  const hydrationError = useFavoritesStore((state) => state.hydrationError);
  const persistenceError = useFavoritesStore((state) => state.persistenceError);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('All');
  const favoriteCount = hasHydrated && !hydrationError ? favoriteIds.length : '…';

  useEffect(() => {
    let isActive = true;

    async function fetchGames() {
      try {
        const items = await loadGames();
        if (isActive) setGames(items);
      } catch {
        if (isActive) setError('We couldn’t load the game catalog. Please try again.');
      } finally {
        if (isActive) setLoading(false);
      }
    }

    void fetchGames();
    return () => {
      isActive = false;
    };
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredGames = useMemo(
    () => games.filter((game) => (
      game.name.toLowerCase().includes(normalizedQuery)
      && (category === 'All' || game.category === category)
    )),
    [games, normalizedQuery, category],
  );

  const openDetails = useCallback(
    (gameId: string) => navigation.navigate('Details', { gameId }),
    [navigation],
  );

  const renderGame: ListRenderItem<Game> = useCallback(({ item }) => (
    <GameCard
      game={item}
      favorite={favoriteIds.includes(item.id)}
      favoriteEnabled={hasHydrated && !hydrationError}
      onPress={() => openDetails(item.id)}
      onToggleFavorite={() => toggleFavorite(item.id)}
    />
  ), [favoriteIds, hasHydrated, hydrationError, openDetails, toggleFavorite]);

  let resultsContent: ReactNode;
  if (loading) {
    resultsContent = (
      <View style={styles.center}>
        <ActivityIndicator color="#A7F04A" />
        <Text style={styles.stateText}>Loading games…</Text>
      </View>
    );
  } else if (error) {
    resultsContent = <EmptyState title="Something went wrong" message={error} icon="!" />;
  } else {
    resultsContent = (
      <FlatList
        data={filteredGames}
        keyExtractor={(item) => item.id}
        renderItem={renderGame}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={filteredGames.length ? styles.list : styles.emptyList}
        ListEmptyComponent={(
          <EmptyState
            title="No games found"
            message="Try another search or choose a different category."
          />
        )}
      />
    );
  }

  let persistenceNotice: string | null = null;
  if (hydrationError) {
    persistenceNotice = 'Saved favorites could not be loaded. Favorite controls are unavailable.';
  } else if (persistenceError) {
    persistenceNotice = 'Favorites changed for this session but could not be saved.';
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <View style={styles.brand}>
          <Image
            source={require('../../assets/gamehub-mark.png')}
            style={styles.brandMark}
            contentFit="contain"
            accessible={false}
          />
          <View>
            <Text style={styles.eyebrow}>YOUR NEXT PLAY</Text>
            <Text style={styles.logo}>
              Game<Text style={styles.logoAccent}>Hub</Text><Text style={styles.dot}>.</Text>
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Favorites')}
          style={styles.favoritesButton}
          accessibilityRole="button"
          accessibilityLabel="Open favorites"
        >
          <FavoriteHeart selected size="badge" />
          <Text style={styles.favLabel}> {favoriteCount}</Text>
        </Pressable>
      </View>

      {persistenceNotice ? (
        <Text style={styles.persistenceNotice} accessibilityRole="alert">
          {persistenceNotice}
        </Text>
      ) : null}

      <View style={styles.content}>
        <Text style={styles.heading}>Find your fun.</Text>
        <Text style={styles.subheading}>A little play goes a long way.</Text>
        <SearchBar value={query} onChangeText={setQuery} />
        <CategoryFilters
          selected={category}
          onSelect={(nextCategory) => {
            Keyboard.dismiss();
            setCategory(nextCategory);
          }}
        />

        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Popular games</Text>
          <Text style={styles.count}>{filteredGames.length} GAMES</Text>
        </View>
        {resultsContent}
      </View>
    </View>
  );
}
