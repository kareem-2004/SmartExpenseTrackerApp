import React from "react";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "../context/AuthContext";
import { ExpenseProvider } from "../context/ExpenseContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <PaperProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </PaperProvider>
      </ExpenseProvider>
    </AuthProvider>
  );
}