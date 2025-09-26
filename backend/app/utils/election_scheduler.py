from apscheduler.schedulers.background import BackgroundScheduler
import atexit
from datetime import datetime, timedelta
from ..services.election_service import fetch_elections_by_status, update_election_status

def check_and_update_elections():
    now = datetime.utcnow()
    next_6h = now + timedelta(hours=6)

    
    upcoming_elections = fetch_elections_by_status("upcoming")

    for election in upcoming_elections:
        start_time = datetime.fromisoformat(election["start_time"])
        if now <= start_time <= next_6h:
            update_election_status(election["election_id"], "ongoing")
            print(f"Election {election['election_id']} moved to ongoing.")

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=check_and_update_elections, trigger="interval", hours=6)
    scheduler.start()

    # Shutdown scheduler on app exit
    atexit.register(lambda: scheduler.shutdown())
