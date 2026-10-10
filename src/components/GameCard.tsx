import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { GameArtwork } from './GameArtwork';
import { FavoriteHeart } from './FavoriteHeart';
import type { Game } from '../types';
import { styles } from './GameCard.styles';

type Props = {
  game: Game;
  favorite: boolean;
  favoriteEnabled: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
};

export const GameCard = memo(function GameCard({
  game,
  favorite,
  favoriteEnabled,
  onPress,
  onToggleFavorite,
}: Props) {
  const favoriteLabel = favorite
    ? `Remove ${game.name} from favorites`
    : `Add ${game.name} to favorites`;

  return (
    <Pressable
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`Open ${game.name}`}
    >
      <View style={styles.cover}>
        <GameArtwork uri={game.image} title={game.name} accent={game.accent} style={styles.fill} />
        <Pressable
          disabled={!favoriteEnabled}
          onPress={(event) => {
            event.stopPropagation();
            onToggleFavorite();
          }}
          style={styles.heart}
          accessibilityRole="button"
          accessibilityState={{ disabled: !favoriteEnabled, selected: favorite }}
          accessibilityLabel={favoriteLabel}
        >
          <FavoriteHeart selected={favorite} size="card" />
        </Pressable>
      </View>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>{game.name}</Text>
          <Text style={styles.rating}>★ {game.rating.toFixed(1)}</Text>
        </View>
        <Text style={styles.category}>
          {game.category.toUpperCase()}  ·  {game.difficulty}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {game.description}
        </Text>
      </View>
    </Pressable>
  );
});
