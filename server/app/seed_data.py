"""Development fixtures copied from src/data/mockTests.ts and mockActivity.ts."""
MODULES = ["Authentication", "Checkout", "Search", "User Profile", "Payments", "Notifications", "Reports", "Admin Console"]
OWNERS = ["Archana Arun", "Priya Menon", "Rahul Iyer", "Sneha Kapoor", "Vikram Rao", "Divya Suresh"]
TYPES = ["Functional", "Regression", "Smoke", "E2E", "API", "Performance"]
PRIORITIES = ["Critical", "High", "Medium", "Low"]
STATUSES = ["Passed", "Failed", "Blocked", "Not Run", "In Progress"]
TITLES = [
    "Verify user can log in with valid credentials", "Verify error message on invalid password",
    "Validate 'Remember Me' persists session", "Verify forgot password sends reset link",
    "Validate checkout total updates with coupon code", "Verify payment fails gracefully on expired card",
    "Validate search returns relevant results for partial match", "Verify search filters combine correctly",
    "Validate profile picture upload accepts jpg/png only", "Verify profile form rejects invalid phone number",
    "Validate notification preferences toggle persists", "Verify email notification sent on password change",
    "Validate report export downloads as CSV", "Verify report chart renders with correct totals",
    "Validate admin can deactivate a user account", "Verify admin audit log records role changes",
    "Validate pagination shows correct page count", "Verify table sort toggles ascending/descending",
    "Validate multi-select filter narrows results", "Verify drag-and-drop reorders priority queue",
    "Validate date range picker restricts invalid ranges", "Verify file upload rejects files over size limit",
    "Validate session times out after inactivity", "Verify breadcrumb reflects current navigation depth",
    "Validate keyboard shortcut opens quick search", "Verify context menu shows correct row actions",
    "Validate toast dismisses automatically after timeout", "Verify modal traps focus while open",
    "Validate iframe content loads external report", "Verify responsive layout collapses sidebar on mobile",
]
USERS = [
    ("u-001", "Archana Arun", "archana.arun@aitestportal.dev", "SDET", "AN", "Platform Quality"),
    ("u-002", "Priya Menon", "priya.menon@aitestportal.dev", "QA Lead", "PM", "Platform Quality"),
    ("u-003", "Rahul Iyer", "rahul.iyer@aitestportal.dev", "QA Engineer", "RI", "Checkout Quality"),
    ("u-004", "Sneha Kapoor", "sneha.kapoor@aitestportal.dev", "Admin", "SK", "Platform Quality"),
]
ACTIVITY = [
    ("Priya Menon", "executed", "QA-1012 Validate checkout total updates with coupon code", "Passed", 8),
    ("Rahul Iyer", "marked failed", "QA-1006 Verify payment fails gracefully on expired card", "Failed", 22),
    ("Archana Arun", "created", "QA-1029 Verify responsive layout collapses sidebar on mobile", "Info", 41),
    ("Sneha Kapoor", "blocked", "QA-1015 Validate admin can deactivate a user account", "Blocked", 60),
    ("Vikram Rao", "executed", "QA-1003 Validate 'Remember Me' persists session", "Passed", 120),
    ("Divya Suresh", "updated", "QA-1021 Validate date range picker restricts invalid ranges", "In Progress", 180),
    ("Priya Menon", "executed", "QA-1018 Verify table sort toggles ascending/descending", "Passed", 300),
    ("Rahul Iyer", "reopened", "QA-1008 Verify search filters combine correctly", "Failed", 1440),
]
NOTIFICATIONS = [
    ("success", "Regression suite passed", "Nightly regression run completed with 96% pass rate.", 10, False),
    ("error", "Payment suite failure", "3 tests failed in the Payments module after last deploy.", 35, False),
    ("warning", "Flaky test detected", "QA-1008 has failed intermittently 4 times this week.", 60, False),
    ("info", "New build available", "Build 2026.08.11-rc3 is ready for smoke testing.", 120, True),
    ("success", "Test case reviewed", "Priya Menon approved 6 new test cases in Checkout.", 1440, True),
]


def test_cases():
    for index, title in enumerate(TITLES):
        n = index + 1
        module = MODULES[n % len(MODULES)]
        owner = OWNERS[n % len(OWNERS)]
        test_type = TYPES[(n + 2) % len(TYPES)]
        priority = PRIORITIES[(n + 1) % len(PRIORITIES)]
        status = STATUSES[(n * 3 + 1) % len(STATUSES)]
        duration = 4 + ((n * 7) % 55)
        cleaned_title = title.removeprefix("Verify ").removeprefix("Validate ")
        yield {
            "id": f"tc-{n:03}", "key": f"QA-{1000+n}", "title": title, "module": module,
            "owner": owner, "type": test_type, "priority": priority, "status": status,
            "automated": n % 3 != 0, "duration": duration,
            "tags": [["ui", "api", "critical-path", "flaky", "new"][n % 5], ["chrome", "firefox", "webkit"][(n + 3) % 3]],
            "description": f'This test validates that the "{cleaned_title}" behavior works as expected across supported browsers, and that the UI reflects the correct state after the action completes.',
            "steps": [{"id": f"{n:03}-s1", "action": "Navigate to the relevant module page", "expectedResult": "Page loads within 2 seconds and shows the primary layout"},
                      {"id": f"{n:03}-s2", "action": "Perform the primary user action described in the title", "expectedResult": "System responds with the expected UI state change"},
                      {"id": f"{n:03}-s3", "action": "Verify resulting state and any confirmation feedback", "expectedResult": "Confirmation message or updated data is visible and accurate"}],
        }
