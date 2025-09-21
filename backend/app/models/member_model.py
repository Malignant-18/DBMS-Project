from ..utils.db import get_db_connection

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
    cur.execute("SELECT * FROM ClubMemberships WHERE reg_no = ? and status=?", (reg_no, 'approved'))
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

def update_membership_role(membership_id, role):
    if role not in ("Member", "Head"):
        return False
    conn, cur = get_db_connection()
    cur.execute("UPDATE ClubMemberships SET role=? WHERE membership_id=?", (role, membership_id))
    conn.commit()
    conn.close()
    return True