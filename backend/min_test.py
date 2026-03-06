from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({"message": "Minimal app working!"})

@app.route('/api/test')
def test():
    return jsonify({"status": "ok", "message": "API is working"})

if __name__ == '__main__':
    print("Starting minimal test app on port 5000...")
    app.run(debug=True, port=5000)
