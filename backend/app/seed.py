import datetime
from .db import SessionLocal, engine
from . import models
from .auth_utils import get_password_hash

def seed_db():
    print("Seeding database...")
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # 1. Clean existing data
    db.query(models.ActivityLog).delete()
    db.query(models.Project).delete()
    db.query(models.User).delete()
    db.commit()

    # 2. Add Users
    users_data = [
        {
            "email": "admin@saaspro.io",
            "full_name": "Alex Rivera",
            "password": "password123",
            "role": "Super Admin",
            "status": "Active",
            "avatar_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuB6xNSFrmXbkqyoBtAurCY1kl2uX2-cCzQYrzmvCuXSLzHkHGgBZ9IHHXg55_EEP9bKlPGL--0lEwafLwzT4k0BRJCMYRBarC6ASJfcZirdfLBwan_Frd9du3hN3MhfO82TNsGVZ6i-CsoaZUZ91LLSDUNujdli060GzbqGHptKVeC1ClOUKSBubH64iwoAdRIElnwgkk-wOV23mobOTvS7RraOnGXSO0qqqphEN9_kwd8DFJsfiFRZ6r-oVMLVUtEcR1wu4xZQgbYz"
        },
        {
            "email": "jordan.h@saaspro.io",
            "full_name": "Jordan Henderson",
            "password": "password123",
            "role": "System Admin",
            "status": "Active",
            "avatar_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuB3jIUfweoZqK2sTWKkNR5jTfMNxM7142gDd4vjrAUVmI-1DynV1skjzy79UhbKr26Yz6CLiepj2YS-iO2SVvij55RBfbrDZ6fRz9dEyvTxuuhuYdEEK3pyjNgclxuz1q6t_B47NyHHelLRi0zFPKPo69LpFXu6ca8vboRylbZOfcMrPIAkVnZzECloQHpXawYNTk0MEPVv8Fd2A7SySicBPg7cuMjG6e5KghDsbfV1kh-d5yaO3SVW5DoNaxFgYgt6iLK2sbTe8W5r"
        },
        {
            "email": "s.chen@design.co",
            "full_name": "Sarah Chen",
            "password": "password123",
            "role": "Editor",
            "status": "Active",
            "avatar_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuAcfKnIKZ7VaQb6zkJGq4EUs6oQ523NOIBpm3W7iNBD-4M6aoYKEKp2QRVZIY4Dq1QeBU7x22K1kQzofbBZgKIvgFgkAlHjur2LKOYPG0EXLfrlKKap4EvWcztSfoSsZ3WUyXwKUZVRH7QcNWPbVcc9hZ1WTD59Aw3Y4l6T80JUM9WFp7mAnVq0NgCyDcGXRHpKVYbJCDllONJXiVOV4F8lIesyDOF_eTykENc1e52OTNIxc0jm3GJSchyiklJSgGsZc_gMlqFRRbNy"
        },
        {
            "email": "m.thorne@analytics.io",
            "full_name": "Marcus Thorne",
            "password": "password123",
            "role": "Viewer",
            "status": "Inactive",
            "avatar_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuACPdCOHRh6VkMJPBDccNkpk1ZX-sQC9-ED1fjlDhW3UU9kHBQyzC_6sqzsbMibhI7SK95uQrd4y2S6PvWYvk-jL1pPE1iJaj8wyX8RLBFiv-U9af8pDWwc9MtpmRcMaY4LVgQOWHxuncYb650YCgMJRyjsCWNib5SVyNnd9AuJ9KtclmYzUxrx4nDz1O1Qz4unnpnRlTJ21FmU1AYjb94BwLI_XRLpdM53zA4oKmg4GGj4jmmzsdUCZLbZdI_nqHrHCeHeMCLpxg4P"
        },
        {
            "email": "lwei@enterprise.net",
            "full_name": "Lian Wei",
            "password": "password123",
            "role": "Security Officer",
            "status": "Active",
            "avatar_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuClrX9OOITZ9ZaAODaZa37fyAZZsuEGw-C9ThGO2JU0WYmPzSVIgXLBDsbcjpJploGLgLip6hME3svwkvufM9SFFfRzFKAoRokkoM4QFWJIUiyokM-ScXNTAvJsZeOUN48id8orzp_OTKYe2o6hlzI53EWtmjn7ubIHoPyVPtAHxBvC_6QcYLyaasZqXsn4Yo_V9cxdagrU9a0Ykw6TlNIQV_qRUPxj6gEd78EwelLa8KRmB4w4u49-LAkyayYcxjdQtZ2yqNP2dRid"
        },
        {
            "email": "vance.a@hq.com",
            "full_name": "Arthur Vance",
            "password": "password123",
            "role": "Member",
            "status": "Suspended",
            "avatar_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCKhxNxriPbjy3hoQ1kwbxGRqkpLoX8RW230AbLj7i1PY9lBJDwbdqPx0c0lHZcisJxP1pHh9Br7vqn3t1opFfqwL57xVdoVjzVkg6ZZLRPZw3fWu7FaAp-uuW1a59KZosML79Nn1kFyDXUl_FailnQYuIzoNFB92fwXbGXeloGwq1ZWTAlfEW4ZSrdHz7Kx_1hZh2_MSdIWbIYMZTYry7fJFKDa7cCfTXmUQuQCiwuMQ0-_oMfPwYYuaBqsU8ADFcq_GlD7FTuIeKm"
        }
    ]

    users = []
    for ud in users_data:
        u = models.User(
            email=ud["email"],
            full_name=ud["full_name"],
            hashed_password=get_password_hash(ud["password"]),
            role=ud["role"],
            status=ud["status"],
            avatar_url=ud["avatar_url"],
            last_login=datetime.datetime.utcnow() - datetime.timedelta(hours=6)
        )
        db.add(u)
        users.append(u)
        
    db.commit()
    for u in users:
        db.refresh(u)
        
    # Find specific users by email
    admin_user = next(u for u in users if u.email == "admin@saaspro.io")
    jordan = next(u for u in users if u.email == "jordan.h@saaspro.io")
    sarah_c = next(u for u in users if u.email == "s.chen@design.co")
    marcus = next(u for u in users if u.email == "m.thorne@analytics.io")
    lian = next(u for u in users if u.email == "lwei@enterprise.net")
    arthur = next(u for u in users if u.email == "vance.a@hq.com")

    # 3. Add Project
    proj = models.Project(
        title="HyperScale Infrastructure",
        completion_percentage=88,
        owner_id=jordan.id
    )
    db.add(proj)
    db.commit()

    # 4. Add Activity Logs (matching recent activity data in mockup)
    # Mocking some profiles for external logs
    sarah_jenkins = models.User(
        email="sarah.j@techcorp.com",
        full_name="Sarah Jenkins",
        hashed_password=get_password_hash("password123"),
        role="Member",
        status="Active",
        avatar_url="https://lh3.googleusercontent.com/aida-public/AB6AXuBX2tzW0j-4rLTMl04lZdzmmZ3cvwcY5CFlvZGDd8zzdWYZUFTkgmEAwyO_1TAY69UxuLaKxl3RlhTwTq6qAzkGK0v1QybUHTlJ698Aygvp6yQS-aSQel6HOTehCarmtUkZwPv3cxrWaZZniPKQC9eI-NHTX6Von7sGyXhsCsgp60TjBGC0gEnO7DLw8yuIUo50WPZXQTX-d_3Y2ruN4QxC4V6J2rE-7kCFyK96w5Xi9yCF__Snf-LW7HdiigrksexCGmfoj6WSn_Jq"
    )
    db.add(sarah_jenkins)
    
    michael_chen = models.User(
        email="m.chen@designflow.io",
        full_name="Michael Chen",
        hashed_password=get_password_hash("password123"),
        role="Member",
        status="Active",
        avatar_url="https://lh3.googleusercontent.com/aida-public/AB6AXuBjlb0jd7487nJvjhA4MGxO--TktNB5dKV-aFn4cyXHEK1tZ7J8fDTxO-ioFG5Kx6U8M6MGePlK9DvblpyFZM-hNVye0nliVax4hE1nM2BdNgDG2b_bYIhqJbfccuwg39rMJ-vkkTSV3OMEn0U1V8-WzBjitmG3kaeUfUwRvGTvT1HCIWrLzsMg6vNOutWl4Ay9E4FAJiNi2faDSetTS9bFCuKe27V81CFVKDrjRUxOQwmmQGOv0Wm3Ebu5cRu3qmVVqNdmwPpVQ0yX"
    )
    db.add(michael_chen)
    
    robert_wilson = models.User(
        email="rwilson@logistics.net",
        full_name="Robert Wilson",
        hashed_password=get_password_hash("password123"),
        role="Member",
        status="Active",
        avatar_url="https://lh3.googleusercontent.com/aida-public/AB6AXuCnJ_Tv_CcBkL_v1J6-gUCtLnJBQMegiZFPpON-dJOSQPZ5h72T8RBuRuNQoPiNo6n_HCXk76kaqnXvWD5w811p76GgwDjZsVsGx4RL3NHqPe--Ppr-vpNIBGzUYBUScFVasOpmKYqPY7JhUsv_y4LVnHOff1I1JBhUKt0eUjrmeIsBb4zjUqasxDs8TSFlU3h0j13caoOBPRM3l4-UkG90HBPZHl3fNlNZqlFkj2GSIz28eRBsEfH5y5P33sUpiyGBqnWhcujPudA5"
    )
    db.add(robert_wilson)
    db.commit()
    db.refresh(sarah_jenkins)
    db.refresh(michael_chen)
    db.refresh(robert_wilson)

    logs = [
        models.ActivityLog(
            user_id=sarah_jenkins.id,
            event_type="Subscription Upgrade",
            description="Upgraded to Enterprise Plan",
            amount=2400.00,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=1)
        ),
        models.ActivityLog(
            user_id=michael_chen.id,
            event_type="API Credits Purchase",
            description="Purchased 50k requests bundle",
            amount=450.00,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)
        ),
        models.ActivityLog(
            user_id=robert_wilson.id,
            event_type="Refund Request",
            description="Duplicate billing issue",
            amount=-120.00,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)
        ),
        models.ActivityLog(
            user_id=jordan.id,
            event_type="Project Updated",
            description="Pushed 4 commits to HyperScale Infrastructure",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=4)
        ),
        models.ActivityLog(
            user_id=sarah_c.id,
            event_type="Asset Created",
            description="Added new layout assets to Design System",
            created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=8)
        )
    ]
    
    for l in logs:
        db.add(l)
    
    db.commit()
    print("Database seeding completed successfully.")
    db.close()

if __name__ == "__main__":
    seed_db()
