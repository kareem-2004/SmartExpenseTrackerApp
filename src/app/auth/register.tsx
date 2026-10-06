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

const registerSchema = z
  .object({
    name: z
      .string()
      .min(
        2,
        "Name must be at least 2 characters"
      ),

    email: z
      .string()
      .email("Enter a valid email"),

    password: z
      .string()
      .min(
        6,
        "Password must be at least 6 characters"
      ),

    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

type RegisterForm =
  z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  // IMPORTANT:
  // useAuth MUST be inside the component
  const { register } = useAuth();

  const [registerError, setRegisterError] =
    useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(
      registerSchema
    ),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (
    data: RegisterForm
  ) => {
    try {
      setRegisterError("");

      await register(
        data.name,
        data.email,
        data.password
      );

      router.replace("/tabs/dashboard");
    } catch (error) {
      console.log(
        "Registration error:",
        error
      );

      setRegisterError(
        "Unable to create account."
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
        <Text style={styles.title}>
          Create account
        </Text>

        <Text style={styles.subtitle}>
          Start managing your expenses today.
        </Text>

        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            render={({
              field: {
                onChange,
                value,
              },
            }) => (
              <TextInput
                label="Full name"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                style={styles.input}
                error={!!errors.name}
              />
            )}
          />

          {errors.name && (
            <Text style={styles.error}>
              {errors.name.message}
            </Text>
          )}

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
                style={styles.input}
                error={!!errors.email}
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
                style={styles.input}
                error={!!errors.password}
              />
            )}
          />

          {errors.password && (
            <Text style={styles.error}>
              {errors.password.message}
            </Text>
          )}

          <Controller
            control={control}
            name="confirmPassword"
            render={({
              field: {
                onChange,
                value,
              },
            }) => (
              <TextInput
                label="Confirm password"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                style={styles.input}
                error={
                  !!errors.confirmPassword
                }
              />
            )}
          />

          {errors.confirmPassword && (
            <Text style={styles.error}>
              {
                errors.confirmPassword
                  .message
              }
            </Text>
          )}

          {registerError !== "" && (
            <Text style={styles.error}>
              {registerError}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(
              onSubmit
            )}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Create account
          </Button>

          <View style={styles.loginRow}>
            <Text>
              Already have an account?
            </Text>

            <Link
              href="/auth/login"
              asChild
            >
              <Button mode="text">
                Login
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

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 32,
  },

  form: {
    width: "100%",
  },

  input: {
    backgroundColor: "#FFFFFF",
    marginBottom: 6,
  },

  error: {
    color: "#DC2626",
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 4,
  },

  button: {
    marginTop: 16,
    borderRadius: 10,
  },

  buttonContent: {
    height: 52,
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});