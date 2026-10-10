import { Text } from 'react-native';
import { styles } from './FavoriteHeart.styles';

type Props = {
  selected: boolean;
  size: 'badge' | 'card' | 'details';
};

export function FavoriteHeart({ selected, size }: Props) {
  return (
    <Text
      accessible={false}
      style={[styles.heart, styles[size], selected ? styles.selected : styles.unselected]}
    >
      {selected ? '\u2665\uFE0E' : '\u2661\uFE0E'}
    </Text>
  );
}
