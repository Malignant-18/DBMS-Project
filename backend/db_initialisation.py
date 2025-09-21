# import sqlite3
# import os
# script_dir = os.path.dirname(os.path.abspath(__file__))
# db_path = os.path.join(script_dir, "Voting_System.db")
# mycon = sqlite3.connect(db_path)
# mycur=mycon.cursor()
# mycur.execute("CREATE TABLE IF NOT EXISTS Users(reg_no char(10)  primary key,password text not null,name varchar(25) not null)")
# mycon.commit()
# mycon.close()
from app.models.user_model import create_user_table
from app.models.club_model import create_clubs_table
from app.models.member_model import create_memberships_table

if __name__ == "__main__":
    create_user_table()
    create_clubs_table()
    create_memberships_table()
    print("Database initialized successfully.")
