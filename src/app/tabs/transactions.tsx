import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import {
  Card,
  IconButton,
  Searchbar,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useExpenses } from "../../context/ExpenseContext";
import { Icon } from "react-native-paper";
export default function Transactions() {
  const {
    transactions,
    deleteTransaction,
  } = useExpenses();

  const [search, setSearch] = useState("");

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      transaction.category
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>

        <Text style={styles.count}>
          {transactions.length} total
        </Text>
      </View>

      <Searchbar
        placeholder="Search transactions"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              No transactions found
            </Text>

            <Text style={styles.emptyText}>
              Your transactions will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content style={styles.row}>
              <View style={styles.icon}>
                <Text style={styles.iconText}>
                  {getIcon(item.category)}
                </Text>
              </View>

              <View style={styles.info}>
                <Text style={styles.name}>
                  {item.title}
                </Text>

                <Text style={styles.category}>
                  {item.category}
                </Text>

                <Text style={styles.date}>
                  {formatDate(item.date)}
                </Text>
              </View>

              <View style={styles.right}>
                <Text
                  style={[
                    styles.amount,
                    item.type === "income"
                      ? styles.income
                      : styles.expense,
                  ]}
                >
                  {item.type === "income" ? "+" : "-"}$
                  {item.amount.toFixed(2)}
                </Text>

                <IconButton
                  icon="delete-outline"
                  size={18}
                  onPress={() =>
                    deleteTransaction(item.id)
                  }
                />
              </View>
            </Card.Content>
          </Card>
        )}
      />
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

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },

  count: {
    color: "#6B7280",
    marginTop: 4,
  },

  search: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 12,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  card: {
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
    borderRadius: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  iconText: {
    fontSize: 20,
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  category: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 3,
  },

  date: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 3,
  },

  right: {
    alignItems: "flex-end",
  },

  amount: {
    fontSize: 15,
    fontWeight: "700",
  },

  income: {
    color: "#16A34A",
  },

  expense: {
    color: "#DC2626",
  },

  empty: {
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  emptyText: {
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
  },
});