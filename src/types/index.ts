export type TestStatus = "Passed" | "Failed" | "Blocked" | "Not Run" | "In Progress";
export type TestPriority = "Critical" | "High" | "Medium" | "Low";
export type TestType = "Functional" | "Regression" | "Smoke" | "E2E" | "API" | "Performance";

export interface TestStep {
  id: string;
  action: string;
  expectedResult: string;
}

export interface TestCase {
  id: string;
  key: string;
  title: string;
  module: string;
  type: TestType;
  priority: TestPriority;
  status: TestStatus;
  owner: string;
  automated: boolean;
  lastRun: string;
  duration: string;
  tags: string[];
  description: string;
  steps: TestStep[];
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  status: TestStatus | "Info";
}

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "QA Lead" | "SDET" | "QA Engineer" | "Admin";
  avatarInitials: string;
  team: string;
}

export interface TrendPoint {
  date: string;
  passed: number;
  failed: number;
  blocked: number;
}

export interface ModuleCoverage {
  module: string;
  coverage: number;
  tests: number;
}
