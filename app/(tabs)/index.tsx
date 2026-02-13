import Constants from "expo-constants";
import { useState } from "react";
import { View, TextInput, Button, Text, ScrollView, StyleSheet } from "react-native";

const getBaseUrl = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest?.debuggerHost;

  if (!hostUri) {
    return "http://localhost:3000";
  }

  const host = hostUri.split(":")[0];
  return `http://${host}:3000`;
};

const BASE_URL = "https://ai-concierge-backend-p6jv.onrender.com";



export default function HomeScreen() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async () => {
    try {
      const res = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setResponse(data.reply);
    } catch (error) {
      setResponse("Error connecting to server");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rahul's AI Concierge</Text>

      <TextInput
        style={styles.input}
        placeholder="Type: Book table for 2 at Pizza 4P..."
        value={message}
        onChangeText={setMessage}
      />

      <Button title="Send" onPress={sendMessage} />

      <ScrollView style={styles.responseBox}>
        <Text>{response}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  responseBox: {
    marginTop: 20,
  },
});
