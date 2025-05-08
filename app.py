from flask import Flask, render_template, redirect, url_for, request
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import sqlite3
from werkzeug.security import check_password_hash

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

@app.route("/contacto")
@app.route("/contacto.html")
def contacto():
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

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)