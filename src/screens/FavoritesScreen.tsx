import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import type { ListRenderItem } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { loadGames } from '../data/games';
import { EmptyState } from '../components/EmptyState';
import { GameCard } from '../components/GameCard';
import { useFavoritesStore } from '../store/favorites';
import type { Game, RootStackParamList } from '../types';
import { styles } from './FavoritesScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

export function FavoritesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const hasHydrated = useFavoritesStore((state) => state.hasHydrated);
  const hydrationError = useFavoritesStore((state) => state.hydrationError);
  const persistenceError = useFavoritesStore((state) => state.persistenceError);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function fetchGames() {
      try {
        const items = await loadGames();
        if (isActive) setGames(items);
      } catch {
        if (isActive) setError(true);
      } finally {
        if (isActive) setLoading(false);
      }
    }

    void fetchGames();
    return () => {
      isActive = false;
    };
  }, []);

  const favorites = games.filter((game) => favoriteIds.includes(game.id));
  const renderFavorite: ListRenderItem<Game> = useCallback(({ item }) => (
    <GameCard
      game={item}
      favorite
      favoriteEnabled={hasHydrated && !hydrationError}
      onPress={() => navigation.navigate('Details', { gameId: item.id })}
      onToggleFavorite={() => toggleFavorite(item.id)}
    />
  ), [hasHydrated, hydrationError, navigation, toggleFavorite]);

  let collectionContent: ReactNode;
  if (loading || !hasHydrated) {
    collectionContent = (
      <View style={styles.center}>
        <ActivityIndicator color="#A7F04A" />
        <Text style={styles.state}>Getting your collection…</Text>
      </View>
    );
  } else if (hydrationError) {
    collectionContent = (
      <EmptyState
        title="Favorites unavailable"
        message="Saved favorites could not be loaded from storage."
        icon="!"
      />
    );
  } else if (error) {
    collectionContent = (
      <EmptyState
        title="Couldn’t load favorites"
        message="Please go back and try again."
        icon="!"
      />
    );
  } else {
    collectionContent = (
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderFavorite}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={favorites.length ? styles.list : styles.empty}
        ListEmptyComponent={(
          <EmptyState
            title="Your collection is waiting"
            message="Tap the heart on a game to save it here."
            icon="♡"
          />
        )}
      />
    );
  }

  const showPersistenceNotice = !loading && hasHydrated && !hydrationError && persistenceError;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 10 }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.back}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View style={styles.titleBlock}>
          <Text style={styles.eyebrow}>YOUR COLLECTION</Text>
          <Text style={styles.title}>Favorites</Text>
        </View>
        <View style={styles.countPill}>
          <Text style={styles.count}>{favoriteIds.length}</Text>
        </View>
      </View>

      {showPersistenceNotice ? (
        <Text style={styles.persistenceNotice} accessibilityRole="alert">
          Favorites changed for this session but could not be saved.
        </Text>
      ) : null}
      {collectionContent}
    </View>
  );
}
