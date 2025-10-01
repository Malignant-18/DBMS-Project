from ..utils.db import get_db_connection

def get_all_positions():
    """Get all available positions"""
    conn, cur = get_db_connection()
    try:
        cur.execute("SELECT position_id, position_name FROM Positions ORDER BY position_name")
        positions = [dict(row) for row in cur.fetchall()]
        return positions
    except Exception as e:
        print("Error fetching positions:", e)
        return []
    finally:
        conn.close()

def get_position_by_id(position_id):
    """Get a specific position by ID"""
    conn, cur = get_db_connection()
    try:
        cur.execute("SELECT position_id, position_name FROM Positions WHERE position_id = ?", (position_id,))
        position = cur.fetchone()
        return dict(position) if position else None
    except Exception as e:
        print("Error fetching position:", e)
        return None
    finally:
        conn.close()