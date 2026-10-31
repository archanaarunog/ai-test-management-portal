import type { ActivityItem, ModuleCoverage, NotificationItem, TestCase, TrendPoint, UserAccount } from "../types";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");
const TOKEN_KEY = "atmp_token";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

export function clearToken() { localStorage.removeItem(TOKEN_KEY); }
export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function saveToken(token: string) { localStorage.setItem(TOKEN_KEY, token); }

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  if (response.status === 401) {
    clearToken();
    window.dispatchEvent(new Event("api:unauthorized"));
  }
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try { const body = await response.json(); message = body.detail || message; } catch { /* use status message */ }
    throw new ApiError(response.status, message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

interface ApiUser { id: string; name: string; email: string; role: UserAccount["role"]; avatar_initials: string; team: string }
interface ApiTest extends Omit<TestCase, "lastRun" | "duration"> { lastRun: string | null; duration: string | null }
const mapUser = (u: ApiUser): UserAccount => ({ id: u.id, name: u.name, email: u.email, role: u.role, avatarInitials: u.avatar_initials, team: u.team });
const mapTest = (t: ApiTest): TestCase => ({ ...t, lastRun: t.lastRun ? new Date(t.lastRun).toLocaleString() : "Not yet run", duration: t.duration ?? "-" });

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const result = await request<{ access_token: string; user: ApiUser }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      saveToken(result.access_token);
      return mapUser(result.user);
    },
    me: async () => mapUser(await request<ApiUser>("/api/auth/me")),
  },
  tests: {
    list: async (params: { search?: string; module?: string; types?: string[]; automated?: boolean; page?: number; page_size?: number } = {}) => {
      const query = new URLSearchParams();
      if (params.search) query.set("search", params.search);
      if (params.module) query.set("module", params.module);
      if (params.types?.length === 1) query.set("type", params.types[0]);
      if (params.automated) query.set("automated", "true");
      query.set("page", String(params.page ?? 1)); query.set("page_size", String(params.page_size ?? 100));
      const result = await request<{ items: ApiTest[]; total: number; page: number; page_size: number; pages: number }>(`/api/tests?${query}`);
      return { ...result, items: result.items.map(mapTest) };
    },
    create: async (data: Partial<TestCase>) => mapTest(await request<ApiTest>("/api/tests", { method: "POST", body: JSON.stringify(data) })),
    update: async (id: string, data: Partial<TestCase>) => mapTest(await request<ApiTest>(`/api/tests/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) })),
    remove: (id: string) => request<void>(`/api/tests/${encodeURIComponent(id)}`, { method: "DELETE" }),
    execute: (id: string) => request(`/api/tests/${encodeURIComponent(id)}/execute`, { method: "POST", body: JSON.stringify({}) }),
  },
  dashboard: {
    summary: () => request<{ total_tests: number; passed: number; failed: number; blocked: number; not_run: number; in_progress: number; pass_rate: number }>("/api/dashboard/summary"),
    trends: () => request<TrendPoint[]>("/api/dashboard/trends"),
    statusDistribution: () => request<{ name: string; value: number; color: string }[]>("/api/dashboard/status-distribution"),
    moduleCoverage: () => request<ModuleCoverage[]>("/api/dashboard/module-coverage"),
  },
  activity: () => request<(Omit<ActivityItem, "timestamp"> & { timestamp: string })[]>("/api/activity").then(rows => rows.map(x => ({ ...x, timestamp: relativeTime(x.timestamp) }))),
  notifications: {
    list: () => request<(Omit<NotificationItem, "timestamp"> & { timestamp: string })[]>("/api/notifications").then(rows => rows.map(x => ({ ...x, timestamp: relativeTime(x.timestamp) }))),
    markRead: (id: string) => request(`/api/notifications/${encodeURIComponent(id)}/read`, { method: "PATCH" }),
  },
};

function relativeTime(value: string): string {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} day(s) ago`;
}
