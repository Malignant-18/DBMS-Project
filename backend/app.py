import mysql.connector
from flask import Flask, request, jsonify,session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "secret_key"
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = False 
CORS(app, resources={r"/*": {"origins": ["http://localhost:5174"]}}, supports_credentials=True, allow_headers=["Content-Type"])

def get_db_connection():
    mycon = mysql.connector.connect(host="localhost", user="root", password="anujith", database="voting_system")
    return mycon, mycon.cursor(dictionary=True)

@app.route("/register", methods=["POST","OPTIONS"])
def register():
    if request.method == "OPTIONS":
        return "", 200  
    data = request.get_json()
    reg_no = data["reg_no"]
    password = generate_password_hash(data["password"])
    name=data["name"]
    mycon, mycur = get_db_connection()
    mycur.execute("SELECT * FROM Users WHERE reg_no=%s", (reg_no,))
    if mycur.fetchone():
        return jsonify(msg="EXISTING REG NUMBER"), 409
    mycur.execute("INSERT INTO Users (reg_no, password,name) VALUES (%s, %s,%s)", (reg_no, password,name))
    mycon.commit()
    return jsonify(msg="registered")

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    reg_no = data["reg_no"]
    password = data["password"]
    mycon, mycur = get_db_connection()
    mycur.execute("SELECT * FROM Users WHERE reg_no=%s", (reg_no,))
    user = mycur.fetchone()
    if not user or not check_password_hash(user["password"], password):
        return jsonify(msg="INVALID REGISTER NUMBER OR PASSWORD"), 401
    session['reg_no']=reg_no
    return jsonify(msg="logged in"),200


@app.route('/logout',methods=["POST"])
def logout():
    session.clear()
    return {"message": "Logged out successfully"}, 200

if __name__ == "__main__":
    app.run(debug=True)
