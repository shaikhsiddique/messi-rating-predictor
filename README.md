# Messi Rating Predictor

ML-powered app to predict Messi's match rating from in-game stats.

## Setup

### 1. Add your model
Copy `messi_rating_model.pkl` into the `backend/` folder.

### 2. Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend runs on http://localhost:8000

### 3. Frontend (React)
```bash
cd frontend
npm install
npm start
```
Frontend runs on http://localhost:3000

## Tech Stack
- Frontend: React + Tailwind CSS
- Backend: FastAPI + Python
- Model: XGBoost (R² = 0.88, MAE = 0.30)
- Data: 758 Messi career matches
