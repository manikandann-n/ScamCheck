from fastapi import APIRouter
from ..scam_alerts import ScamAlertSystem

router = APIRouter()
alert_system = ScamAlertSystem()

@router.get("/alerts")
async def get_alerts(limit: int = 10):
    return alert_system.get_alerts(limit)

@router.get("/alerts/search/{query}")
async def search_alerts(query: str):
    return alert_system.search_alerts(query)