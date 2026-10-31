from datetime import datetime, timedelta, timezone
from uuid import uuid4

from sqlalchemy import select

from app.core.config import settings
from app.core.security import hash_password
from app.db.database import SessionLocal
from app.db.models import Activity, Module, Notification, TestCase, TestResult, TestRun, User
from app.seed_data import ACTIVITY, MODULES, NOTIFICATIONS, USERS, test_cases


def seed() -> None:
    with SessionLocal() as db:
        if db.scalar(select(User.id).limit(1)):
            print("Seed skipped: users already exist. No existing records were changed.")
            return
        users = {}
        for row in USERS:
            user = User(id=row[0], name=row[1], email=row[2], role=row[3], avatar_initials=row[4], team=row[5],
                        password_hash=hash_password(settings.seed_demo_password))
            db.add(user)
            users[user.name] = user
        modules = {name: Module(name=name) for name in MODULES}
        db.add_all(modules.values())
        db.flush()

        cases = []
        for row in test_cases():
            case = TestCase(id=row["id"], key=row["key"], title=row["title"], module=modules[row["module"]],
                            owner_user=next((user for user in users.values() if user.name == row["owner"]), None),
                            owner_name=row["owner"],
                            type=row["type"], priority=row["priority"], status=row["status"], automated=row["automated"],
                            description=row["description"], tags=row["tags"], steps=row["steps"])
            cases.append(case)
        db.add_all(cases)
        db.flush()

        # Seed a real historical result for every mock test with an executed status.
        now = datetime.now(timezone.utc)
        for idx, case in enumerate(cases):
            if case.status in {"Passed", "Failed", "Blocked"}:
                when = now - timedelta(days=idx % 8, minutes=idx * 3)
                runner = users[USERS[idx % len(USERS)][1]]
                run = TestRun(id=str(uuid4()), executed_by_id=runner.id, started_at=when)
                db.add(run)
                db.add(TestResult(id=str(uuid4()), test_run=run, test_case=case, status=case.status,
                                  duration_seconds=4 + ((idx + 1) * 7 % 55), executed_by=runner, executed_at=when))

        for idx, (actor_name, action, target, status, minutes_ago) in enumerate(ACTIVITY):
            actor = next((u for u in users.values() if u.name == actor_name), None)
            db.add(Activity(id=f"act-{idx+1}", actor_id=actor.id if actor else None, action=action,
                            target=target, status=status, created_at=now - timedelta(minutes=minutes_ago)))
        for idx, (kind, title, message, minutes_ago, read) in enumerate(NOTIFICATIONS):
            db.add(Notification(id=f"n-{idx+1}", user_id=None, type=kind, title=title, message=message,
                                read=read, created_at=now - timedelta(minutes=minutes_ago)))
        db.commit()
        print(f"Seed complete: {len(users)} users, {len(modules)} modules, {len(cases)} test cases, "
              f"{sum(c.status in {'Passed', 'Failed', 'Blocked'} for c in cases)} initial results, "
              f"{len(ACTIVITY)} activities, {len(NOTIFICATIONS)} notifications.")
        print(f"Development-only login: {USERS[0][2]} / {settings.seed_demo_password}")


if __name__ == "__main__":
    seed()
