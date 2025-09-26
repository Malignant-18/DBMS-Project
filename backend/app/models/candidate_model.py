from ..utils.db import get_db_connection

def create_votes_table():
    conn, cur = get_db_connection()
    cur.execute("""CREATE TABLE Candidates (
    candidate_id INTEGER PRIMARY KEY AUTOINCREMENT,
    election_id INTEGER NOT NULL,
    reg_no CHAR(10) NOT NULL,
    manifesto TEXT,
    total_votes INTEGER DEFAULT 0,
    FOREIGN KEY (election_id) REFERENCES Elections(election_id) ON DELETE CASCADE,   
    FOREIGN KEY (reg_no) REFERENCES Users(reg_no) ON DELETE CASCADE,
    UNIQUE (election_id, reg_no)
    )""")
    conn.commit()
    conn.close()

'''def add_candidate(elecion_id,reg_no):
    conn, cur = get_db_connection()
    try:
        cur.execute("""
            INSERT INTO Candidates (election_id,reg_no)
            VALUES (?, ?)
        """, (elecion_id,reg_no))
        conn.commit()
        return True
    except Exception as e:
        print("Error adding candidates:", e)
        return False
    finally:
        conn.close()'''

def increase_vote(candidate_id):
    conn, cur = get_db_connection()
    cur.execute("UPDATE Candidates SET total_votes=total_votes+1 where candidate_id=?",(candidate_id))
    conn.commit()
    return True  
