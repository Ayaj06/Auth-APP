from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- Token Schemas ---
class TokenData(BaseModel):
    email: Optional[str] = None

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: Optional[str] = "Member"
    status: Optional[str] = "Active"
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None
    avatar_url: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# --- Project Schemas ---
class ProjectBase(BaseModel):
    title: str
    completion_percentage: int = 0

class ProjectCreate(ProjectBase):
    owner_id: int

class ProjectResponse(ProjectBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

# --- ActivityLog Schemas ---
class ActivityLogBase(BaseModel):
    event_type: str
    description: str
    amount: Optional[float] = None

class ActivityLogResponse(ActivityLogBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True

# --- Dashboard Stats Schemas ---
class RegionBreakdown(BaseModel):
    region: str
    name: str
    percentage: int

class DashboardStats(BaseModel):
    total_revenue: float
    revenue_growth_pct: float
    active_users: int
    active_users_growth_pct: float
    avg_session_duration: str
    avg_session_growth_pct: float
    new_signups: int
    new_signups_growth_pct: float
    recent_activities: List[ActivityLogResponse]
    top_project: Optional[ProjectResponse] = None
    top_project_team_count: int = 0
    region_usage: List[RegionBreakdown]
