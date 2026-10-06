import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  SegmentedButtons,
  Text,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useExpenses } from "../../context/ExpenseContext";
import {
  Category,
  TransactionType,
} from "../../types/transaction";

const categories: Category[] = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

export default function AddExpense() {
  const { addTransaction } = useExpenses();

  const [type, setType] =
    useState<TransactionType>("expense");

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] =
    useState<Category>("Food");
  const [note, setNote] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = () => {
    const numericAmount = Number(amount);

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!amount || numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    addTransaction({
      id: Date.now().toString(),
      title: title.trim(),
      amount: numericAmount,
      type,
      category,
      date: new Date().toISOString(),
      note: note.trim(),
    });

    setTitle("");
    setAmount("");
    setNote("");
    setError("");

    router.replace("/tabs/dashboard");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Add Transaction</Text>

        <Text style={styles.subtitle}>
          Record your income or expense.
        </Text>

        <Text style={styles.label}>Transaction type</Text>

        <SegmentedButtons
          value={type}
          onValueChange={(value) =>
            setType(value as TransactionType)
          }
          buttons={[
            {
              value: "expense",
              label: "Expense",
              icon: "arrow-down",
            },
            {
              value: "income",
              label: "Income",
              icon: "arrow-up",
            },
          ]}
        />

        <Text style={styles.label}>Title</Text>

        <TextInput
          mode="outlined"
          placeholder="e.g. Grocery shopping"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <Text style={styles.label}>Amount</Text>

        <TextInput
          mode="outlined"
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          left={<TextInput.Affix text="$ " />}
          style={styles.input}
        />

        <Text style={styles.label}>Category</Text>

        <View style={styles.categories}>
          {categories.map((item) => (
            <Button
              key={item}
              mode={
                category === item
                  ? "contained"
                  : "outlined"
              }
              onPress={() => setCategory(item)}
              style={styles.categoryButton}
              compact
            >
              {item}
            </Button>
          ))}
        </View>

        <Text style={styles.label}>Note</Text>

        <TextInput
          mode="outlined"
          placeholder="Optional note"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={4}
          style={styles.note}
        />

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submit}
          contentStyle={styles.submitContent}
        >
          Save Transaction
        </Button>
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

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginTop: 20,
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#FFFFFF",
  },

  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  categoryButton: {
    marginBottom: 4,
  },

  note: {
    backgroundColor: "#FFFFFF",
    minHeight: 100,
  },

  error: {
    color: "#DC2626",
    marginTop: 12,
  },

  submit: {
    marginTop: 25,
    borderRadius: 10,
  },

  submitContent: {
    height: 52,
  },
});