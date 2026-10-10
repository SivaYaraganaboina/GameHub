import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scroll: { height: 56, flexGrow: 0, flexShrink: 0 },
  row: { alignItems: 'center', gap: 9, paddingVertical: 8 },
  chip: {
    height: 40,
    minWidth: 56,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#292E3A',
    backgroundColor: '#11141D',
  },
  active: { backgroundColor: '#A7F04A', borderColor: '#A7F04A' },
  label: { color: '#9DA2B1', fontSize: 13, fontWeight: '600', includeFontPadding: false },
  activeLabel: { color: '#11140B' },
});
