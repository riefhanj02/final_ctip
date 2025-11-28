import { StyleSheet, Dimensions } from "react-native";
import { colors } from '../theme/colors';

const { width } = Dimensions.get("window");


const IMAGE_SIZE = width * 0.48; 

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // ----- TITLE -----
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 10,
    marginTop: 4,
  },
  plantText: {
    fontFamily: "Gabarito-Medium",
    fontSize: 22,
    color: "#2F4F4F",
  },
  encyclopediaText: {
    fontFamily: "Gabarito-Medium",
    fontSize: 22,
    color: "#2F4F4F",
    marginTop: -2,
  },

  // ----- CATEGORY TABS -----
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 12,
  },
  tabButton: {
    marginRight: 18,
    paddingVertical: 6,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#2F4F4F",
  },
  tabText: {
    fontFamily: "Fustat-Regular",
    fontSize: 14,
    color: "#FFFFFF",
  },
  tabTextActive: {
    color: "#2F4F4F",
    fontFamily: "Fustat-Medium",
  },

  // ----- SEARCH BAR -----
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f1ec",
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontFamily: "Fustat-Regular",
    fontSize: 14,
    color: "#111827",
  },

  // ----- SECTION TITLE -----
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#2F4F4F",
  },

  // ----- SCROLL CONTAINERS -----
  horizontalScroll: {
    paddingHorizontal: 16,
    marginTop: 12,
    paddingBottom: 10,
  },

  // ----- DISCOVER (Square Cards) -----
  squareCard: {
    width: width * 0.6,
    minHeight: width * 0.8, // slightly taller for big image
    backgroundColor: "#e8f1ec",
    borderRadius: 18,
    marginRight: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "column",
    justifyContent: "space-between", // pushes text to bottom
    alignItems: "center",
  },

  squareImageWrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8, // reduced gap between image and text
    flex: 1,
  },

  squarePlantImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    resizeMode: "contain",
    alignSelf: "center",
  },

  squareTextWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 6,
  },

  squarePlantName: {
    fontFamily: "Gabarito-Medium",
    fontSize: 18,
    color: "#2F4F4F",
    textAlign: "center",
  },

  squarePlantSubtitle: {
    fontFamily: "Fustat-Regular",
    fontSize: 13,
    color: "#4B5563",
    marginTop: 2,
    lineHeight: 16,
    textAlign: "center",
  },

  // ----- FEATURED (Rectangular Cards) -----
  featuredCard: {
    width: width * 0.95,
    height: width * 0.42, // slightly taller for bigger image
    backgroundColor: "#e8f1ec",
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 14,
    marginRight: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },

  halfCircleAccent: {
    position: "absolute",
    left: -width * 0.25,
    width: width * 0.6,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: "#c7e0cc",
  },

  featuredImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    resizeMode: "contain",
    alignSelf: "center",
  },

  featuredTextWrapper: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "flex-end", // moves text lower
  },

  featuredPlantName: {
    fontFamily: "Gabarito-Medium",
    fontSize: 20,
    color: "#2F4F4F",
  },

  featuredPlantSubtitle: {
    fontFamily: "Fustat-Regular",
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
});

export default styles;
