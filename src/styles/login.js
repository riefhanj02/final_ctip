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

const login = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surface },  // wraps Header + content
  scroll: { flex: 1 },
  pageInner: { paddingHorizontal: 20, paddingBottom: 24 },

  hero: { marginTop: 14, marginBottom: 12, paddingHorizontal: 6 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center' },
  heroSubtitle: { marginTop: 8, fontSize: 13.5, lineHeight: 19, color: colors.muted, textAlign: 'center' },

  formCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...(shadow || {}),
    marginTop: 14,
  },
  formTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 12, textAlign: 'center' },

  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.text,
    marginBottom: 12,
    ...(softShadow || {}),
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    ...(softShadow || {}),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: { color: '#fff', fontWeight: '800', letterSpacing: 0.3 },

  switchRow: { marginTop: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  switchText: { color: colors.muted },
  switchLink: { color: colors.primary, fontWeight: '700' },
});

export default login;
