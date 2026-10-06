import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useExpenses } from "../../context/ExpenseContext";

export default function Statistics() {
  const {
    transactions,
    totalExpenses,
  } = useExpenses();

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};

    transactions
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
        totals[transaction.category] =
          (totals[transaction.category] || 0) +
          transaction.amount;
      });

    return Object.entries(totals).sort(
      (a, b) => b[1] - a[1]
    );
  }, [transactions]);

  const biggestCategory =
    categoryTotals.length > 0
      ? categoryTotals[0]
      : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Statistics</Text>

        <Text style={styles.subtitle}>
          Understand where your money goes.
        </Text>

        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryLabel}>
              Total spending
            </Text>

            <Text style={styles.summaryAmount}>
              ${totalExpenses.toFixed(2)}
            </Text>

            {biggestCategory && (
              <Text style={styles.insight}>
                You spend the most on{" "}
                <Text style={styles.bold}>
                  {biggestCategory[0]}
                </Text>
                .
              </Text>
            )}
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>
          Spending by Category
        </Text>

        {categoryTotals.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>
                Add some expenses to see your statistics.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          categoryTotals.map(([category, amount]) => {
            const percentage =
              totalExpenses > 0
                ? amount / totalExpenses
                : 0;

            return (
              <Card
                key={category}
                style={styles.categoryCard}
              >
                <Card.Content>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryName}>
                      {category}
                    </Text>

                    <Text style={styles.categoryAmount}>
                      ${amount.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.progressBackground}>
                    <View
                      style={[
                        styles.progress,
                        {
                          width: `${percentage * 100}%`,
                        },
                      ]}
                    />
                  </View>

                  <Text style={styles.percentage}>
                    {(percentage * 100).toFixed(1)}%
                  </Text>
                </Card.Content>
              </Card>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  content: {
    padding: 20,
    paddingBottom: 100,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    color: "#6B7280",
    marginTop: 5,
    marginBottom: 25,
  },

  summaryCard: {
    backgroundColor: "#4F46E5",
    borderRadius: 20,
    marginBottom: 30,
  },

  summaryLabel: {
    color: "#C7D2FE",
  },

  summaryAmount: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    marginTop: 8,
  },

  insight: {
    color: "#E0E7FF",
    marginTop: 15,
  },

  bold: {
    fontWeight: "800",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },

  categoryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 10,
  },

  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  categoryName: {
    fontWeight: "700",
    color: "#111827",
  },

  categoryAmount: {
    fontWeight: "700",
    color: "#374151",
  },

  progressBackground: {
    height: 8,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    marginTop: 12,
  },

  progress: {
    height: 8,
    borderRadius: 10,
    backgroundColor: "#4F46E5",
  },

  percentage: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 7,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
  },

  emptyText: {
    color: "#6B7280",
  },
});