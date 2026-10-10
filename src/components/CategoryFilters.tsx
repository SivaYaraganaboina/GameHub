import { Pressable, ScrollView, Text } from 'react-native';
import { CATEGORY_FILTERS } from '../types';
import type { CategoryFilter } from '../types';
import { styles } from './CategoryFilters.styles';

export type { CategoryFilter } from '../types';

type Props = {
  selected: CategoryFilter;
  onSelect: (category: CategoryFilter) => void;
};

export function CategoryFilters({ selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.row}
    >
      {CATEGORY_FILTERS.map((category) => (
        <Pressable
          key={category}
          onPress={() => onSelect(category)}
          accessibilityRole="button"
          accessibilityState={{ selected: selected === category }}
          style={[styles.chip, selected === category && styles.active]}
        >
          <Text style={[styles.label, selected === category && styles.activeLabel]}>{category}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
