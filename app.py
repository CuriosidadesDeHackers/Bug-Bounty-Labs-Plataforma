from flask import Flask, render_template, redirect, url_for, request, jsonify
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import sqlite3
from werkzeug.security import check_password_hash
import json
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'supersecretkey'

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

class User(UserMixin):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def get_id(self):
        return str(self.id)

def get_user_by_username(username):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, password FROM users WHERE username = ?", (username,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return User(*row)
    return None

@login_manager.user_loader
def load_user(user_id):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, password FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return User(*row)
    return None

@app.route("/login", methods=["GET", "POST"])
def login():
    error = None
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        user = get_user_by_username(username)
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for("admin"))
        else:
            error = "Credenciales inválidas"
    return render_template("login.html", error=error)

@app.route("/admin")
@login_required
def admin():
    return render_template("admin.html")

@app.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("login"))

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/ranking")
def ranking():
    return render_template("ranking.html")

@app.route("/contacto", methods=["GET", "POST"])
def contacto():
    if request.method == "POST":
        author = request.form.get("author")
        machine_name = request.form.get("machine_name")
        difficulty = request.form.get("difficulty")
        category = request.form.get("category")
        email = request.form.get("email")
        message = request.form.get("message")
        
        # Store machine submission data
        with open('static/recibir-maquinas.txt', 'a', encoding='utf-8') as f:
            machine_data = {
                "autor": author,
                "nombre_maquina": machine_name,
                "dificultad": difficulty,
                "categoria": category,
                "email": email,
                "mensaje": message,
                "fecha": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            f.write(json.dumps(machine_data, ensure_ascii=False) + "\n")
        
        return redirect(url_for("contacto"))
    return render_template("contacto.html")

@app.route("/sobre-nosotros")
@app.route("/sobre-nosotros.html")
def sobre_nosotros():
    return render_template("sobre-nosotros.html")

@app.route("/xss")
@app.route("/xss.html")
def xss():
    return render_template("xss.html")

@app.route("/sqli")
@app.route("/sqli.html")
def sqli():
    return render_template("sqli.html")

@app.route("/nosqli")
@app.route("/nosqli.html")
def nosqli():
    return render_template("nosqli.html")

@app.route("/reglas")
@app.route("/reglas.html")
def reglas():
    return render_template("reglas.html")

@app.route("/mix")
@app.route("/mix.html")
def mix():
    return render_template("mix.html")

@app.route("/ssti")
@app.route("/ssti.html")
def ssti():
    return render_template("ssti.html")

@app.route("/cors")
@app.route("/cors.html")
def cors():
    return render_template("cors.html")

@app.route("/or")
@app.route("/or.html")
def open_redirect_html():
    return render_template("or.html")

@app.route("/bac")
@app.route("/bac.html")
def bac():
    return render_template("bac.html")

@app.route("/ci")
@app.route("/ci.html")
def command_injection():
    return render_template("ci.html")

@app.route("/csrf")
@app.route("/csrf.html")
def csrf():
    return render_template("csrf.html")

@app.route("/xxe")
@app.route("/xxe.html")
def xxe():
    return render_template("xxe.html")

@app.route("/api/recibir-writeup", methods=["POST"])
def recibir_writeup():
    try:
        data = request.get_json()
        lab_id = data.get('lab_id')
        autor = data.get('autor')
        url = data.get('url')

        if not all([lab_id, autor, url]):
            return jsonify({"status": "error", "message": "Faltan datos requeridos"}), 400

        # Store write-up data for validation
        with open('static/recibir-writeups.txt', 'a', encoding='utf-8') as f:
            writeup_data = {
                "lab_id": lab_id,
                "autor": autor,
                "url": url,
                "fecha": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            f.write(json.dumps(writeup_data, ensure_ascii=False) + "\n")

        return jsonify({"status": "success", "message": "Write-up enviado para validación"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)