from app.utils.db import get_db_connection
from datetime import datetime

def add_sample_clubs():
    conn, cur = get_db_connection()
    
    # Create table if it doesn't exist
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Clubs(
            club_id INTEGER PRIMARY KEY AUTOINCREMENT,
            club_name VARCHAR(50) NOT NULL,
            description TEXT,
            created_at TEXT,
            member_count INTEGER DEFAULT 0
        )
    """)
    
    # Check if clubs already exist
    cur.execute("SELECT COUNT(*) FROM Clubs")
    count = cur.fetchone()[0]
    
    if count == 0:
        # Add sample clubs
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        sample_clubs = [
            ("Tech Club", "A club for technology enthusiasts and developers", now, 25),
            ("Cultural Committee", "Organizing cultural events and festivals", now, 40),
            ("Sports Club", "For sports and fitness activities", now, 30),
            ("Photography Club", "Capturing moments and learning photography", now, 15),
            ("Music Club", "For music lovers and performers", now, 20),
            ("Drama Club", "Theater and drama performances", now, 18),
            ("Environmental Club", "Promoting environmental awareness", now, 22),
            ("Literature Club", "Book discussions and writing workshops", now, 12)
        ]
        
        cur.executemany(
            "INSERT INTO Clubs (club_name, description, created_at, member_count) VALUES (?, ?, ?, ?)",
            sample_clubs
        )
        
        print(f"Added {len(sample_clubs)} sample clubs to the database")
    else:
        print(f"Clubs table already has {count} clubs")
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    add_sample_clubs()
    print("Sample clubs added successfully!")