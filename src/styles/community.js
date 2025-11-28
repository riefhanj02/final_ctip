import { StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';


const shadow = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
  android: { elevation: 5 },
});
const softShadow = Platform.select({
  ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  android: { elevation: 3 },
});

export default StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surface },

  controls: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8 },

  // search
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 8,
    paddingVertical: 8,
    ...(softShadow || {}),
  },
  searchInput: { flex: 1, paddingHorizontal: 6, fontSize: 14.5, color: colors.text },

  // filter chips
  filterRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActive: { backgroundColor: '#E9FFF2', borderColor: '#86EFAC' },
  chipText: { fontSize: 12.5, color: colors.muted, fontWeight: '700' },
  chipTextActive: { color: '#0f5132' },

  // donation
  donateCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
    ...(softShadow || {}),
  },
  donateHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  donateIcon: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#EF4444',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 8,
  },
  donateTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  donateSubtitle: { color: 'rgba(0,0,0,0.65)', marginTop: 2, lineHeight: 20 },

  amountRow: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  amountChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#F8FAFC',
  },
  amountChipActive: { backgroundColor: '#E9FFF2', borderColor: '#86EFAC' },
  amountText: { fontSize: 12.5, color: 'rgba(0,0,0,0.65)', fontWeight: '800' },
  amountTextActive: { color: '#065F46' },

  customRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  customInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  donateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  donateBtnText: { color: '#fff', fontWeight: '800' },

  progressWrap: { marginTop: 12 },
  progressBar: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary },
  progressText: { fontSize: 12, color: 'rgba(0,0,0,0.6)', marginTop: 6, fontWeight: '700' },

  // feed
  list: { paddingHorizontal: 16, paddingBottom: 90, paddingTop: 8 },

  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 14,
    ...(shadow || {}),
  },

  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#E9FFF2',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1, borderColor: 'rgba(16,185,129,0.25)',
  },
  userName: { fontWeight: '800', color: colors.text },
  meta: { color: 'rgba(0,0,0,0.55)', fontSize: 12, marginTop: 2 },

  rarityPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    marginLeft: 10,
  },
  rare: { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' },
  common: { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' },
  rarityText: { fontSize: 11, fontWeight: '800' },
  rareText: { color: '#B91C1C' },
  commonText: { color: '#065F46' },

  species: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 4 },
  caption: { color: colors.muted, marginBottom: 10 },

  photoWrap: { borderRadius: 12, overflow: 'hidden', backgroundColor: '#F1F5F9' },
  photo: { width: '100%', height: 190 },
  photoPlaceholder: { alignItems: 'center', justifyContent: 'center' },

  tagRow: { flexDirection: 'row', gap: 8, marginTop: 10, flexWrap: 'wrap' },
  tag: {
    backgroundColor: '#F8FAFC',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: { fontSize: 11.5, color: 'rgba(0,0,0,0.7)', fontWeight: '700' },

  actions: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingRight: 10 },
  actionText: { fontWeight: '700', color: colors.text },

  // FAB
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 78,
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    ...(softShadow || {}),
  },
});
