// styles/header.js
import { StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';

export const header = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingTop: 16,
    paddingBottom: 2,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 6 },
    }),
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { width: 290, height: 80, resizeMode: 'contain' },
  iconBtn: { padding: 10, borderRadius: 20 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 35,
  },

  menu: {
    position: 'absolute',
    top: 60,
    right: 14,
    zIndex: 40,
    minWidth: 260,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 14, shadowOffset: { width: 0, height: 10 } },
      android: { elevation: 12 },
    }),
  },

  // profile header row
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  avatar: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#E9FFF2',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(15,81,50,0.12)',
  },
  userName: { fontWeight: '800', fontSize: 14, color: colors.textDark },
  userHint: { fontSize: 12, color: 'rgba(0,0,0,0.6)' },
  chip: {
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999,
    backgroundColor: colors.primary,
  },
  chipText: { color: '#fff', fontWeight: '700', fontSize: 12, letterSpacing: 0.3 },

  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.06)',
    marginVertical: 6,
  },
  sectionLabel: {
    color: 'rgba(0,0,0,0.55)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 4,
  },

  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemIcon: { color: '#0f5132' },
  itemText: { fontSize: 15, color: colors.textDark, fontWeight: '600' },
  itemChevron: { color: 'rgba(0,0,0,0.35)' },

  badge: {
    backgroundColor: '#E9FFF2',
    borderColor: 'rgba(15,81,50,0.15)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: { color: '#0f5132', fontWeight: '800', fontSize: 10, letterSpacing: 0.5 },
});
