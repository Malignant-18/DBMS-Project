from ..utils.db import get_db_connection


def get_all_clubs():
    conn, cur = get_db_connection()
    cur.execute("SELECT * FROM Clubs")
    clubs = [dict(row) for row in cur.fetchall()]
    conn.close()
    return clubs
    
def get_single_club(club_id):
    conn, cur = get_db_connection()
    cur.execute("SELECT * FROM Clubs where club_id=?",(club_id,))
    club = cur.fetchone()
    conn.close()
    return dict(club)
