from flask import Flask, request, jsonify,session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import sqlite3
from datetime import datetime
app = Flask(__name__)
app.secret_key = "secret_key"
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = False 
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}}, supports_credentials=True, allow_headers=["Content-Type"])

def get_db_connection():
    mycon=sqlite3.connect("Voting_System.db")
    mycon.row_factory=sqlite3.Row
    mycon.execute("PRAGMA foreign_keys = ON")
    return mycon, mycon.cursor()

@app.route("/register", methods=["POST","OPTIONS"])
def register():
    if request.method == "OPTIONS":
        return "", 200  
    data = request.get_json()
    reg_no = data["reg_no"]
    password = generate_password_hash(data["password"])
    name=data["name"]
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    mycon, mycur = get_db_connection()
    mycur.execute("SELECT * FROM Users WHERE reg_no=?", (reg_no,))
    if mycur.fetchone():
        return jsonify(msg="EXISTING REG NUMBER"), 409
    
    mycur.execute("INSERT INTO Users (reg_no, password,name,created_at) VALUES (?, ?,?,?)", (reg_no, password,name,now))
    mycon.commit()
    mycon.close()
    return jsonify(msg="registered")

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    reg_no = data["reg_no"]
    password = data["password"]
    mycon, mycur = get_db_connection()
    mycur.execute("SELECT * FROM Users WHERE reg_no=?", (reg_no,))
    user = mycur.fetchone()
    if not user or not check_password_hash(user["password"], password):
        return jsonify(msg="INVALID REGISTER NUMBER OR PASSWORD"), 401
    session['reg_no']=reg_no
    mycon.close()
    return jsonify(msg="logged in"),200


@app.route('/logout',methods=["POST"])
def logout():
    session.clear()
    return {"message": "Logged out successfully"}, 200

if __name__ == "__main__":
    app.run(debug=True)
