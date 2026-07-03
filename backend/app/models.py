import datetime

def utcnow():
    return datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)

# pyrefly: ignore [missing-import]
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import relationship
from .db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="Member")  # Super Admin, Admin, Editor, Viewer, Security Officer, Member
    status = Column(String, default="Active")  # Active, Inactive, Suspended
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)
    last_login = Column(DateTime, nullable=True)

    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")
    activities = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    completion_percentage = Column(Integer, default=0)
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    owner = relationship("User", back_populates="projects")

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    event_type = Column(String, nullable=False)  # e.g., "Subscription Upgrade", "API Credits Purchase", "Refund Request"
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=True)
    created_at = Column(DateTime, default=utcnow)

    user = relationship("User", back_populates="activities")
