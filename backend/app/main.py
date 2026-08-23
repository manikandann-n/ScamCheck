from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import analyze, history, health, auth
from .database import engine, Base
import os

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI
app = FastAPI(
    title="ScamCheck API",
    description="Student opportunity verification platform",
    version="1.0.0"
)

# ---- CORS Configuration ----
# Allow your frontend (Vercel) and backend (Render) plus local dev
allow_origins = [
    "https://scamcheck.vercel.app",           # Your Vercel frontend
    "https://scamcheck-2-xqh3.onrender.com",  # Your Render backend
    "http://localhost:5173",                  # Local development
    "http://127.0.0.1:5173",                  # Local development alternative
    "http://localhost:3000",                  # Alternative local port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Routes ----
app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(analyze.router, prefix="/api")
app.include_router(history.router, prefix="/api")

# ---- Root Endpoint ----
@app.get("/")
async def root():
    return {
        "message": "ScamCheck API",
        "version": "1.0.0",
        "status": "online"
    }

# ---- Optional: Health check at root ----
# (The health router already provides /api/health)