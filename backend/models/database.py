from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    analyses = db.relationship('Analysis', backref='user', lazy=True)
    corpus_files = db.relationship('CorpusFile', backref='user', lazy=True)

class CorpusFile(db.Model):
    __tablename__ = 'corpus_files'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    filename = db.Column(db.String(200), nullable=False)
    filepath = db.Column(db.String(300), nullable=False)
    file_type = db.Column(db.String(10), nullable=False)
    file_size = db.Column(db.Integer)
    upload_time = db.Column(db.DateTime, default=datetime.utcnow)
    title = db.Column(db.String(200))
    total_lines = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default='uploaded')
    
    dialogues = db.relationship('Dialogue', backref='corpus_file', lazy=True)

class Dialogue(db.Model):
    __tablename__ = 'dialogues'
    id = db.Column(db.Integer, primary_key=True)
    corpus_file_id = db.Column(db.Integer, db.ForeignKey('corpus_files.id'), nullable=False)
    line_number = db.Column(db.Integer)
    timestamp_start = db.Column(db.String(20))
    timestamp_end = db.Column(db.String(20))
    character = db.Column(db.String(100))
    original_text = db.Column(db.Text)
    normalized_text = db.Column(db.Text)
    pos_tags = db.Column(db.Text)
    is_formal = db.Column(db.Boolean, default=False)
    formality_level = db.Column(db.Integer)
    
    sentiments = db.relationship('Sentiment', backref='dialogue', lazy=True)

class Analysis(db.Model):
    __tablename__ = 'analyses'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    corpus_file_id = db.Column(db.Integer, db.ForeignKey('corpus_files.id'))
    analysis_type = db.Column(db.String(50), nullable=False)
    results = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='completed')

class Sentiment(db.Model):
    __tablename__ = 'sentiments'
    id = db.Column(db.Integer, primary_key=True)
    dialogue_id = db.Column(db.Integer, db.ForeignKey('dialogues.id'), nullable=False)
    emotion = db.Column(db.String(20), nullable=False)
    confidence = db.Column(db.Float)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class CharacterRelationship(db.Model):
    __tablename__ = 'character_relationships'
    id = db.Column(db.Integer, primary_key=True)
    corpus_file_id = db.Column(db.Integer, db.ForeignKey('corpus_files.id'), nullable=False)
    character1 = db.Column(db.String(100), nullable=False)
    character2 = db.Column(db.String(100), nullable=False)
    relationship_type = db.Column(db.String(50))
    interaction_count = db.Column(db.Integer, default=1)
    similarity_score = db.Column(db.Float)

class WordFrequency(db.Model):
    __tablename__ = 'word_frequencies'
    id = db.Column(db.Integer, primary_key=True)
    corpus_file_id = db.Column(db.Integer, db.ForeignKey('corpus_files.id'), nullable=False)
    word = db.Column(db.String(100), nullable=False)
    frequency = db.Column(db.Integer, default=1)
    pos_tag = db.Column(db.String(20))
    word_type = db.Column(db.String(20))
