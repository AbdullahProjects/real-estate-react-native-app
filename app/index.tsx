import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>

      <TextInput
        placeholder="Enter text here..."
        placeholderTextColor="#888"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          margin: 10,
          borderRadius: 5,
          width: "90%",
        }}
      />

      <TouchableOpacity>
        <Text>Search</Text>
      </TouchableOpacity>
    </View>
  );
}
