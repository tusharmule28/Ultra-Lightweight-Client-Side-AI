from typing import Dict, Any, List

# In-memory storage for active sessions
# Structure:
# {
#   "session_id": {
#     "status": "active" | "completed",
#     "start_time": "...",
#     "end_time": "...",
#     "duration_seconds": 0,
#     "transcripts": [
#        { "text": "...", "timestamp": "...", "is_final": True }
#     ],
#     "metrics": {
#        "word_count": 0,
#        "entry_count": 0,
#        "last_updated": "..."
#     }
#   }
# }
db: Dict[str, Any] = {}

def create_session(session_id: str, timestamp: str):
    if session_id not in db:
        db[session_id] = {
            "status": "active",
            "start_time": timestamp,
            "end_time": None,
            "duration_seconds": 0,
            "transcripts": [],
            "metrics": {
                "word_count": 0,
                "entry_count": 0,
                "last_updated": timestamp
            }
        }
    return db[session_id]

def end_session(session_id: str, duration: int, timestamp: str):
    if session_id in db:
        db[session_id]["status"] = "completed"
        db[session_id]["end_time"] = timestamp
        db[session_id]["duration_seconds"] = duration
        return db[session_id]
    return None

def append_transcript(session_id: str, text: str, timestamp: str, is_final: bool):
    if session_id in db:
        entry = {
            "text": text,
            "timestamp": timestamp,
            "is_final": is_final
        }
        db[session_id]["transcripts"].append(entry)
        return entry
    return None

def update_metrics(session_id: str, word_count: int, entry_count: int, timestamp: str):
    if session_id in db:
        db[session_id]["metrics"].update({
            "word_count": word_count,
            "entry_count": entry_count,
            "last_updated": timestamp
        })
        return db[session_id]["metrics"]
    return None

def get_session(session_id: str):
    return db.get(session_id)
