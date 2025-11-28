import { StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';

const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 6 },
});

const softShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  android: { elevation: 3 },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // background gradient holder
  heroBg: {
    position: 'absolute',
    top: 0,
    left: -20,
    right: -20,
    height: 260,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  content: { flex: 1 },
  contentInner: { padding: 20, paddingTop: 80, paddingBottom: 100 },

  // hero card
  heroCard: {
    backgroundColor: '#ffffffEE',
    borderRadius: 18,
    padding: 18,
    marginTop: 6,
    marginBottom: 16,
    ...(shadow || {}),
  },
  heroTextWrap: { paddingRight: 44 },
  heroBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    height: 40,
    width: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },

  // typography
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(0,0,0,0.65)',
  },

  // search
  searchBox: {
    backgroundColor: '#fff',
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    ...(softShadow || {}),
  },
  searchIcon: {
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.textDark,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 15,
  },
  searchBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginLeft: 6,
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // quick actions
  quickRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#F3FFF8',
    borderWidth: 1,
    borderColor: 'rgba(15,81,50,0.12)',
    borderRadius: 16,
    padding: 14,
    ...(softShadow || {}),
  },
  quickTitle: {
    marginTop: 8,
    fontWeight: '700',
    color: '#0f5132',
  },
  quickDesc: {
    marginTop: 2,
    fontSize: 12,
    color: 'rgba(15,81,50,0.7)',
  },

  // stats
  statsWrap: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  statPill: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    ...(softShadow || {}),
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textDark,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.55)',
    marginTop: 2,
  },

  // feature banner
  banner: {
    marginTop: 18,
    backgroundColor: '#E9FFF2',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(15,81,50,0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    ...(softShadow || {}),
  },
  bannerTitle: {
    fontWeight: '800',
    color: '#0f5132',
    fontSize: 16,
    marginBottom: 2,
  },
  bannerSubtitle: {
    color: 'rgba(15,81,50,0.75)',
    fontSize: 13,
    lineHeight: 18,
  },
  sectionHeader: {
    marginTop: 18,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f5132',
  },

  cardsHorizontal: {
    paddingVertical: 6,
    // add left/right padding if you want breathing room
  },

  card: {
    width: 220,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
    ...(softShadow || {}),
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardBody: {
    padding: 12,
  },
  cardTitle: {
    fontWeight: '800',
    fontSize: 14,
    color: '#0F172A',
  },
  cardSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
    fontStyle: 'italic',
  },
  cardIntro: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(0,0,0,0.75)',
  },
  aboutSection: {
  marginTop: 18,
  },
  aboutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  aboutLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f5132',
  },
  aboutList: {
    paddingVertical: 6,
  },
  aboutCard: {
    width: 220,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    ...(softShadow || {}),
  },
  aboutAvatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#E9FFF2',
    marginRight: 10,
  },
  aboutBody: {
    flex: 1,
    minWidth: 0, // allow ellipsis
  },
  aboutName: {
    fontWeight: '800',
    fontSize: 14,
    color: '#0F172A',
  },
  aboutMeta: {
    marginTop: 2,
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
  },
  aboutRole: {
    marginTop: 2,
    fontSize: 12,
    color: '#0f5132',
    fontWeight: '700',
  },
});

export default styles;
