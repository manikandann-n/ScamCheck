from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import analyze, history, health, auth
from .database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ScamCheck API", description="Student opportunity verification platform")
allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://your-frontend.vercel.app",  # Add your Vercel URL
    "https://scamcheck-2-xqh3.onrender.com",  # Backend itself
]
# ✅ CORS Configuration
app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://your-frontend.vercel.app",  # Add your Vercel URL
    "https://scamcheck-2-xqh3.onrender.com",  # Backend itself
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your routes
app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(analyze.router, prefix="/api")
app.include_router(history.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "ScamCheck API", "version": "1.0.0"}
