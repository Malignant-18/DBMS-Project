import sqlite3
import os

DB_NAME = "Voting_System.db"
# Database is in the backend folder, utils is at backend/app/utils, so go up 2 levels
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../..", DB_NAME)

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn, conn.cursor()
