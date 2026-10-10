import { useState } from 'react';
import { Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { styles } from './GameArtwork.styles';

type Props = {
  uri: string;
  title: string;
  accent: string;
  style: StyleProp<ViewStyle>;
};

export function GameArtwork({ uri, title, accent, style }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <View style={[styles.wrap, { backgroundColor: accent }, style]}>
      {failed ? (
        <Text style={styles.initial}>{title.charAt(0)}</Text>
      ) : (
        <Image
          source={{ uri }}
          style={styles.image}
          contentFit="cover"
          transition={180}
          onError={() => setFailed(true)}
        />
      )}
    </View>
  );
}
