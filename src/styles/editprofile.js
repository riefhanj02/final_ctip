import { StyleSheet } from "react-native";
import { colors } from "../theme/colors";

// Fallbacks in case some theme colors are missing
const PRIMARY = colors?.primary || "#2c7a7b";      // teal
const PRIMARY_DARK = colors?.primaryDark || "#215b5d";
const ACCENT = colors?.accent || "#3182ce";        // blue
const BG = colors?.background || "#96AA8B";
const CARD_BG = colors?.card || "#96AA8B";
const BORDER = colors?.border || "#E2E8F0";
const TEXT = colors?.text || "#1F2933";
const MUTED = colors?.muted || "#6B7280";

const editprofile = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 24,
    backgroundColor: BG,
  },

  header: {
    fontSize: 24,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 20,
    alignSelf: "flex-start",
  },

  // Profile picture area
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImageWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: PRIMARY,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: PRIMARY,
    borderRadius: 18,
    padding: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  profileHint: {
    fontSize: 12,
    color: MUTED,
  },

  // Reusable card for sections
  sectionCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: TEXT,
    marginBottom: 10,
  },

  field: {
    marginTop: 8,
    marginBottom: 6,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: MUTED,
    marginBottom: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: "#F9FAFB",
  },

  // Email privacy
  privacyRow: {
    marginTop: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
  },
  privacyLabel: {
    fontSize: 14,
    color: TEXT,
    flex: 1,
    marginRight: 12,
  },

  // Buttons
  saveButton: {
    marginTop: 18,
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  changePassButton: {
    marginTop: 14,
    backgroundColor: ACCENT,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 24,
  },

  subHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: TEXT,
    marginBottom: 6,
  },
});

export default editprofile;
