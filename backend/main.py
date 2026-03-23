from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import medical, stationery, announcements, parking
import os

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CampusAI API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
