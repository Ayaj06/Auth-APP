from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import engine
from . import models
from .routers import auth, users, dashboard

# Create tables in the PostgreSQL/SQLite database
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SaaSPro User Management Dashboard API",
    description="Backend API services supporting auth, user management, and system dashboard statistics",
    version="1.0.0"
)

# CORS middleware configuration for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for specific domains in production (e.g., http://localhost:5173)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(dashboard.router)

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "message": "SaaSPro Enterprise Admin Dashboard API is running"
    }
