import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Card,
  IconButton,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useExpenses } from "../../context/ExpenseContext";
import { useAuth } from "../../context/AuthContext";
import { Icon } from "react-native-paper";
export default function Dashboard() {
  const {
    transactions,
    balance,
    totalIncome,
    totalExpenses,
  } = useExpenses();
  const { user } = useAuth();
  const recentTransactions = transactions.slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.smallText}>Good evening</Text>
            <Text style={styles.title}>
           {user?.name || "User"}
              </Text>
          </View>

          <IconButton
            icon="bell-outline"
            mode="contained-tonal"
            onPress={() => {}}
          />
        </View>

        <Card style={styles.balanceCard}>
          <Card.Content>
            <Text style={styles.balanceLabel}>
              Total Balance
            </Text>

            <Text style={styles.balance}>
              ${balance.toFixed(2)}
            </Text>

            <View style={styles.balanceRow}>
              <View>
                <Text style={styles.cardLabel}>Income</Text>
                <Text style={styles.income}>
                  +${totalIncome.toFixed(2)}
                </Text>
              </View>

              <View>
                <Text style={styles.cardLabel}>Expenses</Text>
                <Text style={styles.expense}>
                  -${totalExpenses.toFixed(2)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Recent Transactions
          </Text>

          <Text
            style={styles.seeAll}
            onPress={() => router.push("/tabs/transactions")}
          >
            See all
          </Text>
        </View>

        {recentTransactions.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyTitle}>
                No transactions yet
              </Text>

              <Text style={styles.emptyText}>
                Add your first expense to start tracking your
                spending.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          recentTransactions.map((transaction) => (
            <Card
              key={transaction.id}
              style={styles.transactionCard}
            >
              <Card.Content style={styles.transactionContent}>
                <View style={styles.transactionIcon}>
                  <Text style={styles.iconText}>
                    {getIcon(transaction.category)}
                  </Text>
                </View>

                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>
                    {transaction.title}
                  </Text>

                  <Text style={styles.transactionCategory}>
                    {transaction.category}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.type === "income"
                      ? styles.income
                      : styles.expense,
                  ]}
                >
                  {transaction.type === "income" ? "+" : "-"}$
                  {transaction.amount.toFixed(2)}
                </Text>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getIcon(category: string) {
  const icons: Record<string, string> = {
    Food: "food",
    Transport: "car",
    Shopping: "shopping",
    Bills: "receipt",
    Entertainment: "gamepad-variant",
    Health: "medical-bag",
    Education: "school",
    Other: "dots-horizontal",
  };

  return icons[category] || "dots-horizontal";
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  smallText: {
    fontSize: 14,
    color: "#6B7280",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginTop: 2,
  },

  balanceCard: {
    backgroundColor: "#4F46E5",
    borderRadius: 20,
    marginBottom: 28,
  },

  balanceLabel: {
    color: "#E0E7FF",
    fontSize: 14,
  },

  balance: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 28,
  },

  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardLabel: {
    color: "#C7D2FE",
    fontSize: 13,
    marginBottom: 4,
  },

  income: {
    color: "#16A34A",
    fontWeight: "700",
  },

  expense: {
    color: "#DC2626",
    fontWeight: "700",
  },

  balanceCardContent: {
    padding: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  seeAll: {
    color: "#4F46E5",
    fontWeight: "600",
  },

  transactionCard: {
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },

  transactionContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  transactionIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  iconText: {
    fontSize: 21,
  },

  transactionInfo: {
    flex: 1,
  },

  transactionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  transactionCategory: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 3,
  },

  transactionAmount: {
    fontSize: 15,
  },

  emptyCard: {
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  emptyText: {
    color: "#6B7280",
    marginTop: 6,
    lineHeight: 20,
  },
});