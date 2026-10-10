import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getGameById } from '../data/games';
import { EmptyState } from '../components/EmptyState';
import { GameArtwork } from '../components/GameArtwork';
import { FavoriteHeart } from '../components/FavoriteHeart';
import { useFavoritesStore } from '../store/favorites';
import type { RootStackParamList } from '../types';
import { styles } from './DetailsScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export function DetailsScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const game = getGameById(route.params.gameId);
  const favorite = useFavoritesStore((state) => state.favoriteIds.includes(route.params.gameId));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const hasHydrated = useFavoritesStore((state) => state.hasHydrated);
  const hydrationError = useFavoritesStore((state) => state.hydrationError);
  const persistenceError = useFavoritesStore((state) => state.persistenceError);
  const [saved, setSaved] = useState(false);

  if (!game) {
    return (
      <View style={[styles.missing, { paddingTop: insets.top }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <EmptyState
          title="Game not found"
          message="This game may have been removed from the catalog."
          icon="!"
        />
      </View>
    );
  }

  const favoriteActionDisabled = !hasHydrated || hydrationError;
  let favoriteStatusMessage: string | null = null;
  let favoriteStatusStyle = styles.feedback;

  if (hydrationError) {
    favoriteStatusMessage = 'Saved favorites could not be loaded. This action is unavailable.';
    favoriteStatusStyle = styles.persistenceError;
  } else if (persistenceError) {
    favoriteStatusMessage = 'Favorites changed for this session but could not be saved.';
    favoriteStatusStyle = styles.persistenceError;
  } else if (saved) {
    favoriteStatusMessage = favorite ? 'Added to your collection' : 'Removed from your collection';
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 28 }}
      >
        <View style={[styles.hero, { height: 380 + insets.top }]}>
          <GameArtwork
            uri={game.image}
            title={game.name}
            accent={game.accent}
            style={styles.fill}
          />
          <View style={styles.scrim} />
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.heroBack, { top: insets.top + 12 }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <View style={[styles.heroContent, { paddingTop: insets.top }]}>
            <Text style={styles.category}>{game.category.toUpperCase()} GAME</Text>
            <Text style={styles.heroTitle}>{game.name}</Text>
            <View style={styles.rating}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.ratingText}>
                {game.rating.toFixed(1)} <Text style={styles.ratingHint}>PLAYER RATING</Text>
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.sectionLabel}>ABOUT THE GAME</Text>
          <Text style={styles.description}>{game.description}</Text>

          <View style={styles.facts}>
            <View style={styles.fact}>
              <Text style={styles.factIcon}>◉</Text>
              <View>
                <Text style={styles.factLabel}>PLAYERS</Text>
                <Text style={styles.factValue}>{game.players}</Text>
              </View>
            </View>
            <View style={styles.fact}>
              <Text style={styles.factIcon}>✦</Text>
              <View>
                <Text style={styles.factLabel}>DIFFICULTY</Text>
                <Text style={styles.factValue}>{game.difficulty}</Text>
              </View>
            </View>
          </View>

          <Pressable
            disabled={favoriteActionDisabled}
            onPress={() => {
              toggleFavorite(game.id);
              setSaved(true);
            }}
            style={[styles.action, favorite && styles.actionSaved]}
            accessibilityRole="button"
            accessibilityState={{ disabled: favoriteActionDisabled, selected: favorite }}
          >
            <FavoriteHeart selected={favorite} size="details" />
            <Text style={[styles.actionText, favorite && styles.actionTextSaved]}>
              {favorite ? 'In your favorites' : 'Add to favorites'}
            </Text>
          </Pressable>

          {favoriteStatusMessage ? (
            <Text
              style={favoriteStatusStyle}
              accessibilityRole={hydrationError || persistenceError ? 'alert' : undefined}
              accessibilityLiveRegion="polite"
            >
              {favoriteStatusMessage}
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
