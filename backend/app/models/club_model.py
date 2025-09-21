from ..utils.db import get_db_connection

def create_clubs_table():
    conn, cur = get_db_connection()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Clubs(
            club_id INTEGER PRIMARY KEY AUTOINCREMENT,
            club_name VARCHAR(50) NOT NULL,
            description TEXT,
            created_at TEXT,
            member_count INTEGER DEFAULT 0
        )
    """)
    conn.commit()
    conn.close()

def get_all_clubs():
    try:
        conn, cur = get_db_connection()
        cur.execute("SELECT * FROM Clubs")
        clubs = [dict(row) for row in cur.fetchall()]
        conn.close()
        return clubs
    except Exception as e:
        print(f"Error fetching clubs: {e}")
        # Return empty list if table doesn't exist or other error
        return []
    
def get_single_club(club_id):
    try:
        conn, cur = get_db_connection()
        cur.execute("SELECT * FROM Clubs where club_id=?",(club_id,))
        club = cur.fetchone()
        conn.close()
        if club:
            return dict(club)
        else:
            return None
    except Exception as e:
        print(f"Error fetching club {club_id}: {e}")
        return None
