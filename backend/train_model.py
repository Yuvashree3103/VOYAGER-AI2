from models.xgboost_model import xgboost_planner

if __name__ == "__main__":
    print("🚀 Training XGBoost model with Chennai dataset...")
    xgboost_planner.train()
    print("✅ Model training complete!")