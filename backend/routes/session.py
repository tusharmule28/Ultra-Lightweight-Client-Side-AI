from fastapi import APIRouter, HTTPException
from models.schemas import SessionStart, SessionEnd
from services.storage import create_session, end_session

router = APIRouter()

@router.post("/start")
async def start(req: SessionStart):
    s = create_session(req.session_id, req.timestamp)
    return {"status": "ok", "id": req.session_id, "data": s}

@router.post("/end")
async def end(req: SessionEnd):
    s = end_session(req.session_id, req.duration_seconds, req.timestamp)
    if not s:
        raise HTTPException(status_code=404, detail="session not found")
    return {"status": "ok", "id": req.session_id, "data": s}
