from ..utils.db import get_db_connection


def get_all_clubs():
    conn, cur = get_db_connection()
    cur.execute("SELECT * FROM Clubs")
    clubs = [dict(row) for row in cur.fetchall()]
    conn.close()
    return clubs
    

