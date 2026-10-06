import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "@smart_expense_user";
const LOGGED_IN_KEY = "@smart_expense_logged_in";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  login: (
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const storedUser =
        await AsyncStorage.getItem(USER_KEY);

      const loggedIn =
        await AsyncStorage.getItem(LOGGED_IN_KEY);

      if (storedUser && loggedIn === "true") {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log("Auth loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    const newUser: User = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    };

    await AsyncStorage.setItem(
      USER_KEY,
      JSON.stringify(newUser)
    );

    await AsyncStorage.setItem(
      LOGGED_IN_KEY,
      "true"
    );

    setUser(newUser);
  };

  const login = async (
    email: string,
    password: string
  ) => {
    try {
      const storedUser =
        await AsyncStorage.getItem(USER_KEY);

      if (!storedUser) {
        return false;
      }

      const savedUser: User =
        JSON.parse(storedUser);

      const emailMatches =
        savedUser.email ===
        email.toLowerCase().trim();

      const passwordMatches =
        savedUser.password === password;

      if (emailMatches && passwordMatches) {
        await AsyncStorage.setItem(
          LOGGED_IN_KEY,
          "true"
        );

        setUser(savedUser);

        return true;
      }

      return false;
    } catch (error) {
      console.log("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.setItem(
      LOGGED_IN_KEY,
      "false"
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}