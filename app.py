from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/contacto")
def contacto():
    return render_template("contacto.html")

@app.route("/contacto.html")
def contacto_html():
    return render_template("contacto.html")

@app.route("/sobre-nosotros")
def sobre_nosotros():
    return render_template("sobre-nosotros.html")

@app.route("/sobre-nosotros.html")
def sobre_nosotros_html():
    return render_template("sobre-nosotros.html")

@app.route("/xss")
def xss():
    return render_template("xss.html")

@app.route("/xss.html")
def xss_html():
    return render_template("xss.html")

@app.route("/sqli")
def sqli():
    return render_template("sqli.html")

@app.route("/sqli.html")
def sqli_html():
    return render_template("sqli.html")

@app.route("/ssti")
def ssti():
    return render_template("ssti.html")

@app.route("/ssti.html")
def ssti_html():
    return render_template("ssti.html")

@app.route("/cors")
def cors():
    return render_template("cors.html")

@app.route("/cors.html")
def cors_html():
    return render_template("cors.html")

@app.route("/or")
@app.route("/or.html")
def open_redirect_html():
    return render_template("or.html")

if __name__ == "__main__":
    app.run(debug=True)
