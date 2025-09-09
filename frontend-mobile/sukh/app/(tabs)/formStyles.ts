import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#0B0B23", // dark navy background
    padding: 20,
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    marginTop: 20,
    marginBottom: 4,
    textAlign: "center",
  },
  subheading: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#C084FC", // purple accent
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  sliderBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#3EB489", // teal slider
    marginHorizontal: 10,
    borderRadius: 2,
  },
  input: {
    width: "100%",
    backgroundColor: "black",
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "white",
    marginBottom: 12,
  },
  memo: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#3EB489", // teal
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default styles;
