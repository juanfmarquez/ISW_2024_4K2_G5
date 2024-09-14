from flask import Blueprint, render_template, request, jsonify


tp6 = Blueprint("tp6", __name__, template_folder="templates")


@tp6.route("/tp6")
def tp6_render():
    return render_template("tp6.html")


@tp6.route("/generate", methods=["POST"])
def generar_numeros():
    print("Petición recibida:", request.json)
    try:
        pass
        result = {
        }

        return jsonify(result)

    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500