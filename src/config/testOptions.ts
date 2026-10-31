import type { TestCase } from "../types";

export const modulesList = ["Authentication", "Checkout", "Search", "User Profile", "Payments", "Notifications", "Reports", "Admin Console"];
export const typesList: TestCase["type"][] = ["Functional", "Regression", "Smoke", "E2E", "API", "Performance"];
export const prioritiesList: TestCase["priority"][] = ["Critical", "High", "Medium", "Low"];
export const statusesList: TestCase["status"][] = ["Passed", "Failed", "Blocked", "Not Run", "In Progress"];
