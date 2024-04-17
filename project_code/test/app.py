from flask import Flask, render_template, request, session
import game

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_game', methods=['POST'])
def start_game():
    session['game'] = game.init_game()
    return {'message': 'Game started!'}

@app.route('/perform_action', methods=['POST'])
def perform_action():
    action = request.form.get('action')
    output = game.perform_action(session['game'], action)
    return {'output': output}

if __name__ == "__main__":
    app.run(debug=True)

