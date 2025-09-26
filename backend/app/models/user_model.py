from ..utils.db import get_db_connection
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

def create_user_table():
    conn, cur = get_db_connection()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Users(
            reg_no CHAR(10) PRIMARY KEY,
            password TEXT NOT NULL,
            name VARCHAR(25) NOT NULL,
            created_at TEXT
        )
    """)
    conn.commit()
    conn.close()

def add_user(reg_no, password, name):
    conn, cur = get_db_connection()
    hashed_pw = generate_password_hash(password)
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    cur.execute("INSERT INTO Users (reg_no, password, name, created_at) VALUES (?, ?, ?, ?)",
                (reg_no, hashed_pw, name, now))
    conn.commit()
    conn.close()

def get_user_by_reg_no(reg_no):
    conn, cur = get_db_connection()
    cur.execute("SELECT * FROM Users WHERE reg_no=?", (reg_no,))
    user = cur.fetchone()
    conn.close()
    return user

def verify_password(user, password):
    return check_password_hash(user[1], password)
