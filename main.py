from flask import Flask, render_template
import subprocess
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/play-game', methods=['POST'])
def play_game():
    # Assuming your game is a script that can be run directly
    # Update 'your_game_script.py' with the path to your game script
    result = subprocess.run(['python', 'your_game_script.py'], capture_output=True, text=True)
    return result.stdout

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)

