from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Any
import datetime
from ..db import get_db
from .. import models, schemas
from ..deps import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
) -> Any:
    # 1. Total Revenue (sum of amounts in logs)
    total_rev = db.query(func.sum(models.ActivityLog.amount)).scalar()
    if total_rev is None:
        total_rev = 842500.0  # fallback mock baseline for demo if empty
        
    # 2. Active Users (count of users with status "Active")
    active_users = db.query(models.User).filter(models.User.status == "Active").count()
    if active_users == 0:
        active_users = 1284  # demo fallback
        
    # 3. New Signups (count of users registered in the last 30 days)
    thirty_days_ago = datetime.datetime.utcnow() - datetime.timedelta(days=30)
    new_signups = db.query(models.User).filter(models.User.created_at >= thirty_days_ago).count()
    if new_signups == 0:
        new_signups = 1204  # demo fallback

    # 4. Avg Session Duration
    avg_session_duration = "12m 45s"

    # 5. Top Project
    top_project = db.query(models.Project).order_by(models.Project.completion_percentage.desc()).first()
    if not top_project:
        # Create a mock top project if none exists (will be linked to current user or first admin)
        first_user = db.query(models.User).first()
        if first_user:
            top_project = models.Project(
                title="HyperScale Infrastructure",
                completion_percentage=88,
                owner_id=first_user.id
            )
            db.add(top_project)
            db.commit()
            db.refresh(top_project)

    # 6. Team Count on top project (dummy metric)
    team_count = 14

    # 7. Recent activities
    recent_activities = db.query(models.ActivityLog).order_by(models.ActivityLog.created_at.desc()).limit(10).all()
    # If empty, we can rely on seed data or just return the empty list

    # 8. Region Usage (static regions matching design)
    region_usage = [
        {"region": "NA", "name": "North America", "percentage": 42},
        {"region": "EU", "name": "Europe", "percentage": 31},
        {"region": "AS", "name": "Asia Pacific", "percentage": 27}
    ]

    return {
        "total_revenue": total_rev,
        "revenue_growth_pct": 12.5,
        "active_users": active_users,
        "active_users_growth_pct": 8.2,
        "avg_session_duration": avg_session_duration,
        "avg_session_growth_pct": -2.4,
        "new_signups": new_signups,
        "new_signups_growth_pct": 18.9,
        "recent_activities": recent_activities,
        "top_project": top_project,
        "top_project_team_count": team_count,
        "region_usage": region_usage
    }
