# app/utils/election_scheduler.py
from apscheduler.schedulers.background import BackgroundScheduler
import atexit
from datetime import datetime, timedelta
from ..services.election_service import fetch_elections_by_status, update_election_status

scheduler = None  # global scheduler

def check_and_update_elections():
    now = datetime.utcnow()

    # --- Upcoming → Ongoing ---
    upcoming_elections = fetch_elections_by_status("upcoming")
    for election in upcoming_elections:
        start_time = datetime.fromisoformat(election["start_time"])
        if now >= start_time:
            update_election_status(election["election_id"], "ongoing")
            print(f"Election {election['election_id']} moved to ongoing.")

    # --- Ongoing → Completed ---
    ongoing_elections = fetch_elections_by_status("ongoing")
    for election in ongoing_elections:
        end_time = datetime.fromisoformat(election["end_time"])
        if now >= end_time:
            update_election_status(election["election_id"], "completed")
            print(f"Election {election['election_id']} moved to completed.")

def start_scheduler():
    global scheduler
    if scheduler is None:  # only start once
        scheduler = BackgroundScheduler()
        scheduler.add_job(func=check_and_update_elections, trigger="interval", minutes=10)
        scheduler.start()
        print("Election scheduler started ✅")

        # Shutdown scheduler on app exit
        atexit.register(lambda: scheduler.shutdown())
