import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrap: { flex: 1, minHeight: 250, alignItems: 'center', justifyContent: 'center', padding: 32 },
  icon: { color: '#A7F04A', fontSize: 36, marginBottom: 16 },
  title: { color: '#F7F7FB', fontSize: 20, fontWeight: '700', textAlign: 'center' },
  message: {
    color: '#9095A4',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 260,
  },
});
