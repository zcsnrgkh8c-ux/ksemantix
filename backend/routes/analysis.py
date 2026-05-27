from flask import Blueprint, request, jsonify
from app import db
from models.database import CorpusFile, Dialogue, Analysis, Sentiment, CharacterRelationship, WordFrequency
from routes.auth import token_required
from nlp.preprocessor import TextPreprocessor
from nlp.feature_extractor import FeatureExtractor
from nlp.sentiment_analyzer import SentimentAnalyzer
from nlp.semantic_analyzer import SemanticAnalyzer
import json

bp = Blueprint('analysis', __name__, url_prefix='/api/analysis')

@bp.route('/preprocess/<int:file_id>', methods=['POST'])
@token_required
def preprocess_text(file_id):
    corpus_file = CorpusFile.query.filter_by(id=file_id, user_id=request.user_id).first()
    
    if not corpus_file:
        return jsonify({'message': 'File not found'}), 404
    
    dialogues = Dialogue.query.filter_by(corpus_file_id=file_id).all()
    
    preprocessor = TextPreprocessor()
    processed_dialogues = []
    
    for dialogue in dialogues:
        if not dialogue.original_text:
            continue
        
        normalized = preprocessor.normalize(dialogue.original_text)
        tokens = preprocessor.tokenize(normalized)
        pos_tags = preprocessor.pos_tagging(tokens)
        is_formal, level = preprocessor.detect_formality(tokens)
        
        dialogue.normalized_text = normalized
        dialogue.pos_tags = json.dumps(pos_tags, ensure_ascii=False)
        dialogue.is_formal = is_formal
        dialogue.formality_level = level
        
        processed_dialogues.append({
            'id': dialogue.id,
            'original': dialogue.original_text,
            'normalized': normalized,
            'tokens': tokens,
            'pos_tags': pos_tags,
            'is_formal': is_formal,
            'formality_level': level
        })
    
    db.session.commit()
    
    corpus_file.status = 'preprocessed'
    db.session.commit()
    
    return jsonify({
        'message': 'Preprocessing completed',
        'processed_count': len(processed_dialogues),
        'dialogues': processed_dialogues[:20]
    })

@bp.route('/extract-features/<int:file_id>', methods=['POST'])
@token_required
def extract_features(file_id):
    corpus_file = CorpusFile.query.filter_by(id=file_id, user_id=request.user_id).first()
    
    if not corpus_file:
        return jsonify({'message': 'File not found'}), 404
    
    dialogues = Dialogue.query.filter_by(corpus_file_id=file_id).all()
    
    extractor = FeatureExtractor()
    
    word_freq = extractor.extract_word_frequencies(dialogues)
    noun_freq = extractor.extract_nouns(dialogues)
    verb_freq = extractor.extract_verbs(dialogues)
    formality_stats = extractor.analyze_formality(dialogues)
    sentence_lengths = extractor.analyze_sentence_lengths(dialogues)
    character_stats = extractor.analyze_character_stats(dialogues)
    catchphrases = extractor.extract_catchphrases(dialogues)
    
    WordFrequency.query.filter_by(corpus_file_id=file_id).delete()
    
    for word, freq in word_freq.items():
        wf = WordFrequency(
            corpus_file_id=file_id,
            word=word,
            frequency=freq,
            word_type='general'
        )
        db.session.add(wf)
    
    for noun, freq in noun_freq.items():
        wf = WordFrequency(
            corpus_file_id=file_id,
            word=noun,
            frequency=freq,
            word_type='noun'
        )
        db.session.add(wf)
    
    db.session.commit()
    
    corpus_file.status = 'features_extracted'
    db.session.commit()
    
    return jsonify({
        'message': 'Feature extraction completed',
        'features': {
            'word_frequencies': dict(sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:50]),
            'noun_frequencies': dict(sorted(noun_freq.items(), key=lambda x: x[1], reverse=True)[:30]),
            'verb_frequencies': dict(sorted(verb_freq.items(), key=lambda x: x[1], reverse=True)[:30]),
            'formality_stats': formality_stats,
            'sentence_lengths': {
                'average': sum(sentence_lengths) / len(sentence_lengths) if sentence_lengths else 0,
                'min': min(sentence_lengths) if sentence_lengths else 0,
                'max': max(sentence_lengths) if sentence_lengths else 0,
                'distribution': sentence_lengths
            },
            'character_stats': character_stats,
            'catchphrases': catchphrases
        }
    })

