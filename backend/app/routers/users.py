from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Any, List, Optional
from ..db import get_db
from .. import models, schemas
from ..deps import get_current_user
from ..auth_utils import get_password_hash
from pydantic import BaseModel

router = APIRouter(prefix="/api/users", tags=["users"])

def verify_admin(current_user: models.User = Depends(get_current_user)):
    if current_user.role not in ["Super Admin", "Admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to manage users"
        )
    return current_user

class UserListResponse(BaseModel):
    users: List[schemas.UserResponse]
    total: int

@router.get("", response_model=UserListResponse)
def get_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
    q: Optional[str] = Query(None, description="Search by name or email"),
    role: Optional[str] = Query(None, description="Filter by role"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100)
) -> Any:
    query = db.query(models.User)
    
    if q:
        search_filter = or_(
            models.User.full_name.ilike(f"%{q}%"),
            models.User.email.ilike(f"%{q}%")
        )
        query = query.filter(search_filter)
        
    if role:
        query = query.filter(models.User.role == role)
        
    if status_filter:
        query = query.filter(models.User.status == status_filter)
        
    total = query.count()
    
    offset = (page - 1) * limit
    users = query.order_by(models.User.created_at.desc()).offset(offset).limit(limit).all()
    
    return {
        "users": users,
        "total": total
    }

@router.post("", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: schemas.UserCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(verify_admin)
) -> Any:
    # Check duplicate
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )
    
    new_user = models.User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        role=user_in.role or "Member",
        status=user_in.status or "Active",
        avatar_url=user_in.avatar_url
    )
    db.add(new_user)
    
    # Log the event
    log = models.ActivityLog(
        user_id=admin.id,
        event_type="User Created",
        description=f"Admin {admin.full_name} created user {user_in.full_name} ({user_in.email})"
    )
    db.add(log)
    
    db.commit()
    db.refresh(new_user)
    return new_user

@router.put("/{user_id}", response_model=schemas.UserResponse)
def update_user(
    user_id: int,
    user_in: schemas.UserUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(verify_admin)
) -> Any:
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    # Prevent self-suspension or self-role-demotion
    if user.id == admin.id:
        if user_in.status and user_in.status != "Active":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot suspend or deactivate your own account"
            )
        if user_in.role and user_in.role != user.role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot change your own role"
            )

    # Perform updates
    if user_in.email is not None:
        # Check if email taken
        dup = db.query(models.User).filter(models.User.email == user_in.email, models.User.id != user_id).first()
        if dup:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already in use by another account"
            )
        user.email = user_in.email
        
    if user_in.full_name is not None:
        user.full_name = user_in.full_name
        
    if user_in.role is not None:
        user.role = user_in.role
        
    if user_in.status is not None:
        user.status = user_in.status
        
    if user_in.avatar_url is not None:
        user.avatar_url = user_in.avatar_url
        
    if user_in.password is not None and user_in.password != "":
        user.hashed_password = get_password_hash(user_in.password)
        
    db.commit()
    db.refresh(user)
    
    # Log event
    log = models.ActivityLog(
        user_id=admin.id,
        event_type="User Updated",
        description=f"Admin {admin.full_name} updated user {user.full_name} ({user.email})"
    )
    db.add(log)
    db.commit()
    
    return user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(verify_admin)
) -> None:
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    if user.id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete your own account"
        )
        
    db.delete(user)
    
    # Log event
    log = models.ActivityLog(
        user_id=admin.id,
        event_type="User Deleted",
        description=f"Admin {admin.full_name} deleted user {user.full_name} ({user.email})"
    )
    db.add(log)
    db.commit()
    return None
