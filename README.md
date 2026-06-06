# Ultra-Lightweight Client-Side AI

A privacy focused, browser-based interview assistant that uses client-side machine learning for real-time transcription, summarization, and feedback.

## Features

- Client-Side Inference: Uses ONNX Runtime Web to run models directly in the browser.
- Real-Time Summarization: Generates extractive summaries of the conversation using MiniLM.
- Speech Analysis: Detects filler phrases and provides instant audio feedback.
- Privacy First: All AI processing happens on the user's device.
- Minimal Backend: FastAPI used only for session management and data persistence.

## Tech Stack

- Frontend: React, Tailwind CSS, Vite
- AI Engine: ONNX Runtime Web, Web Workers
- Browser APIs: Web Speech API (STT & TTS)
- Backend: FastAPI, Python

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)

### Installation of project

1. Clone the repository:
   ```bash
   git clone https://github.com/tusharmule28/Ultra-Lightweight-Client-Side-AI.git
   ```

2. Frontend Setup:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Backend Setup:
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```


