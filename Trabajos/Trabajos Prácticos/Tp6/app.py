from flask import Flask, render_template
from app.tp6 import tp6


app = Flask(__name__, template_folder="app/templates", static_folder="app/static")

app.register_blueprint(tp6)

@app.route("/")
def index():
    return render_template("index.html")


@app.errorhandler(404)
def not_found(e):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(debug=True)