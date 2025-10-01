from ..utils.db import get_db_connection

def create_memberships_table():
    conn, cur = get_db_connection()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS ClubMemberships(
            membership_id INTEGER PRIMARY KEY AUTOINCREMENT,
            reg_no CHAR(10) NOT NULL,
            club_id INTEGER NOT NULL,
            role VARCHAR(20) DEFAULT 'Member',
            status VARCHAR(20) DEFAULT 'pending',
            joined_at TEXT,
            FOREIGN KEY (reg_no) REFERENCES Users(reg_no),
            FOREIGN KEY (club_id) REFERENCES Clubs(club_id)
        )
    """)
    conn.commit()
    conn.close()

def add_membership(reg_no, club_id, role="Member"):
    conn, cur = get_db_connection()
    try:
        cur.execute("""
            INSERT INTO ClubMemberships (reg_no, club_id, role)
            VALUES (?, ?, ?)
        """, (reg_no, club_id, role))
        conn.commit()
        return True
    except Exception as e:
        print("Error adding membership:", e)
        return False
    finally:
        conn.close()

def get_joined_clubs_of_users(reg_no):
    conn, cur = get_db_connection()
    cur.execute("SELECT * FROM ClubMemberships WHERE reg_no = ? and status=?", (reg_no, 'approved'))
    joined_clubs = [dict(row) for row in cur.fetchall()]
    conn.close()
    return joined_clubs

def get_all_clubs_of_users(reg_no):
    conn, cur = get_db_connection()
    cur.execute("SELECT * FROM ClubMemberships WHERE reg_no = ?", (reg_no,))
    all_joined_clubs = [dict(row) for row in cur.fetchall()]
    conn.close()
    return all_joined_clubs

def get_approved_members_of_club(club_id):
    conn, cur = get_db_connection()
    cur.execute("SELECT * FROM ClubMemberships WHERE club_id = ? and status=?", (club_id, 'approved'))
    approved_members = [dict(row) for row in cur.fetchall()]
    conn.close()
    return approved_members

def update_membership_status(reg_no , club_id  ,status):
    if status not in ("pending", "approved", "rejected"):
        return False
    conn, cur = get_db_connection()
    cur.execute("UPDATE ClubMemberships SET status = ? WHERE reg_no = ? AND club_id = ?", (status, reg_no, club_id))
    conn.commit()
    conn.close()
    return True

def update_member_role(membership_id, role):
    print(role)
    if role not in ["Member", "Head"]:
        return False
    conn, cur = get_db_connection()
    try:
        cur.execute(
            "UPDATE ClubMemberships SET role=? WHERE membership_id=? AND status=?",
            (role, membership_id, "approved"),
        )
        conn.commit()
        rows_affected = cur.rowcount
    except Exception as e:
        print("DB Error:", e)
        rows_affected = 0
    finally:
        conn.close()

    return rows_affected > 0 
def get_member_role(reg_no ,  club_id):
    conn, cur = get_db_connection()
    cur.execute("SELECT role FROM ClubMemberships WHERE reg_no = ? and club_id = ? and status=?", (reg_no, club_id, 'approved'))
    role = cur.fetchone()
    conn.close()
    return role[0] if role else None

def get_clubs_headed_by_user(reg_no):
    """
    Returns all clubs where the user is the head.
    """
    conn, cur = get_db_connection()
    cur.execute("""
        SELECT c.*, cm.role, cm.status
        FROM Clubs c
        JOIN ClubMemberships cm ON c.club_id = cm.club_id
        WHERE cm.reg_no = ? AND cm.role = 'Head' AND cm.status = 'approved'
    """, (reg_no,))
    headed_clubs = [dict(row) for row in cur.fetchall()]
    conn.close()
    return headed_clubs
    