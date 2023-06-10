import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconOrButton: {
    marginBottom: 10,
    textAlign: "center",
  },
  cardCover: {
    margin: 10,
  },
  cardContainer: {
    marginBottom: 20,
  },
  cardActions: {
    alignSelf: "center",
    marginBottom: 10,
  },
  dialogContainer: {
    alignItems: "center",
  },
  dialogActions: {
    flexDirection: "column",
  },
  searchBar: {
    margin: 10,
  },
  rowView: {
    alignSelf: "center",
    alignContent: "space-between",
  },
  resultsContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  queryContainer: {
    flex: 1,
    alignContent: "center",
  },
});
