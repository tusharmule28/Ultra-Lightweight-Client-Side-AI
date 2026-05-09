from fastapi import APIRouter, HTTPException
from models.schemas import Transcript, Metrics
from services.storage import append_transcript, update_metrics

router = APIRouter()

@router.post("/transcript")
async def log_transcript(req: Transcript):
    t = append_transcript(req.session_id, req.text, req.timestamp, req.is_final)
    if not t:
        raise HTTPException(status_code=404, detail="session not found")
    return {"status": "ok", "id": req.session_id}

@router.post("/metrics")
async def log_metrics(req: Metrics):
    m = update_metrics(req.session_id, req.word_count, req.entry_count, req.timestamp)
    if not m:
        raise HTTPException(status_code=404, detail="session not found")
    return {"status": "ok", "id": req.session_id}
