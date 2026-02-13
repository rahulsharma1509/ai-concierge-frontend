import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  Platform,
} from "react-native";

const BASE_URL = "https://ai-concierge-backend-p6jv.onrender.com";

type BookingResponse = {
  message: string;
  phone?: string;
  website?: string;
};

export default function HomeScreen() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data: BookingResponse = await res.json();
      setResult(data);
    } catch (error) {
      setResult({
        message: "⚠️ Error connecting to server",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhonePress = (phone: string) => {
    if (Platform.OS === "web") {
      window.open(`tel:${phone}`);
    } else {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleWebsitePress = (website: string) => {
    Linking.openURL(website);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rahul's AI Concierge</Text>

      <TextInput
        style={styles.input}
        placeholder="Book table at Pizza 4P Sunday 8pm for 2"
        placeholderTextColor="#888"
        value={message}
        onChangeText={setMessage}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={sendMessage}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Processing..." : "SEND"}
        </Text>
      </TouchableOpacity>

      <ScrollView style={styles.responseBox}>
        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultText}>{result.message}</Text>

            {result.phone && (
              <Text
                style={styles.link}
                onPress={() => handlePhonePress(result.phone!)}
              >
                📞 {result.phone}
              </Text>
            )}

            {result.website && (
              <Text
                style={styles.link}
                onPress={() => handleWebsitePress(result.website!)}
              >
                🌐 Visit Website
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    color: "#fff",
  },
  button: {
    backgroundColor: "#2979FF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  responseBox: {
    marginTop: 20,
  },
  resultCard: {
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 10,
  },
  resultText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  link: {
    color: "#4da6ff",
    marginTop: 5,
  },
});
