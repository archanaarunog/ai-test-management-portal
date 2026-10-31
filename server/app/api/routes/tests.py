import random
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.db.models import Activity, TestResult, TestRun, User
from app.schemas.api import ErrorResponse, ExecuteRequest, TestCaseCreate, TestCaseResponse, TestCaseUpdate, TestListResponse, TestResultResponse
from app.services.test_cases import create_test, delete_test, get_test, list_tests, to_response, update_test

router = APIRouter(prefix="/tests", tags=["Test cases"], dependencies=[Depends(get_current_user)])


@router.get("", response_model=TestListResponse)
def get_tests(search: str | None = None, module: str | None = None,
              type: str | None = Query(default=None, pattern="^(Functional|Regression|Smoke|E2E|API|Performance)$"),
              automated: bool | None = None, page: int = Query(1, ge=1), page_size: int = Query(20, ge=1, le=100),
              db: Session = Depends(get_db)):
    return list_tests(db, search, module, type, automated, page, page_size)


@router.get("/{test_id}", response_model=TestCaseResponse, responses={404: {"model": ErrorResponse, "description": "Test case not found"}})
def get_one(test_id: str, db: Session = Depends(get_db)):
    return to_response(get_test(db, test_id))


@router.post("", response_model=TestCaseResponse, status_code=201,
             responses={404: {"model": ErrorResponse, "description": "Module not found"}})
def create(payload: TestCaseCreate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return to_response(create_test(db, payload, user))


@router.put("/{test_id}", response_model=TestCaseResponse,
            responses={404: {"model": ErrorResponse, "description": "Test case or module not found"}})
def update(test_id: str, payload: TestCaseUpdate, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return to_response(update_test(db, test_id, payload, user))


@router.delete("/{test_id}", status_code=204, responses={404: {"model": ErrorResponse, "description": "Test case not found"}})
def delete(test_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    delete_test(db, test_id, user)
    return Response(status_code=204)


@router.post("/{test_id}/execute", response_model=TestResultResponse, status_code=201,
            responses={404: {"model": ErrorResponse, "description": "Test case not found"},
                       422: {"model": ErrorResponse, "description": "Invalid execution request"}})
def execute(test_id: str, payload: ExecuteRequest | None = None, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    test = get_test(db, test_id)
    run = TestRun(id=str(uuid4()), executed_by_id=user.id)
    status = payload.status if payload and payload.status else random.choices(["Passed", "Failed"], weights=[0.75, 0.25])[0]
    duration = payload.duration_seconds if payload and payload.duration_seconds is not None else random.randint(4, 58)
    result = TestResult(id=str(uuid4()), test_run=run, test_case_id=test.id, status=status,
                        duration_seconds=duration, executed_by_id=user.id)
    test.status = status
    db.add_all([run, result, Activity(id=f"act-{uuid4()}", actor_id=user.id, action="executed", target=f"{test.key} {test.title}", status=status)])
    db.commit()
    db.refresh(result)
    return {"id": result.id, "test_case_id": result.test_case_id, "test_run_id": result.test_run_id,
            "status": result.status, "duration_seconds": result.duration_seconds,
            "executed_by": user, "executed_at": result.executed_at}
