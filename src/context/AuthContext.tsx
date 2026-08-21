import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { currentUser } from "../data/mockActivity";
import type { UserAccount } from "../types";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: UserAccount | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const VALID_EMAIL = "achu.nair@aitestportal.dev";
const VALID_PASSWORD = "Automate@123";
const STORAGE_KEY = "atmp_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserAccount | null>(null);

  useEffect(() => {
    const remembered = window.localStorage.getItem(STORAGE_KEY);
    if (remembered === "true") {
      setIsAuthenticated(true);
      setUser(currentUser);
    }
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe: boolean) => {
    await new Promise((resolve) => setTimeout(resolve, 650));
    if (email.trim().toLowerCase() === VALID_EMAIL && password === VALID_PASSWORD) {
      setIsAuthenticated(true);
      setUser(currentUser);
      if (rememberMe) {
        window.localStorage.setItem(STORAGE_KEY, "true");
      }
      return { ok: true };
    }
    return { ok: false, error: "Invalid email or password. Try the demo credentials shown below." };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const DEMO_CREDENTIALS = { email: VALID_EMAIL, password: VALID_PASSWORD };
