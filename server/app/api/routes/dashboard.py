from datetime import date, datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.db.models import Module, TestCase, TestResult
from app.schemas.api import ErrorResponse, ModuleCoverageItem, StatusDistributionItem, SummaryResponse, TrendPoint

router = APIRouter(prefix="/dashboard", tags=["Dashboard"], dependencies=[Depends(get_current_user)],
                   responses={401: {"model": ErrorResponse, "description": "Valid bearer token required"}})


@router.get("/summary", response_model=SummaryResponse)
def summary(db: Session = Depends(get_db)):
    latest = select(TestResult.test_case_id, func.max(TestResult.executed_at).label("last_at")).group_by(TestResult.test_case_id).subquery()
    latest_status = select(TestResult.test_case_id, TestResult.status).join(latest, (TestResult.test_case_id == latest.c.test_case_id) & (TestResult.executed_at == latest.c.last_at)).subquery()
    resolved_status = func.coalesce(latest_status.c.status, TestCase.status)
    statuses = dict(db.execute(select(resolved_status, func.count()).select_from(TestCase)
                               .outerjoin(latest_status, latest_status.c.test_case_id == TestCase.id)
                               .group_by(resolved_status)).all())
    total = db.scalar(select(func.count()).select_from(TestCase)) or 0
    passed, failed, blocked = (statuses.get(s, 0) for s in ("Passed", "Failed", "Blocked"))
    not_run = statuses.get("Not Run", 0)
    in_progress = statuses.get("In Progress", 0)
    resolved = passed + failed + blocked
    return {"total_tests": total, "passed": passed, "failed": failed, "blocked": blocked,
            "not_run": not_run, "in_progress": in_progress,
            "pass_rate": round(passed * 100 / resolved, 1) if resolved else 0.0}


@router.get("/trends", response_model=list[TrendPoint])
def trends(days: int = 8, db: Session = Depends(get_db)):
    days = max(1, min(days, 90))
    start = datetime.now(timezone.utc).date() - timedelta(days=days - 1)
    rows = db.execute(select(func.date(TestResult.executed_at), TestResult.status, func.count())
                      .where(TestResult.executed_at >= start).group_by(func.date(TestResult.executed_at), TestResult.status)).all()
    grouped = {(day.isoformat() if hasattr(day, "isoformat") else str(day), status): count for day, status, count in rows}
    return [{"date": (start + timedelta(days=i)).strftime("%b %d"),
             "passed": grouped.get(((start + timedelta(days=i)).isoformat(), "Passed"), 0),
             "failed": grouped.get(((start + timedelta(days=i)).isoformat(), "Failed"), 0),
             "blocked": grouped.get(((start + timedelta(days=i)).isoformat(), "Blocked"), 0)} for i in range(days)]


@router.get("/status-distribution", response_model=list[StatusDistributionItem])
def status_distribution(db: Session = Depends(get_db)):
    latest = select(TestResult.test_case_id, func.max(TestResult.executed_at).label("last_at")).group_by(TestResult.test_case_id).subquery()
    latest_status = select(TestResult.test_case_id, TestResult.status).join(latest, (TestResult.test_case_id == latest.c.test_case_id) & (TestResult.executed_at == latest.c.last_at)).subquery()
    resolved_status = func.coalesce(latest_status.c.status, TestCase.status)
    counts = dict(db.execute(select(resolved_status, func.count()).select_from(TestCase)
                             .outerjoin(latest_status, latest_status.c.test_case_id == TestCase.id)
                             .group_by(resolved_status)).all())
    colors = {"Passed": "#16a34a", "Failed": "#dc2626", "Blocked": "#d97706", "Not Run": "#94a3b8", "In Progress": "#2563eb"}
    return [{"name": name, "value": counts.get(name, 0), "color": color} for name, color in colors.items()]


@router.get("/module-coverage", response_model=list[ModuleCoverageItem])
def module_coverage(db: Session = Depends(get_db)):
    # Coverage here is the proportion of cases in each module marked automated;
    # both numerator and denominator come from the persisted test_cases table.
    rows = db.execute(select(Module.name, func.count(TestCase.id), func.sum(case((TestCase.automated.is_(True), 1), else_=0)))
                      .outerjoin(TestCase).group_by(Module.id, Module.name).order_by(Module.name)).all()
    return [{"module": name, "coverage": round((automated or 0) * 100 / total, 1) if total else 0.0,
             "tests": total} for name, total, automated in rows]
