from flask import Blueprint, request, jsonify
from routes.auth import token_required
from app import db
from models.database import CorpusFile, Dialogue, Sentiment, WordFrequency
from sqlalchemy import func

bp = Blueprint('visualization', __name__, url_prefix='/api/visualization')

@bp.route('/word-cloud/<int:file_id>', methods=['GET'])
@token_required
def get_word_cloud_data(file_id):
    corpus_file = CorpusFile.query.filter_by(id=file_id, user_id=request.user_id).first()
    
    if not corpus_file:
        return jsonify({'message': 'File not found'}), 404
    
    word_freqs = db.session.query(
        WordFrequency.word,
        WordFrequency.frequency
    ).filter(
        WordFrequency.corpus_file_id == file_id
    ).order_by(WordFrequency.frequency.desc()).limit(100).all()
    
    return jsonify({
        'words': [{'name': word, 'value': freq} for word, freq in word_freqs]
    })

@bp.route('/sentiment-chart/<int:file_id>', methods=['GET'])
@token_required
def get_sentiment_chart_data(file_id):
    corpus_file = CorpusFile.query.filter_by(id=file_id, user_id=request.user_id).first()
    
    if not corpus_file:
        return jsonify({'message': 'File not found'}), 404
    
    emotion_counts = db.session.query(
        Sentiment.emotion,
        func.count(Sentiment.id)
    ).join(Dialogue).filter(
        Dialogue.corpus_file_id == file_id
    ).group_by(Sentiment.emotion).all()
    
    sentiment_timeline = db.session.query(
        Dialogue.line_number,
        Sentiment.emotion
    ).join(Sentiment).filter(
        Dialogue.corpus_file_id == file_id
    ).order_by(Dialogue.line_number).limit(200).all()
    
    emotion_map = {'happy': 1, 'angry': -1, 'sad': -2, 'neutral': 0}
    
    return jsonify({
        'pie_data': [{'name': emotion, 'value': count} for emotion, count in emotion_counts],
        'timeline': [{
            'line': line_num,
            'emotion_value': emotion_map.get(emotion, 0)
        } for line_num, emotion in sentiment_timeline]
    })

@bp.route('/character-analysis/<int:file_id>', methods=['GET'])
@token_required
def get_character_analysis_data(file_id):
    corpus_file = CorpusFile.query.filter_by(id=file_id, user_id=request.user_id).first()
    
    if not corpus_file:
        return jsonify({'message': 'File not found'}), 404
    
    character_dialogue_counts = db.session.query(
        Dialogue.character,
        func.count(Dialogue.id)
    ).filter(
        Dialogue.corpus_file_id == file_id
    ).group_by(Dialogue.character).order_by(func.count(Dialogue.id).desc()).all()
    
    character_formality = db.session.query(
        Dialogue.character,
        func.avg(Dialogue.formality_level),
        func.count(Dialogue.id)
    ).filter(
        Dialogue.corpus_file_id == file_id,
        Dialogue.formality_level.isnot(None)
    ).group_by(Dialogue.character).all()
    
    character_emotions = db.session.query(
        Dialogue.character,
        Sentiment.emotion,
        func.count(Sentiment.id)
    ).join(Sentiment).filter(
        Dialogue.corpus_file_id == file_id
    ).group_by(Dialogue.character, Sentiment.emotion).all()
    
    emotion_by_char = {}
    for char, emotion, count in character_emotions:
        if char not in emotion_by_char:
            emotion_by_char[char] = []
        emotion_by_char[char].append({'emotion': emotion, 'count': count})
    
    return jsonify({
        'dialogue_counts': [{'character': char, 'count': count} for char, count in character_dialogue_counts],
        'formality_data': [{
            'character': char,
            'formality_level': float(avg_level) if avg_level else 0,
            'total_lines': total
        } for char, avg_level, total in character_formality],
        'emotion_distribution': emotion_by_char
    })

@bp.route('/pos-distribution/<int:file_id>', methods=['GET'])
@token_required
def get_pos_distribution(file_id):
    import json
    
    corpus_file = CorpusFile.query.filter_by(id=file_id, user_id=request.user_id).first()
    
    if not corpus_file:
        return jsonify({'message': 'File not found'}), 404
    
    dialogues = Dialogue.query.filter_by(corpus_file_id=file_id).all()
    
    pos_counts = {}
    for dialogue in dialogues:
        if dialogue.pos_tags:
            try:
                pos_tags = json.loads(dialogue.pos_tags)
                for token, tag in pos_tags:
                    pos_counts[tag] = pos_counts.get(tag, 0) + 1
            except:
                continue
    
    pos_labels = {
        'NNG': '일반명사',
        'NNP': '고유명사',
        'VV': '동사',
        'VA': '형용사',
        'MAG': '일반부사',
        'MAJ': '접속부사',
        'IC': '감탄사',
        'JKS': '주격조사',
        'JKC': '보격조사',
        'JKG': '관형격조사',
        'JKO': '목적격조사',
        'JKQ': ' Quotes',
        'JKM': '부사격조사',
        'JKI': 'Interjection',
        'JKV': 'Verb.',
        'JKW': 'Question',
        'EO': 'EOS',
        'EF': 'Final',
        'EC': 'Connecting',
        'ET': 'Terminating',
        'SF': 'Period',
        'SS': 'Quote',
        'SE': 'Ellipsis',
        'SO': 'Direct',
        'SW': 'Other',
        'NF': 'Noun Infl.',
        'NV': 'Verb Infl.',
        'NX': 'Other',
        'SN': 'Number'
    }
    
    return jsonify({
        'pos_counts': {pos_labels.get(k, k): v for k, v in pos_counts.items()},
        'raw_data': pos_counts
    })

@bp.route('/relationship-graph/<int:file_id>', methods=['GET'])
@token_required
def get_relationship_graph(file_id):
    from models.database import CharacterRelationship
    
    corpus_file = CorpusFile.query.filter_by(id=file_id, user_id=request.user_id).first()
    
    if not corpus_file:
        return jsonify({'message': 'File not found'}), 404
    
    relationships = CharacterRelationship.query.filter_by(corpus_file_id=file_id).all()
    
    nodes = set()
    links = []
    
    for rel in relationships:
        nodes.add(rel.character1)
        nodes.add(rel.character2)
        links.append({
            'source': rel.character1,
            'target': rel.character2,
            'similarity': rel.similarity_score,
            'interactions': rel.interaction_count
        })
    
    node_data = [{'id': char, 'name': char} for char in nodes]
    
    return jsonify({
        'nodes': node_data,
        'links': links
    })

@bp.route('/timeline/<int:file_id>', methods=['GET'])
@token_required
def get_timeline_data(file_id):
    corpus_file = CorpusFile.query.filter_by(id=file_id, user_id=request.user_id).first()
    
    if not corpus_file:
        return jsonify({'message': 'File not found'}), 404
    
    dialogues = Dialogue.query.filter_by(
        corpus_file_id == file_id
    ).order_by(Dialogue.line_number).all()
    
    timeline = []
    for d in dialogues:
        sentiment = Sentiment.query.filter_by(dialogue_id=d.id).first()
        timeline.append({
            'line_number': d.line_number,
            'timestamp': d.timestamp_start,
            'character': d.character,
            'text': d.original_text[:100],
            'emotion': sentiment.emotion if sentiment else 'neutral',
            'confidence': sentiment.confidence if sentiment else 0
        })
    
    return jsonify({'timeline': timeline})
