import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#11141D',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1D212C',
  },
  cover: { height: 190, position: 'relative', overflow: 'hidden' },
  fill: { ...StyleSheet.absoluteFillObject },
  heart: {
    position: 'absolute',
    right: 14,
    top: 14,
    backgroundColor: 'rgba(9,11,17,0.76)',
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { padding: 15 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  name: { color: '#F7F7FB', fontSize: 18, fontWeight: '700', flex: 1 },
  rating: { color: '#D9E3C7', fontSize: 13 },
  category: { color: '#A7F04A', fontSize: 10, fontWeight: '700', letterSpacing: 1.1, marginTop: 7 },
  description: { color: '#9095A4', fontSize: 13, lineHeight: 19, marginTop: 8 },
});
