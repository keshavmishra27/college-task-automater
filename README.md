# CampusAI Platform

CampusAI is a modern, intelligent, and responsive platform for college task automation. It features a FastAPI backend and a React (Vite + TypeScript) frontend.

## Getting Started

To run the application, you need to start both the backend and the frontend servers.

### Prerequisites

- Python 3.10+
- Node.js & npm
- OpenRouter API Key (configured in `backend/.env`)

### Easy Start (Windows)

You can use the provided batch files in the root directory:

1. Double-click `start_backend.bat` to launch the FastAPI server.
2. Double-click `start_frontend.bat` to launch the React development server.

### Manual Start

#### Backend
```bash
# From the root directory
python backend/main.py
```
The backend will be available at `http://127.0.0.1:8000`.

#### Frontend
```bash
# Navigate to frontend directory
cd frontend
# Install dependencies (first time only)
npm install
# Start dev server
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## Features

- **Medical Room Management**: Track and manage student medical records with AI insights.
- **Stationery Store**: Inventory management with demand forecasting.
- **AI Voice Agent**: Multilingual announcements and voice commands.
- **Smart Parking**: Parking slot detection and status tracking.