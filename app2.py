from flask import Flask, render_template, url_for, request, redirect, session, jsonify, Response

app = Flask(__name__)

@app.route('/chat')
def webchat():
    return render_template('chat.html')

if __name__ == "__main__":
    app.run(debug=True, port=5000, host='0.0.0.0')
