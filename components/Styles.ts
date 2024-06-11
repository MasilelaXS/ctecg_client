import { StyleSheet, Dimensions } from "react-native";

const viewWidth = Dimensions.get("screen").width;
const viewHeight = Dimensions.get("screen").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "100%",
  },
  gauge1: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  gauge2: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  gauge3: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  gaugeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  cardFullContainer: {
    width: "100%",
    overflow: "hidden",
    marginTop: 15,
    borderRadius: 10,
  },
  cardContainer: {
    width: "48%",
    overflow: "hidden",
    marginTop: 15,
    borderRadius: 10,
  },
  cardHeadContainer: { flexDirection: "row", justifyContent: "space-between" },
  cardTitle: { fontWeight: "bold" },
  cardIcon: { flexDirection: "row" },
  cardText: {
    fontSize: 24,
    fontWeight: "200",
    paddingVertical: 5,
  },
  InputTitle: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
  },
  Input: {
    width: "100%",
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 15,
  },
  btn: {
    width: "100%",
    backgroundColor: "#cc0000",
    padding: 16,
    marginVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },

  btnBorder: {
    width: "100%",
    backgroundColor: "rgba(204,0,0,.2)",
    padding: 16,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#cc0000",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 10,
  },
  floatingMenu: {
    width: viewWidth * 0.8,
    position: "absolute",
    zIndex: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    top: viewHeight / 4,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // for Android
  },
  menuItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
});

export default styles;
