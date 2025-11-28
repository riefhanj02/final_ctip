// src/styles/register.js
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

const register = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surface },  // wraps Header + content
  scroll: { flex: 1 },                                 // the ScrollView itself
  pageInner: { paddingHorizontal: 20, paddingBottom: 24 }, // content padding only

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
    borderWidth: 1, borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 14,
    fontSize: 15, color: colors.text,
    marginBottom: 12,
    ...(softShadow || {}),
  },

  button: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4, ...(softShadow || {}) },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '800', letterSpacing: 0.3 },

  switchRow: { marginTop: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  switchText: { color: colors.muted },
  switchLink: { color: colors.primary, fontWeight: '700' },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    ...(shadow || {}),
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    ...(softShadow || {}),
  },
  modalButtonPrimary: {
    backgroundColor: colors.primary,
  },
  modalButtonSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalButtonTextPrimary: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  modalButtonTextSecondary: {
    color: colors.text,
    fontWeight: '700',
  },
});

export default register;
