from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("messi_rating_model.pkl")

MESSI_TEAM_MAP = {
    "Argentina": 0,
    "Barcelona": 1,
    "Inter Miami": 2,
    "Paris Saint-Germain": 3,
}

RESULT_MAP = {"W": 2, "D": 1, "L": 0}

class MatchInput(BaseModel):
    goals: int
    assists: int
    minutes_played: int
    shots: float
    shots_on_target: float
    free_kick_attempts: float
    successful_dribbles: float
    key_passes: float
    big_chances_created: float
    accurate_throughballs: float
    aerial_duels_won: float
    messi_team: str
    messi_team_score: int
    opponent_score: int
    age: float
    is_home: int
    shot_accuracy: float
    result: str
    competition_group_domestic_league: int
    competition_group_european: int
    competition_group_international: int
    competition_group_other: int

@app.post("/predict")
def predict(data: MatchInput):
    features = np.array([[
        data.goals,
        data.assists,
        data.minutes_played,
        data.shots,
        data.shots_on_target,
        data.free_kick_attempts,
        data.successful_dribbles,
        data.key_passes,
        data.big_chances_created,
        data.accurate_throughballs,
        data.aerial_duels_won,
        MESSI_TEAM_MAP.get(data.messi_team, 1),
        data.messi_team_score,
        data.opponent_score,
        data.age,
        data.is_home,
        data.shot_accuracy,
        RESULT_MAP.get(data.result, 1),
        data.competition_group_domestic_league,
        data.competition_group_european,
        data.competition_group_international,
        data.competition_group_other,
    ]])
    prediction = model.predict(features)[0]
    prediction = max(6.0, min(10.0, float(prediction)))
    return {"rating": round(float(prediction), 2)}
