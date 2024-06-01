"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { AIWriterAPI } from "@/app/api/AIWriterAPI";

interface AuthContextType {
  isLoggedIn: boolean;
  email: string;
  isSubscribedMonthly: boolean;
  isSubscribedLifetime: boolean;
  isLoading: boolean;
  setIsLoggedIn: (value: boolean) => void;
  setEmail: (value: string) => void;
  setIsSubscribedMonthly: (value: boolean) => void;
  setIsSubscribedLifetime: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribedMonthly, setIsSubscribedMonthly] = useState(false);
  const [isSubscribedLifetime, setIsSubscribedLifetime] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyLoginStatus = async () => {
      // to check if the user is logged in (e.g., checking an auth token)
      try {
        const data = await AIWriterAPI.getAuthStatus();
        if (data.isLoggedIn) {
          setIsLoggedIn(true);
          setEmail(data.email || "");
          setIsSubscribedMonthly(data.isSubscribedMonthly);
          setIsSubscribedLifetime(data.isSubscribedLifetime);
        } else {
          setIsLoggedIn(false);
          setEmail("");
        }
      } catch (error) {
        setIsLoggedIn(false);
        setEmail("");
      } finally {
        setIsLoading(false);
      }
    };

    verifyLoginStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        email,
        isSubscribedMonthly,
        isSubscribedLifetime,
        isLoading,
        setIsLoggedIn,
        setEmail,
        setIsSubscribedMonthly,
        setIsSubscribedLifetime,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
