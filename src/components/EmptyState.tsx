import { Text, View } from 'react-native';
import { styles } from './EmptyState.styles';

type Props = {
  title: string;
  message: string;
  icon?: string;
};

export function EmptyState({ title, message, icon = '⌕' }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}
