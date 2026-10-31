from datetime import datetime, timezone
from uuid import uuid4

from fastapi import HTTPException
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, joinedload

from app.db.models import Activity, Module, TestCase, TestResult, User
from app.schemas.api import TestCaseCreate, TestCaseUpdate


def to_response(test: TestCase) -> dict:
    latest = max(test.results, key=lambda result: result.executed_at) if test.results else None
    return {
        "id": test.id, "key": test.key, "title": test.title, "module": test.module.name,
        "type": test.type, "priority": test.priority, "status": latest.status if latest else test.status,
        "owner": test.owner_user.name if test.owner_user else test.owner_name, "automated": test.automated,
        "lastRun": latest.executed_at.isoformat(timespec="minutes") if latest else None,
        "duration": f"{latest.duration_seconds}s" if latest else None, "tags": test.tags,
        "description": test.description, "steps": test.steps, "created_at": test.created_at,
        "updated_at": test.updated_at,
    }


def list_tests(db: Session, search: str | None, module: str | None, test_type: str | None, automated: bool | None, page: int, page_size: int):
    query = select(TestCase).options(joinedload(TestCase.module), joinedload(TestCase.owner_user), joinedload(TestCase.results))
    if search:
        term = f"%{search.strip()}%"
        query = query.outerjoin(TestCase.owner_user).where(or_(TestCase.title.ilike(term), TestCase.key.ilike(term), TestCase.owner_name.ilike(term)))
    if module:
        query = query.join(TestCase.module).where(Module.name == module)
    if test_type:
        query = query.where(TestCase.type == test_type)
    if automated is not None:
        query = query.where(TestCase.automated.is_(automated))
    total = db.scalar(select(func.count()).select_from(query.order_by(None).subquery())) or 0
    rows = db.scalars(query.order_by(TestCase.key).offset((page - 1) * page_size).limit(page_size)).unique().all()
    return {"items": [to_response(test) for test in rows], "total": total, "page": page, "page_size": page_size, "pages": (total + page_size - 1) // page_size}


def resolve_module_owner(db: Session, module_name: str, owner_name: str):
    module = db.scalar(select(Module).where(Module.name == module_name))
    if module is None:
        raise HTTPException(status_code=404, detail=f"Module not found: {module_name}")
    owner = db.scalar(select(User).where(func.lower(User.name) == owner_name.lower()))
    return module, owner


def create_test(db: Session, data: TestCaseCreate, actor: User):
    module, owner = resolve_module_owner(db, data.module, data.owner)
    keys = db.scalars(select(TestCase.key)).all()
    next_num = max((int(key.removeprefix("QA-")) for key in keys if key.startswith("QA-") and key[3:].isdigit()), default=1000) + 1
    test = TestCase(id=f"tc-{uuid4().hex[:12]}", key=f"QA-{next_num}", title=data.title, module_id=module.id,
                    type=data.type, priority=data.priority, status=data.status, owner_id=owner.id if owner else None,
                    owner_name=data.owner, automated=data.automated,
                    description=data.description, tags=data.tags, steps=[step.model_dump() for step in data.steps])
    db.add(test)
    db.flush()
    db.add(Activity(id=f"act-{uuid4()}", actor_id=actor.id, action="created", target=f"{test.key} {test.title}"))
    db.commit()
    db.refresh(test)
    return db.scalar(select(TestCase).options(joinedload(TestCase.module), joinedload(TestCase.owner_user), joinedload(TestCase.results)).where(TestCase.id == test.id))


def get_test(db: Session, test_id: str):
    test = db.scalar(select(TestCase).options(joinedload(TestCase.module), joinedload(TestCase.owner_user), joinedload(TestCase.results)).where(TestCase.id == test_id))
    if test is None:
        raise HTTPException(status_code=404, detail="Test case not found")
    return test


def update_test(db: Session, test_id: str, data: TestCaseUpdate, actor: User):
    test = get_test(db, test_id)
    module, owner = resolve_module_owner(db, data.module, data.owner)
    for key in ("title", "type", "priority", "status", "automated", "description", "tags"):
        setattr(test, key, getattr(data, key))
    test.module_id, test.owner_id, test.owner_name = module.id, owner.id if owner else None, data.owner
    test.steps = [step.model_dump() for step in data.steps]
    test.updated_at = datetime.now(timezone.utc)
    db.add(Activity(id=f"act-{uuid4()}", actor_id=actor.id, action="updated", target=f"{test.key} {test.title}"))
    db.commit()
    return get_test(db, test.id)


def delete_test(db: Session, test_id: str, actor: User):
    test = get_test(db, test_id)
    target = f"{test.key} {test.title}"
    db.add(Activity(id=f"act-{uuid4()}", actor_id=actor.id, action="deleted", target=target))
    db.delete(test)
    db.commit()
