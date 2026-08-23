import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/scamcheck")
    
    # Auth
    SECRET_KEY = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-in-production")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # Risk score thresholds
    RISK_LOW_MAX = 29
    RISK_MEDIUM_MAX = 59
    RISK_HIGH_MAX = 79
    RISK_CRITICAL_MAX = 100
    
    # Max input length
    MAX_TEXT_LENGTH = 10000