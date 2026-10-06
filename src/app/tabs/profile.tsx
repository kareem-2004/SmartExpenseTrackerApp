import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Avatar,
  Card,
  Divider,
  List,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();

            router.replace("/auth/login");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Profile</Text>

        {/* User information */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text
              size={70}
              label={
                user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : "U"
              }
              style={styles.avatar}
            />

            <View>
              <Text style={styles.name}>
                {user?.name || "User"}
              </Text>

              <Text style={styles.email}>
                {user?.email || "No email"}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>
          Settings
        </Text>

        <Card style={styles.settingsCard}>
          <List.Item
            title="Monthly Budget"
            description="Set your spending limit"
            left={(props) => (
              <List.Icon
                {...props}
                icon="wallet-outline"
              />
            )}
            onPress={() => {}}
          />

          <Divider />

          <List.Item
            title="Notifications"
            description="Manage notifications"
            left={(props) => (
              <List.Icon
                {...props}
                icon="bell-outline"
              />
            )}
            onPress={() => {}}
          />

          <Divider />

          <List.Item
            title="Appearance"
            description="Light mode"
            left={(props) => (
              <List.Icon
                {...props}
                icon="theme-light-dark"
              />
            )}
            onPress={() => {}}
          />

          <Divider />

          <List.Item
            title="Currency"
            description="USD"
            left={(props) => (
              <List.Icon
                {...props}
                icon="currency-usd"
              />
            )}
            onPress={() => {}}
          />
        </Card>

        {/* Logout */}
        <Card style={styles.logoutCard}>
          <List.Item
            title="Logout"
            titleStyle={styles.logout}
            left={(props) => (
              <List.Icon
                {...props}
                icon="logout"
                color="#DC2626"
              />
            )}
            onPress={handleLogout}
          />
        </Card>
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
    marginBottom: 20,
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 30,
  },

  profileContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  avatar: {
    backgroundColor: "#4F46E5",
    marginRight: 15,
  },

  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  email: {
    color: "#6B7280",
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
    color: "#111827",
  },

  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 15,
    overflow: "hidden",
  },

  logoutCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
  },

  logout: {
    color: "#DC2626",
    fontWeight: "700",
  },
});