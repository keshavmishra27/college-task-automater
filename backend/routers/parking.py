from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.parking import ParkingRecord
from schemas import ParkingRecordCreate, ParkingRecordUpdate, ParkingRecordOut
from services.analytics import get_parking_analytics
from services.llm import get_parking_insights
from datetime import datetime

router = APIRouter(prefix="/api/parking", tags=["Parking"])

@router.get("/", response_model=List[ParkingRecordOut])
def read_parking_records(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    records = db.query(ParkingRecord).offset(skip).limit(limit).all()
    return records

@router.post("/", response_model=ParkingRecordOut)
def create_parking_record(record: ParkingRecordCreate, db: Session = Depends(get_db)):
    db_record = ParkingRecord(**record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@router.put("/{record_id}", response_model=ParkingRecordOut)
def update_parking_record(record_id: int, record: ParkingRecordUpdate, db: Session = Depends(get_db)):
    db_record = db.query(ParkingRecord).filter(ParkingRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    update_data = record.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_record, key, value)
    
    db.commit()
    db.refresh(db_record)
    return db_record

@router.get("/analytics")
async def get_parking_dashboard(db: Session = Depends(get_db)):
    stats = get_parking_analytics(db)
    insights = await get_parking_insights(stats)
    return {"stats": stats, "insights": insights}

@router.post("/detect")
async def detect_parking_slots(image: UploadFile = File(...)):
    # Simulated CV detection
    return {
        "slots": [
            {"id": 1, "status": "occupied", "car_number": "MH12-AB-1234"},
            {"id": 2, "status": "free", "car_number": None},
            {"id": 3, "status": "occupied", "car_number": "MH12-XY-5678"},
            {"id": 4, "status": "free", "car_number": None},
        ]
    }
