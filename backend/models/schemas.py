from pydantic import BaseModel, Field
from typing import Optional

class SessionStart(BaseModel):
    session_id: str
    timestamp: str

class SessionEnd(BaseModel):
    session_id: str
    duration_seconds: int = 0
    timestamp: str

class Transcript(BaseModel):
    session_id: str
    text: str
    timestamp: str
    is_final: bool = True

class Metrics(BaseModel):
    session_id: str
    word_count: int = 0
    entry_count: int = 0
    timestamp: str
