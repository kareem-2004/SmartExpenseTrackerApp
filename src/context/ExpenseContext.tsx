import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Transaction } from "../types/transaction";

const STORAGE_KEY = "@smart_expense_transactions";

interface ExpenseContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  balance: number;
  totalIncome: number;
  totalExpenses: number;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(
  undefined
);

export function ExpenseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      if (stored) {
        setTransactions(JSON.parse(stored));
      }
    } catch (error) {
      console.log("Failed to load transactions:", error);
    }
  };

  const saveTransactions = async (data: Transaction[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.log("Failed to save transactions:", error);
    }
  };

  const addTransaction = (transaction: Transaction) => {
    const updated = [transaction, ...transactions];

    setTransactions(updated);
    saveTransactions(updated);
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter(
      (transaction) => transaction.id !== id
    );

    setTransactions(updated);
    saveTransactions(updated);
  };

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.type === "income")
        .reduce((sum, transaction) => sum + transaction.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(
    () =>
      transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((sum, transaction) => sum + transaction.amount, 0),
    [transactions]
  );

  const balance = totalIncome - totalExpenses;

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        balance,
        totalIncome,
        totalExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);

  if (!context) {
    throw new Error(
      "useExpenses must be used inside ExpenseProvider"
    );
  }

  return context;
}