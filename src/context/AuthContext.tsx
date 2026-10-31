import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { UserAccount } from "../types";
import { api, clearToken, getToken } from "../services/api";

interface AuthContextValue {
  isAuthenticated: boolean;
  user: UserAccount | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(Boolean(getToken()));
  const logout = useCallback(() => { clearToken(); setUser(null); }, []);

  useEffect(() => {
    if (!getToken()) return;
    api.auth.me().then(setUser).catch(logout).finally(() => setLoading(false));
    const unauthorized = () => { setUser(null); setLoading(false); };
    window.addEventListener("api:unauthorized", unauthorized);
    return () => window.removeEventListener("api:unauthorized", unauthorized);
  }, [logout]);

  const login = useCallback(async (email: string, password: string, _rememberMe: boolean) => {
    try { setUser(await api.auth.login(email, password)); return { ok: true }; }
    catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Login failed" }; }
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated: Boolean(user), user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
export const DEMO_CREDENTIALS = { email: "archana.arun@aitestportal.dev", password: "Automate@123" };
