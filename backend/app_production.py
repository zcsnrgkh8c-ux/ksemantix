import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from database_config import database_path

app = Flask(__name__)
CORS(app, origins=[
    "https://k-semantix-ai.pages.dev",
    "https://ksemantix.ai",
    "http://localhost:3000",
    "http://localhost:5173"
])

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'k-semantix-ai-secret-key-2024')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{database_path}/ksemantix.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = '/uploads'
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

db = SQLAlchemy(app)

from routes import auth, corpus, analysis, visualization, export

app.register_blueprint(auth.bp)
app.register_blueprint(corpus.bp)
app.register_blueprint(analysis.bp)
app.register_blueprint(visualization.bp)
app.register_blueprint(export.bp)

@app.route('/api/health')
def health_check():
    return {'status': 'healthy', 'service': 'K-Semantix AI API'}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000, host='0.0.0.0')
