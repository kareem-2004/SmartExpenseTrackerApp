import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Text,
  TextInput,
} from "react-native-paper";
import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";

const loginSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email"),

  password: z
    .string()
    .min(
      6,
      "Password must be at least 6 characters"
    ),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  // IMPORTANT:
  // useAuth MUST be inside the component
  const { login } = useAuth();

  const [loginError, setLoginError] =
    useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoginError("");

    const success = await login(
      data.email,
      data.password
    );

    if (success) {
      router.replace("/tabs/dashboard");
    } else {
      setLoginError(
        "Invalid email or password."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>
            Smart
          </Text>

          <Text style={styles.logoAccent}>
            Expense
          </Text>

          <Text style={styles.title}>
            Welcome back
          </Text>

          <Text style={styles.subtitle}>
            Manage your money smarter.
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({
              field: {
                onChange,
                value,
              },
            }) => (
              <TextInput
                label="Email"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                keyboardType="email-address"
                error={!!errors.email}
                style={styles.input}
              />
            )}
          />

          {errors.email && (
            <Text style={styles.error}>
              {errors.email.message}
            </Text>
          )}

          <Controller
            control={control}
            name="password"
            render={({
              field: {
                onChange,
                value,
              },
            }) => (
              <TextInput
                label="Password"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                error={!!errors.password}
                style={styles.input}
              />
            )}
          />

          {errors.password && (
            <Text style={styles.error}>
              {errors.password.message}
            </Text>
          )}

          {loginError !== "" && (
            <Text style={styles.error}>
              {loginError}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            style={styles.loginButton}
            contentStyle={styles.buttonContent}
          >
            Login
          </Button>

          <View style={styles.registerRow}>
            <Text>
              Don't have an account?
            </Text>

            <Link
              href="/auth/register"
              asChild
            >
              <Button mode="text">
                Create account
              </Button>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  header: {
    marginBottom: 40,
  },

  logo: {
    fontSize: 28,
    fontWeight: "700",
  },

  logoAccent: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4F46E5",
    marginBottom: 30,
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
  },

  form: {
    width: "100%",
  },

  input: {
    marginBottom: 6,
    backgroundColor: "#FFFFFF",
  },

  error: {
    color: "#DC2626",
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 4,
  },

  loginButton: {
    marginTop: 18,
    borderRadius: 10,
  },

  buttonContent: {
    height: 52,
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});