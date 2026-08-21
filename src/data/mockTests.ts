import type { TestCase } from "../types";

const modules = ["Authentication", "Checkout", "Search", "User Profile", "Payments", "Notifications", "Reports", "Admin Console"];
const owners = ["Achu Nair", "Priya Menon", "Rahul Iyer", "Sneha Kapoor", "Vikram Rao", "Divya Suresh"];
const types: TestCase["type"][] = ["Functional", "Regression", "Smoke", "E2E", "API", "Performance"];
const priorities: TestCase["priority"][] = ["Critical", "High", "Medium", "Low"];
const statuses: TestCase["status"][] = ["Passed", "Failed", "Blocked", "Not Run", "In Progress"];

const titles = [
  "Verify user can log in with valid credentials",
  "Verify error message on invalid password",
  "Validate 'Remember Me' persists session",
  "Verify forgot password sends reset link",
  "Validate checkout total updates with coupon code",
  "Verify payment fails gracefully on expired card",
  "Validate search returns relevant results for partial match",
  "Verify search filters combine correctly",
  "Validate profile picture upload accepts jpg/png only",
  "Verify profile form rejects invalid phone number",
  "Validate notification preferences toggle persists",
  "Verify email notification sent on password change",
  "Validate report export downloads as CSV",
  "Verify report chart renders with correct totals",
  "Validate admin can deactivate a user account",
  "Verify admin audit log records role changes",
  "Validate pagination shows correct page count",
  "Verify table sort toggles ascending/descending",
  "Validate multi-select filter narrows results",
  "Verify drag-and-drop reorders priority queue",
  "Validate date range picker restricts invalid ranges",
  "Verify file upload rejects files over size limit",
  "Validate session times out after inactivity",
  "Verify breadcrumb reflects current navigation depth",
  "Validate keyboard shortcut opens quick search",
  "Verify context menu shows correct row actions",
  "Validate toast dismisses automatically after timeout",
  "Verify modal traps focus while open",
  "Validate iframe content loads external report",
  "Verify responsive layout collapses sidebar on mobile",
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function pad(n: number, width = 3) {
  return n.toString().padStart(width, "0");
}

export const mockTests: TestCase[] = Array.from({ length: 30 }, (_, i) => {
  const n = i + 1;
  const status = pick(statuses, n * 3 + 1);
  const durationSec = 4 + ((n * 7) % 55);
  return {
    id: `tc-${pad(n)}`,
    key: `QA-${1000 + n}`,
    title: titles[i],
    module: pick(modules, n),
    type: pick(types, n + 2),
    priority: pick(priorities, n + 1),
    status,
    owner: pick(owners, n),
    automated: n % 3 !== 0,
    lastRun: `2026-08-${pad((n % 10) + 1, 2)} ${9 + (n % 8)}:${pad((n * 13) % 60, 2)}`,
    duration: `${durationSec}s`,
    tags: [pick(["ui", "api", "critical-path", "flaky", "new"], n), pick(["chrome", "firefox", "webkit"], n + 3)],
    description:
      `This test validates that the "${titles[i].replace(/^Verify |^Validate /, "")}" behavior works as expected across supported browsers, and that the UI reflects the correct state after the action completes.`,
    steps: [
      { id: `${pad(n)}-s1`, action: "Navigate to the relevant module page", expectedResult: "Page loads within 2 seconds and shows the primary layout" },
      { id: `${pad(n)}-s2`, action: "Perform the primary user action described in the title", expectedResult: "System responds with the expected UI state change" },
      { id: `${pad(n)}-s3`, action: "Verify resulting state and any confirmation feedback", expectedResult: "Confirmation message or updated data is visible and accurate" },
    ],
  };
});

export const modulesList = modules;
export const ownersList = owners;
export const typesList = types;
export const prioritiesList = priorities;
export const statusesList = statuses;
