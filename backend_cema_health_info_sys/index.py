from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
@app.before_request()
def before_request():
    print("Request received")
def hello():
    return jsonify({"message":'Hello, World!'})

if __name__ == '__main__':
    app.run(debug=True)
