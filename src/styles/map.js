import { StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';

const shadow = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 8 } },
  android: { elevation: 6 },
});
const softShadow = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  android: { elevation: 3 },
});

export default StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surface },
  scroll: { flex: 1 },
  inner: { paddingHorizontal: 20, paddingBottom: 24 },

  // Hero
  hero: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 14,
    ...(shadow || {}),
  },
  heroBadge: {
    position: 'absolute',
    right: 14,
    top: 14,
    height: 40,
    width: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  heroTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 6 },
  heroSubtitle: { fontSize: 14, lineHeight: 20, color: colors.muted },

  // Search
  searchRow: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 14,
    ...(softShadow || {}),
  },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, paddingVertical: 8, paddingHorizontal: 6, fontSize: 15, color: colors.text },
  searchBtn: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, marginLeft: 6 },
  searchBtnText: { color: '#fff', fontWeight: '800', letterSpacing: 0.3 },

  // Chips
  chipsRow: { gap: 10, paddingVertical: 12 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  chipActive: { backgroundColor: '#E7FFF4', borderColor: '#B6F3DA' },
  chipText: { color: colors.muted, fontWeight: '600' },
  chipTextActive: { color: colors.primary },

  // Map placeholder
  mapPlaceholder: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 4,
    ...(shadow || {}),
  },
  mapPlaceholderHeader: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mapTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 8 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 6 },
  legendText: { fontSize: 12, color: colors.muted },

  placeholderBody: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  placeholderTitle: { marginTop: 12, fontSize: 16, fontWeight: '800', color: colors.text, textAlign: 'center' },
  placeholderSub: { marginTop: 6, fontSize: 13, lineHeight: 18, color: colors.muted, textAlign: 'center' },

  // List
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 },
  listTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  listLink: { color: colors.primary, fontWeight: '700' },

  cardList: { paddingTop: 10, gap: 10 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...(softShadow || {}),
  },
  cardIconWrap: {
    height: 36,
    width: 36,
    borderRadius: 10,
    backgroundColor: '#E7FFF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { 
    fontWeight: '800', 
    color: colors.text 
  },

  cardSub: { 
    marginTop: 2, 
    fontSize: 12.5, 
    color: colors.muted 
  },

  distancePill: {
    marginLeft: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  distanceText: { 
    fontSize: 12, 
    color: colors.text, 
    fontWeight: '700' 
  },

  mapWrap: { height: 300, borderRadius: 14, overflow: 'hidden', marginVertical: 8, backgroundColor: '#e5efe9' },
map: { width: '100%', height: '100%' },

locFab: {
  position: 'absolute', right: 10, bottom: 10,
  backgroundColor: '#fff', borderRadius: 18, padding: 10,
  shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 4, elevation: 2,
},
legendFloating: {
  position: 'absolute', left: 10, top: 10,
  backgroundColor: 'rgba(255,255,255,0.9)',
  borderRadius: 12, paddingVertical: 6, paddingHorizontal: 10,
},
legendRow: { flexDirection: 'row', alignItems: 'center' },
legendDot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 6 },
legendText: { color: '#0F172A', marginRight: 8, fontSize: 12 },
});
