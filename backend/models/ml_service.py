import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import HistGradientBoostingClassifier
import joblib
import os

try:
    import xgboost as xgb
except Exception:
    xgb = None

class MLService:
    def __init__(self):
        self.budget_model_path = 'models/budget_model.joblib'
        self.itinerary_model_path = 'models/itinerary_model.joblib'
        self.budget_model = None
        self.itinerary_model = None
        self._load_models()

    def _load_models(self):
        if os.path.exists(self.budget_model_path):
            self.budget_model = joblib.load(self.budget_model_path)
        else:
            self._train_dummy_budget_model()

        if os.path.exists(self.itinerary_model_path):
            self.itinerary_model = joblib.load(self.itinerary_model_path)
        else:
            self._train_dummy_itinerary_model()

    def _train_dummy_budget_model(self):
        # Dummy training data: [days, persons, comfort_level(1-3)]
        X = np.array([[1, 1, 1], [3, 2, 2], [5, 1, 3], [7, 4, 2], [10, 2, 3]])
        y = np.array([2000, 15000, 25000, 40000, 60000])
        model = LinearRegression()
        model.fit(X, y)
        os.makedirs('models', exist_ok=True)
        joblib.dump(model, self.budget_model_path)
        self.budget_model = model

    def _train_dummy_itinerary_model(self):
        X = np.array([[10, 0.8, 1], [5, 0.5, 2], [15, 0.9, 1], [2, 0.2, 3]])
        y = np.array([0, 1, 0, 1])
        model = xgb.XGBClassifier() if xgb is not None else HistGradientBoostingClassifier()
        model.fit(X, y)
        os.makedirs('models', exist_ok=True)
        joblib.dump(model, self.itinerary_model_path)
        self.itinerary_model = model

    def predict_budget(self, days, persons, comfort_level):
        if not self.budget_model:
            return 10000
        prediction = self.budget_model.predict([[days, persons, comfort_level]])
        return float(prediction[0])

    def recommend_itinerary(self, history_count, preference_score, season):
        if not self.itinerary_model:
            return "General Tamil Nadu Tour"
        prediction = self.itinerary_model.predict([[history_count, preference_score, season]])
        return "Cultural Heritage Tour" if prediction[0] == 0 else "Nature & Hill Station Tour"

ml_service = MLService()
