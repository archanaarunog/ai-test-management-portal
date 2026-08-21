import type { ActivityItem, NotificationItem, UserAccount, TrendPoint, ModuleCoverage } from "../types";

export const currentUser: UserAccount = {
  id: "u-001",
  name: "Achu Nair",
  email: "achu.nair@aitestportal.dev",
  role: "SDET",
  avatarInitials: "AN",
  team: "Platform Quality",
};

export const mockUsers: UserAccount[] = [
  currentUser,
  { id: "u-002", name: "Priya Menon", email: "priya.menon@aitestportal.dev", role: "QA Lead", avatarInitials: "PM", team: "Platform Quality" },
  { id: "u-003", name: "Rahul Iyer", email: "rahul.iyer@aitestportal.dev", role: "QA Engineer", avatarInitials: "RI", team: "Checkout Quality" },
  { id: "u-004", name: "Sneha Kapoor", email: "sneha.kapoor@aitestportal.dev", role: "Admin", avatarInitials: "SK", team: "Platform Quality" },
];

export const mockActivity: ActivityItem[] = [
  { id: "act-1", actor: "Priya Menon", action: "executed", target: "QA-1012 Validate checkout total updates with coupon code", timestamp: "8 min ago", status: "Passed" },
  { id: "act-2", actor: "Rahul Iyer", action: "marked failed", target: "QA-1006 Verify payment fails gracefully on expired card", timestamp: "22 min ago", status: "Failed" },
  { id: "act-3", actor: "Achu Nair", action: "created", target: "QA-1029 Verify responsive layout collapses sidebar on mobile", timestamp: "41 min ago", status: "Info" },
  { id: "act-4", actor: "Sneha Kapoor", action: "blocked", target: "QA-1015 Validate admin can deactivate a user account", timestamp: "1 hr ago", status: "Blocked" },
  { id: "act-5", actor: "Vikram Rao", action: "executed", target: "QA-1003 Validate 'Remember Me' persists session", timestamp: "2 hr ago", status: "Passed" },
  { id: "act-6", actor: "Divya Suresh", action: "updated", target: "QA-1021 Validate date range picker restricts invalid ranges", timestamp: "3 hr ago", status: "In Progress" },
  { id: "act-7", actor: "Priya Menon", action: "executed", target: "QA-1018 Verify table sort toggles ascending/descending", timestamp: "5 hr ago", status: "Passed" },
  { id: "act-8", actor: "Rahul Iyer", action: "reopened", target: "QA-1008 Verify search filters combine correctly", timestamp: "Yesterday", status: "Failed" },
];

export const mockNotifications: NotificationItem[] = [
  { id: "n-1", type: "success", title: "Regression suite passed", message: "Nightly regression run completed with 96% pass rate.", timestamp: "10 min ago", read: false },
  { id: "n-2", type: "error", title: "Payment suite failure", message: "3 tests failed in the Payments module after last deploy.", timestamp: "35 min ago", read: false },
  { id: "n-3", type: "warning", title: "Flaky test detected", message: "QA-1008 has failed intermittently 4 times this week.", timestamp: "1 hr ago", read: false },
  { id: "n-4", type: "info", title: "New build available", message: "Build 2026.08.11-rc3 is ready for smoke testing.", timestamp: "2 hr ago", read: true },
  { id: "n-5", type: "success", title: "Test case reviewed", message: "Priya Menon approved 6 new test cases in Checkout.", timestamp: "Yesterday", read: true },
];

export const trendData: TrendPoint[] = [
  { date: "Aug 04", passed: 142, failed: 12, blocked: 4 },
  { date: "Aug 05", passed: 138, failed: 18, blocked: 6 },
  { date: "Aug 06", passed: 151, failed: 9, blocked: 3 },
  { date: "Aug 07", passed: 146, failed: 14, blocked: 5 },
  { date: "Aug 08", passed: 158, failed: 7, blocked: 2 },
  { date: "Aug 09", passed: 149, failed: 16, blocked: 4 },
  { date: "Aug 10", passed: 163, failed: 8, blocked: 3 },
  { date: "Aug 11", passed: 171, failed: 6, blocked: 2 },
];

export const moduleCoverage: ModuleCoverage[] = [
  { module: "Authentication", coverage: 92, tests: 34 },
  { module: "Checkout", coverage: 78, tests: 51 },
  { module: "Search", coverage: 85, tests: 27 },
  { module: "Payments", coverage: 66, tests: 39 },
  { module: "User Profile", coverage: 88, tests: 22 },
  { module: "Admin Console", coverage: 58, tests: 18 },
];

export const statusDistribution = [
  { name: "Passed", value: 171, color: "#16a34a" },
  { name: "Failed", value: 6, color: "#dc2626" },
  { name: "Blocked", value: 2, color: "#d97706" },
  { name: "Not Run", value: 14, color: "#94a3b8" },
];
