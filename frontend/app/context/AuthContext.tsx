
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface Broker {
  _id: string;
  name: string;
  phoneNumber: string;
}

interface AuthContextType {
  broker: Broker | null;
  token: string | null;
  login: (token: string, broker: Broker) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [broker, setBroker] = useState<Broker | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedBroker = localStorage.getItem("broker");

    if (storedToken) setToken(storedToken);

    if (storedBroker) {
      try {
        const parsedBroker = JSON.parse(storedBroker);
        setBroker(parsedBroker);
      } catch (err) {
        console.error("Failed to parse stored broker:", err);
        localStorage.removeItem("broker");
        setBroker(null);
      }
    }
  }, []);

  const login = (token: string, broker: Broker) => {
    if (!broker || !token) return;

    localStorage.setItem("authToken", token);
    localStorage.setItem("broker", JSON.stringify(broker));

    setToken(token);
    setBroker(broker);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("broker");
    setToken(null);
    setBroker(null);
  };

  return (
    <AuthContext.Provider
      value={{
        broker,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!broker,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within AuthProvider");
  return context;
};
