import { Text, TextInput, View } from 'react-native';
import { styles } from './SearchBar.styles';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
};

export function SearchBar({ value, onChangeText }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⌕</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Find your next favorite"
        placeholderTextColor="#777D8C"
        style={styles.input}
        returnKeyType="search"
        clearButtonMode="while-editing"
        accessibilityLabel="Search games by name"
      />
    </View>
  );
}
