import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";
import api from '../../services/api'; // your axios instance
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function PreviousReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Example: last 7 days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        const endDate = new Date();

        const res = await api.get("/daily/daily-reports", {
          params: {
            start: startDate.toISOString().split("T")[0],
            end: endDate.toISOString().split("T")[0],
          },
        });
        setReports(res.data);

        // Fetch weekly average trends
        const weeklyRes = await api.get("/daily/analytics/weekly");
        // Assume API returns { week: ["Mon","Tue",...], averages: [3,4,2,5,...] }
        setWeeklyData(weeklyRes.data.averages || []);
      } catch (err) {
        if (err && typeof err === "object" && "response" in err) {
          // @ts-ignore
          console.log("Error fetching reports:", err.response?.data || err.message);
        } else {
          console.log("Error fetching reports:", (err as Error).message || err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Previous Reports</Text>

      {/* Reports List */}
      <FlatList
        data={reports}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.reportCard}>
            <Text style={styles.date}>{new Date(item.date).toDateString()}</Text>
            <Text>Mood: {item.mood}</Text>
            <Text>Notes: {item.notes || "No notes"}</Text>
          </View>
        )}
      />

      {/* Weekly Average Graph */}
      <Text style={styles.header}>Weekly Mood Average</Text>
      <LineChart
        data={{
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [{ data: weeklyData.length ? weeklyData : [0, 0, 0, 0, 0, 0, 0] }],
        }}
        width={screenWidth - 32}
        height={220}
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: "#e6fff5",
          backgroundGradientFrom: "#d1fae5",
          backgroundGradientTo: "#6ee7b7",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(5, 150, 105, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
        }}
        style={{ marginVertical: 16, borderRadius: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#e6fff5",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#059669",
    marginVertical: 8,
  },
  reportCard: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  date: {
    fontWeight: "bold",
    color: "#059669",
    marginBottom: 4,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
