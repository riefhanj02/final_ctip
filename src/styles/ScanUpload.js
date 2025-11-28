import { StyleSheet } from "react-native";
import { colors } from '../theme/colors';


// ---- Styles ---------------------------------------------------------------
const ScanUpload = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1f2937",
  },
  previewBox: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 220,
    backgroundColor: "#fafafa",
    marginBottom: 16,
  },
  previewImage: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    resizeMode: "cover",
  },
  previewLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  placeholder: {
    color: "#9ca3af",
  },
  placeholderSmall: {
    color: "#9ca3af",
    fontSize: 13,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#2c7a7b",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
  },
  uploadBtn: {
    backgroundColor: "#0f981aff",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  uploadText: {
    color: "#fff",
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: colors.surface,
    marginVertical: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#111827",
  },
  lastBox: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
  },
  lastImage: {
    width: 74,
    height: 74,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  lastName: {
    fontWeight: "600",
    color: "#111827",
  },
  lastTime: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  page: {
    flex: 1,
    backgroundColor: colors.surface, 
  },
});

export default ScanUpload;