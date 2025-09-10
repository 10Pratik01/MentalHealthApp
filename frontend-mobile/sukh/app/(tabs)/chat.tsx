import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import axios from "axios";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface Question {
  id: number;
  text: string;
}

const QUESTIONS: Question[] = [
  { id: 1, text: "Little interest or pleasure in doing things?" },
  { id: 2, text: "Feeling down, depressed, or hopeless?" },
  { id: 3, text: "Trouble falling or staying asleep, or sleeping too much?" },
  { id: 4, text: "Feeling tired or having little energy?" },
  { id: 5, text: "Poor appetite or overeating?" },
  { id: 6, text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down?" },
  { id: 7, text: "Trouble concentrating on things, such as reading the newspaper or watching television?" },
  { id: 8, text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless?" },
  { id: 9, text: "Thoughts that you would be better off dead, or thoughts of hurting yourself in some way?" },
];

const API_URL = "http://10.0.54.238:8000/api/phq9-results";

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [userResponses, setUserResponses] = useState<Record<number, string>>({});
  const [backendResult, setBackendResult] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (messages.length === 0) {
      addBotMessage(QUESTIONS[0].text);
    }
  }, []);

  const addBotMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text, isBot: true, timestamp: new Date() },
    ]);
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text, isBot: false, timestamp: new Date() },
    ]);
  };

  const simulateTyping = (callback: () => void) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, 1200);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    addUserMessage(inputText);

    // Save response for current question
    setUserResponses((prev) => ({
      ...prev,
      [QUESTIONS[currentQuestionIndex].id]: inputText.trim(),
    }));

    setInputText("");
    goToNextQuestion();
  };

  const goToNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < QUESTIONS.length) {
      setCurrentQuestionIndex(nextIndex);
      simulateTyping(() => addBotMessage(QUESTIONS[nextIndex].text));
    } else {
      setAssessmentComplete(true);
      simulateTyping(() => sendAssessmentResults());
    }
  };

  const sendAssessmentResults = async () => {
    try {
      const payload = {
        userId: "unique-user-id",  // replace with actual if available
        responses: userResponses,
      };

      const response = await axios.post(API_URL, payload);

      if (response.status === 200 && response.data) {
        // Assuming backend returns an object with result message or analysis
        const { predictedLevel, topPredictions } = response.data;

        let resultText = `Predicted depression level: ${predictedLevel}\nTop Predictions:\n`;
        topPredictions.forEach(
          (pred: { label: string; prob: number }) =>
            (resultText += `${pred.label} — prob=${pred.prob.toFixed(4)}\n`)
        );

        addBotMessage(resultText);
        setBackendResult(resultText);
      } else {
        addBotMessage("Sorry, something went wrong processing your results.");
      }
    } catch (error) {
      console.error("Error sending PHQ9 results:", error);
      addBotMessage("Error connecting to the server. Please try again later.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      <View style={{ flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: "#444" }}>
        <Image source={{ uri: "https://example.com/user-avatar.jpg" }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }} />
        <View>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Mental Health Bot</Text>
          <Text style={{ color: "#aaa", fontSize: 12 }}>Online</Text>
        </View>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, padding: 16 }}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((m) => (
          <View key={m.id} style={{
            flexDirection: "row", 
            marginBottom: 16, 
            justifyContent: m.isBot ? "flex-start" : "flex-end"
          }}>
            {m.isBot && <Text style={{ fontSize: 24, marginRight: 8 }}>🤖</Text>}
            <View style={{
              maxWidth: "75%",
              padding: 12,
              borderRadius: 16,
              backgroundColor: m.isBot ? "#E5E5E5" : "#4CAF50",
              borderBottomLeftRadius: m.isBot ? 0 : 16,
              borderBottomRightRadius: m.isBot ? 16 : 0,
            }}>
              <Text style={{ color: m.isBot ? "#111" : "#fff" }}>{m.text}</Text>
            </View>
            {!m.isBot && <Text style={{ fontSize: 24, marginLeft: 8 }}>🙂</Text>}
          </View>
        ))}

        {isTyping && (
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <Text style={{ fontSize: 24, marginRight: 8 }}>🤖</Text>
            <View style={{ backgroundColor: "#E5E5E5", padding: 12, borderRadius: 16 }}>
              <Text style={{ color: "#666" }}>Typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {!assessmentComplete && (
        <View style={{ flexDirection: "row", alignItems: "center", padding: 12, borderTopWidth: 1, borderTopColor: "#444" }}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message"
            placeholderTextColor="#999"
            style={{
              flex: 1,
              backgroundColor: "#333",
              borderRadius: 20,
              paddingHorizontal: 16,
              color: "#fff",
              fontSize: 16,
              maxHeight: 100,
            }}
            multiline
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!inputText.trim()}
            style={{
              marginLeft: 12,
              backgroundColor: inputText.trim() ? "#4CAF50" : "#666",
              borderRadius: 20,
              padding: 12,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>✈</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ChatbotPage;