@bp.route('/sentiment/<int:file_id>', methods=['POST'])
@token_required
def analyze_sentiment(file_id):
    corpus_file = CorpusFile.query.filter_by(id=file_id, user_id=request.user_id).first()
    
    if not corpus_file:
        return jsonify({'message': 'File not found'}), 404
    
    dialogues = Dialogue.query.filter_by(corpus_file_id=file_id).all()
    
    analyzer = SentimentAnalyzer()
    
    emotion_counts = {'happy': 0, 'angry': 0, 'sad': 0, 'neutral': 0}
    character_emotions = {}
    sentiment_timeline = []
    
    for idx, dialogue in enumerate(dialogues):
        if not dialogue.original_text:
            continue
        
        emotion, confidence = analyzer.analyze(dialogue.original_text)
        
        sentiment = Sentiment(
            dialogue_id=dialogue.id,
            emotion=emotion,
            confidence=confidence
        )
        db.session.add(sentiment)
        
        emotion_counts[emotion] += 1
        
        if dialogue.character not in character_emotions:
            character_emotions[dialogue.character] = {'happy': 0, 'angry': 0, 'sad': 0, 'neutral': 0}
        character_emotions[dialogue.character][emotion] += 1
        
        sentiment_timeline.append({
            'line': idx + 1,
            'timestamp': dialogue.timestamp_start,
            'emotion': emotion,
            'confidence': confidence
        })
    
    db.session.commit()
    
    corpus_file.status = 'sentiment_analyzed'
    db.session.commit()
    
    total = sum(emotion_counts.values())
    emotion_percentages = {k: round((v / total * 100), 2) if total > 0 else 0 for k, v in emotion_counts.items()}
    
    return jsonify({
        'message': 'Sentiment analysis completed',
        'sentiments': {
            'emotion_counts': emotion_counts,
            'emotion_percentages': emotion_percentages,
            'character_emotions': character_emotions,
            'sentiment_timeline': sentiment_timeline[:100]
        }
    })

@bp.route('/semantic/<int:file_id>', methods=['POST'])
@token_required
def analyze_semantic(file_id):
    corpus_file = CorpusFile.query.filter_by(id=file_id, user_id=request.user_id).first()
    
    if not corpus_file:
        return jsonify({'message': 'File not found'}), 404
    
    dialogues = Dialogue.query.filter_by(corpus_file_id=file_id).all()
    
    analyzer = SemanticAnalyzer()
    
    character_speech_patterns = analyzer.extract_character_patterns(dialogues)
    similarities = analyzer.calculate_similarities(character_speech_patterns)
    relationships = analyzer.build_relationship_network(similarities)
    
    CharacterRelationship.query.filter_by(corpus_file_id=file_id).delete()
    
    for char1, char2_data in relationships.items():
        for char2, similarity in char2_data.items():
            if char1 != char2 and similarity > 0.3:
                cr = CharacterRelationship(
                    corpus_file_id=file_id,
                    character1=char1,
                    character2=char2,
                    similarity_score=similarity,
                    interaction_count=int(similarity * 100)
                )
                db.session.add(cr)
    
    db.session.commit()
    
    corpus_file.status = 'semantic_analyzed'
    db.session.commit()
    
    return jsonify({
        'message': 'Semantic analysis completed',
        'semantic': {
            'character_patterns': character_speech_patterns,
            'similarities': similarities,
            'relationships': relationships
        }
    })

@bp.route('/dashboard-stats', methods=['GET'])
@token_required
def get_dashboard_stats():
    total_files = CorpusFile.query.filter_by(user_id=request.user_id).count()
    
    all_dialogues = db.session.query(Dialogue).join(CorpusFile).filter(
        CorpusFile.user_id == request.user_id
    ).all()
    
    total_lines = len(all_dialogues)
    
    recent_analysis = Analysis.query.filter_by(user_id=request.user_id).order_by(
        Analysis.created_at.desc()
    ).limit(5).all()
    
    top_words = db.session.query(WordFrequency.word, WordFrequency.frequency).join(
        CorpusFile
    ).filter(
        CorpusFile.user_id == request.user_id
    ).order_by(WordFrequency.frequency.desc()).limit(20).all()
    
    sentiment_counts = db.session.query(Sentiment.emotion, db.func.count(Sentiment.id)).join(
        Dialogue
    ).join(CorpusFile).filter(
        CorpusFile.user_id == request.user_id
    ).group_by(Sentiment.emotion).all()
    
    return jsonify({
        'total_files': total_files,
        'total_lines': total_lines,
        'top_words': [{'word': w, 'frequency': f} for w, f in top_words],
        'sentiment_distribution': {emotion: count for emotion, count in sentiment_counts},
        'recent_analyses': [{
            'id': a.id,
            'type': a.analysis_type,
            'created_at': a.created_at.isoformat(),
            'status': a.status
        } for a in recent_analysis]
    })

@bp.route('/save-analysis/<int:file_id>', methods=['POST'])
@token_required
def save_analysis(file_id):
    data = request.get_json()
    analysis_type = data.get('type')
    results = data.get('results')
    
    analysis = Analysis(
        user_id=request.user_id,
        corpus_file_id=file_id,
        analysis_type=analysis_type,
        results=json.dumps(results, ensure_ascii=False)
    )
    db.session.add(analysis)
    db.session.commit()
    
    return jsonify({
        'message': 'Analysis saved successfully',
        'id': analysis.id
    })
