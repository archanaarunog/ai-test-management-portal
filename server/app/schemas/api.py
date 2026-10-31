from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

TestStatus = Literal["Passed", "Failed", "Blocked", "Not Run", "In Progress"]
TestType = Literal["Functional", "Regression", "Smoke", "E2E", "API", "Performance"]
TestPriority = Literal["Critical", "High", "Medium", "Low"]


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    email: EmailStr
    role: str
    avatar_initials: str
    team: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    user: UserResponse


class TestStep(BaseModel):
    id: str = Field(min_length=1, max_length=64)
    action: str = Field(min_length=1, max_length=1000)
    expectedResult: str = Field(min_length=1, max_length=1000)


class TestCaseCreate(BaseModel):
    title: str = Field(min_length=1, max_length=300)
    module: str = Field(min_length=1, max_length=120)
    type: TestType
    priority: TestPriority
    status: TestStatus = "Not Run"
    owner: str = Field(min_length=1, max_length=160)
    automated: bool = False
    description: str = Field(default="", max_length=10000)
    tags: list[str] = Field(default_factory=list, max_length=30)
    steps: list[TestStep] = Field(default_factory=list, max_length=100)


class TestCaseUpdate(TestCaseCreate):
    pass


class TestCaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    key: str
    title: str
    module: str
    type: str
    priority: str
    status: str
    owner: str
    automated: bool
    lastRun: str | None
    duration: str | None
    tags: list[str]
    description: str
    steps: list[dict]
    created_at: datetime
    updated_at: datetime


class TestListResponse(BaseModel):
    items: list[TestCaseResponse]
    total: int
    page: int
    page_size: int
    pages: int


class ExecuteRequest(BaseModel):
    status: Literal["Passed", "Failed", "Blocked"] | None = None
    duration_seconds: int | None = Field(default=None, ge=0, le=86400)


class TestResultResponse(BaseModel):
    id: str
    test_case_id: str
    test_run_id: str
    status: str
    duration_seconds: int
    executed_by: UserResponse
    executed_at: datetime


class SummaryResponse(BaseModel):
    total_tests: int
    passed: int
    failed: int
    blocked: int
    not_run: int
    in_progress: int
    pass_rate: float


class TrendPoint(BaseModel):
    date: str
    passed: int
    failed: int
    blocked: int


class StatusDistributionItem(BaseModel):
    name: str
    value: int
    color: str


class ModuleCoverageItem(BaseModel):
    module: str
    coverage: float
    tests: int


class ActivityResponse(BaseModel):
    id: str
    actor: str
    action: str
    target: str
    timestamp: datetime
    status: str


class NotificationResponse(BaseModel):
    id: str
    type: str
    title: str
    message: str
    timestamp: datetime
    read: bool


class ErrorResponse(BaseModel):
    detail: str


class MarkReadResponse(BaseModel):
    id: str
    read: bool


class HealthResponse(BaseModel):
    status: Literal["ok"]
