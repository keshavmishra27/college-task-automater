from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import medical, stationery, announcements, parking
import os
from datetime import datetime

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CampusAI API", version="1.0.0")

# Logging Middleware
@app.middleware("http")
async def log_requests(request, call_next):
    print(f"DEBUG: {request.method} {request.url}")
    response = await call_next(request)
    print(f"DEBUG: Response status: {response.status_code}")
    return response

# CORS - Robust regex to allow any localhost/127.0.0.1 origin on any port
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check
@app.get("/api/health")
def health_check():
    try:
        return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# Routes
app.include_router(medical.router)
app.include_router(stationery.router)
app.include_router(announcements.router)
app.include_router(parking.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to CampusAI API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
