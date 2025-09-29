from ..utils.db import get_db_connection

def create_election (club_id , position_id , reg_no , start_time, end_time):
    conn, cur = get_db_connection()
    try:
        cur.execute("""
            INSERT INTO Elections (club_id , position_id , created_by , start_time, end_time)
            VALUES (?, ?, ?, ?, ?)
        """, (club_id , position_id , reg_no , start_time, end_time))
        conn.commit()
        return True
    except Exception as e:
        print("Error creating election:", e)
        return False
    finally:
        conn.close()

from ..utils.db import get_db_connection

def get_all_elections():
    conn, cur = get_db_connection()
    cur.execute("""
        SELECT
            e.election_id,
            c.club_id,
            c.name,
            p.position_id,
            p.position_name,
            e.created_by,
            u.name AS created_by_name,
            e.start_time,
            e.end_time,
            e.status,
            e.result_declared,
            e.created_at
        FROM Elections e
        JOIN Clubs c ON e.club_id = c.club_id
        JOIN Positions p ON e.position_id = p.position_id
        JOIN Users u ON e.created_by = u.reg_no
        ORDER BY e.start_time DESC
    """)
    elections = [dict(row) for row in cur.fetchall()]
    conn.close()
    return elections

def get_elections_by_status(status):
    if status not in ("upcoming", "ongoing", "completed"):
        return []
    conn, cur = get_db_connection()
    cur.execute("""
        SELECT
            e.election_id,
            c.club_id,
            c.name,
            p.position_id,
            p.position_name,
            e.created_by,
            u.name AS created_by_name,
            e.start_time,
            e.end_time,
            e.status,
            e.result_declared,
            e.created_at
        FROM Elections e
        JOIN Clubs c ON e.club_id = c.club_id
        JOIN Positions p ON e.position_id = p.position_id
        JOIN Users u ON e.created_by = u.reg_no
        WHERE e.status = ?
        ORDER BY e.start_time DESC
    """, (status,))
    elections = [dict(row) for row in cur.fetchall()]
    conn.close()
    return elections

def get_election_by_id(election_id):
    conn, cur = get_db_connection()
    cur.execute("""
        SELECT
            e.election_id,
            c.club_id,
            c.name,
            p.position_id,
            p.position_name,
            e.created_by,
            u.name AS created_by_name,
            e.start_time,
            e.end_time,
            e.status,
            e.result_declared,
            e.created_at
        FROM Elections e
        JOIN Clubs c ON e.club_id = c.club_id
        JOIN Positions p ON e.position_id = p.position_id
        JOIN Users u ON e.created_by = u.reg_no
        WHERE e.election_id = ?
    """, (election_id,))
    election = cur.fetchone()
    conn.close()
    return dict(election) if election else None

def delete_election(election_id):
    conn, cur = get_db_connection()
    cur.execute("DELETE FROM Elections WHERE election_id = ?", (election_id,))
    conn.commit()
    conn.close()
    return True

def get_elections_by_club(club_id):
    conn, cur = get_db_connection()
    cur.execute("""
        SELECT e.*, p.position_name, u.name as created_by_name
        FROM Elections e
        JOIN Positions p ON e.position_id = p.position_id
        JOIN Users u ON e.created_by = u.reg_no
        WHERE e.club_id = ?
        ORDER BY e.start_time DESC
    """, (club_id,))
    elections = [dict(row) for row in cur.fetchall()]
    conn.close()
    return elections

def update_election_status(election_id, status):
    if status not in ("upcoming", "ongoing", "completed"):
        return False
    conn, cur = get_db_connection()
    cur.execute("""
        UPDATE Elections
        SET status = ?
        WHERE election_id = ?
    """, (status, election_id))
    conn.commit()
    conn.close()
    return True


def get_club_id_of_election(election_id):
    conn, cur = get_db_connection()
    cur.execute("SELECT club_id FROM Elections WHERE election_id = ?", (election_id,))
    row = cur.fetchone()
    conn.close()
    return row["club_id"] if row else None