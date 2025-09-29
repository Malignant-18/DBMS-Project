from ..utils.db import get_db_connection


def create_candidate(election_id, reg_no, manifesto=None):
    conn, cur = get_db_connection()
    try:
        cur.execute("""
            INSERT INTO Candidates (election_id, reg_no, manifesto)
            VALUES (?, ?, ?)
        """, (election_id, reg_no, manifesto))
        conn.commit()
        return True
    except Exception as e:
        print("Error creating candidate:", e)
        return False
    finally:
        conn.close()


def get_candidates_by_election(election_id):
    conn, cur = get_db_connection()
    cur.execute("""
        SELECT
            c.candidate_id,
            c.election_id,
            u.reg_no,
            u.name AS candidate_name,
            c.manifesto,
            c.total_votes
        FROM Candidates c
        JOIN Users u ON c.reg_no = u.reg_no
        WHERE c.election_id = ?
        ORDER BY c.total_votes DESC
    """, (election_id,))
    candidates = [dict(row) for row in cur.fetchall()]
    conn.close()
    return candidates


def get_candidate_by_candidate_id(candidate_id):
    conn, cur = get_db_connection()
    cur.execute("""
        SELECT
            c.candidate_id,
            c.election_id,
            u.reg_no,
            u.name AS candidate_name,
            c.manifesto,
            c.total_votes
        FROM Candidates c
        JOIN Users u ON c.reg_no = u.reg_no
        WHERE c.candidate_id = ?
    """, (candidate_id,))
    candidate = cur.fetchone()
    conn.close()
    return dict(candidate) if candidate else None

def get_single_candidate(election_id , reg_no):
    conn, cur = get_db_connection()
    cur.execute("""
        SELECT
            c.candidate_id,
            c.election_id,
            u.reg_no,
            u.name AS candidate_name,
            c.manifesto,
            c.total_votes
        FROM Candidates c
        JOIN Users u ON c.reg_no = u.reg_no
        WHERE c.election_id = ? AND c.reg_no = ?
    """, (election_id , reg_no))
    candidate = cur.fetchone()
    conn.close()
    return dict(candidate) if candidate else None

def increment_vote(candidate_id):
    conn, cur = get_db_connection()
    cur.execute("UPDATE Candidates SET total_votes=total_votes+1 WHERE candidate_id=?", (candidate_id,))
    conn.commit()
    return True

def delete_candidate(candidate_id):
    conn, cur = get_db_connection()
    cur.execute("DELETE FROM Candidates WHERE candidate_id = ?", (candidate_id,))
    conn.commit()
    conn.close()
    return True

