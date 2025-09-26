from ..utils.db import get_db_connection
from datetime import datetime

def create_votes_table():
    conn, cur = get_db_connection()
    cur.execute("""CREATE TABLE IF NOT EXISTS 
    Votes (
    vote_id INTEGER PRIMARY KEY AUTOINCREMENT,
    reg_no TEXT NOT NULL,
    election_id INTEGER NOT NULL,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (reg_no, election_id),
    FOREIGN KEY (reg_no) REFERENCES Users(reg_no) ON DELETE CASCADE,
    FOREIGN KEY (election_id) REFERENCES Elections(election_id) ON DELETE CASCADE)
    """)
    conn.commit()
    conn.close()

def add_vote_record(reg_no, election_id):
    conn, cur = get_db_connection()
    try:
        cur.execute("INSERT INTO Votes (reg_no, election_id,voted_at) VALUES (?, ?)",
                    (reg_no,election_id))
        conn.commit()
        return True
    except Exception as e:
        print("error in recording vote:",e)
        return False
    finally:
        conn.close()

'''already vote cheythittundo ennariyan reg_no and election_id vech check cheyyum.
    ith true aanel aa electionu ee userinte button disable aayi irikkanam.
    false aaanel vote button active aayitt irikkanam'''
def check_vote(reg_no, election_id):
    conn, cur = get_db_connection()
    cur.execute("SELECT EXISTS(SELECT 1 FROM Votes WHERE reg_no = ? AND election_id = ?)", (reg_no,election_id))
    exists=cur.fetchone()[0]
    if exists:
        return True
    return False

