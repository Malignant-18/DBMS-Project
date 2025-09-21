import sqlite3
import os

DB_NAME = "Voting_System.db"
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../", DB_NAME)

def get_db_connection():
    print(DB_PATH)
    print(DB_NAME)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn, conn.cursor()
