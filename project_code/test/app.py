from flask import Flask, session, request, jsonify, render_template
import game  # Ensure this import works correctly with the path where game.py is located

app = Flask(__name__)
app.secret_key = 'your_secure_secret_key_here'  # Change this to a secure key for production

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/start_game', methods=['POST'])
def start_game():
    session['game'] = game.init_game()
    return jsonify({'message': 'Game started!', 'game_state': session['game']})

@app.route('/action', methods=['POST'])
def action():
    action_type = request.form.get('action_type')
    if 'game' in session:
        response = game.perform_action(session['game'], action_type)
        return jsonify({'message': 'Action performed', 'result': response})
    return jsonify({'error': 'No game started'}), 400

if __name__ == '__main__':
    app.run(debug=True)
