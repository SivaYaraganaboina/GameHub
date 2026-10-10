import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#090B11', paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
  back: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: '#171B24',
  },
  backText: { color: '#F7F7FB', fontSize: 32, lineHeight: 34, marginTop: -3 },
  titleBlock: { flex: 1, marginLeft: 13 },
  eyebrow: { color: '#8E94A2', letterSpacing: 1.8, fontSize: 9, fontWeight: '700' },
  title: { color: '#F7F7FB', fontSize: 25, fontWeight: '800', marginTop: 2 },
  countPill: { backgroundColor: '#1B2029', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 18 },
  count: { color: '#A7F04A', fontWeight: '700' },
  persistenceNotice: { color: '#FFB45C', fontSize: 12, lineHeight: 18, marginBottom: 12 },
  list: { paddingBottom: 30 },
  empty: { flexGrow: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  state: { color: '#9399A8', marginTop: 12, fontSize: 13 },
});
