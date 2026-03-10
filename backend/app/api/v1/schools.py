from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.schemas import VerifyRequest, SubscriptionsResponse
from app.crud import crud

router = APIRouter()

@router.get("/schools")
def get_schools_list(db: Session = Depends(get_db)):
    schools = crud.get_all_schools(db)
    return [school[0] for school in schools]

@router.post("/verify_school")
def verify_school(req: VerifyRequest, db: Session = Depends(get_db)):
    school = crud.verify_school(db, req)
    if school:
        return {"status": "ok"}
    raise HTTPException(status_code=401, detail="Невірний логін або пароль")

@router.get("/subscriptions", response_model=SubscriptionsResponse)
def get_subscriptions(school: str, db: Session = Depends(get_db)):
    db_school = crud.get_school_by_name(db, school)
    if db_school:
        return SubscriptionsResponse(
            basic=True,
            monitoring=db_school.sub_monitoring,
            security=db_school.sub_security,
            announcements=db_school.sub_announcements
        )
    raise HTTPException(status_code=404, detail="Школу не знайдено")
