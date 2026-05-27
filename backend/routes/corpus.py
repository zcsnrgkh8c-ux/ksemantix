from flask import Blueprint, request, jsonify, current_app
from app import db
from models.database import CorpusFile, Dialogue
from routes.auth import token_required
import os
import re
from datetime import datetime

bp = Blueprint('corpus', __name__, url_prefix='/api/corpus')

def parse_srt(content):
    dialogues = []
    blocks = content.strip().split('\n\n')
    
    for block in blocks:
        lines = block.strip().split('\n')
        if len(lines) >= 3:
            time_match = re.match(r'(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})', lines[1])
            if time_match:
                timestamp_start = time_match.group(1)
                timestamp_end = time_match.group(2)
                text = ' '.join(lines[2:])
                dialogues.append({
                    'timestamp_start': timestamp_start,
                    'timestamp_end': timestamp_end,
                    'text': text
                })
    
    return dialogues

def parse_txt(content):
    dialogues = []
    lines = content.split('\n')
    
    for i, line in enumerate(lines):
        line = line.strip()
        if line and not line.startswith('#'):
            if ':' in line:
                parts = line.split(':', 1)
                character = parts[0].strip()
                text = parts[1].strip()
            else:
                character = 'Unknown'
                text = line
            
            dialogues.append({
                'timestamp_start': '',
                'timestamp_end': '',
                'character': character,
                'text': text
            })
    
    return dialogues

def parse_json(content):
    import json
    try:
        data = json.loads(content)
        dialogues = []
        
        if isinstance(data, list):
            for item in data:
                dialogues.append({
                    'timestamp_start': item.get('start', ''),
                    'timestamp_end': item.get('end', ''),
                    'character': item.get('speaker', item.get('character', 'Unknown')),
                    'text': item.get('text', item.get('dialogue', ''))
                })
        elif isinstance(data, dict) and 'dialogues' in data:
            for item in data['dialogues']:
                dialogues.append({
                    'timestamp_start': item.get('start', ''),
                    'timestamp_end': item.get('end', ''),
                    'character': item.get('speaker', item.get('character', 'Unknown')),
                    'text': item.get('text', item.get('dialogue', ''))
                })
        
        return dialogues
    except:
        return []

def extract_character(text):
    patterns = [
        r'^([가-힣A-Za-z]+):',
        r'^<([가-힣A-Za-z]+)>',
        r'^([가-힣A-Za-z]+)▸',
        r'^([가-힣A-Za-z]+)\s*[–-]\s*',
    ]
    
    for pattern in patterns:
        match = re.match(pattern, text)
        if match:
            return match.group(1).strip()
    
    return 'Unknown'

@bp.route('/upload', methods=['POST'])
@token_required
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
    
    filename = file.filename
    file_ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    
    if file_ext not in ['srt', 'txt', 'json']:
        return jsonify({'message': 'Invalid file type. Supported: .srt, .txt, .json'}), 400
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    safe_filename = f"{timestamp}_{filename}"
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], safe_filename)
    file.save(filepath)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if file_ext == 'srt':
        dialogues = parse_srt(content)
    elif file_ext == 'txt':
        dialogues = parse_txt(content)
    else:
        dialogues = parse_json(content)
    
    title = request.form.get('title', filename.rsplit('.', 1)[0])
    
    corpus_file = CorpusFile(
        user_id=request.user_id,
        filename=filename,
        filepath=filepath,
        file_type=file_ext,
        file_size=os.path.getsize(filepath),
        title=title,
        total_lines=len(dialogues)
    )
    db.session.add(corpus_file)
    db.session.flush()
    
    for idx, dialog_data in enumerate(dialogues):
        character = dialog_data.get('character', extract_character(dialog_data['text']))
        if character == 'Unknown' and ':' in dialog_data['text']:
            character = extract_character(dialog_data['text'])
        
        dialogue = Dialogue(
            corpus_file_id=corpus_file.id,
            line_number=idx + 1,
            timestamp_start=dialog_data.get('timestamp_start', ''),
            timestamp_end=dialog_data.get('timestamp_end', ''),
            character=character,
            original_text=dialog_data['text']
        )
        db.session.add(dialogue)
    
    db.session.commit()
    
    return jsonify({
        'message': 'File uploaded successfully',
        'corpus_file': {
            'id': corpus_file.id,
            'filename': corpus_file.filename,
            'title': corpus_file.title,
            'total_lines': corpus_file.total_lines,
            'status': corpus_file.status
        }
    }), 201

@bp.route('/files', methods=['GET'])
@token_required
def get_files():
    files = CorpusFile.query.filter_by(user_id=request.user_id).order_by(CorpusFile.upload_time.desc()).all()
    
    return jsonify([{
        'id': f.id,
        'filename': f.filename,
        'title': f.title,
        'file_type': f.file_type,
        'file_size': f.file_size,
        'total_lines': f.total_lines,
        'upload_time': f.upload_time.isoformat(),
        'status': f.status
    } for f in files])

@bp.route('/files/<int:file_id>', methods=['GET'])
@token_required
def get_file_detail(file_id):
    corpus_file = CorpusFile.query.filter_by(id=file_id, user_id=request.user_id).first()
    
    if not corpus_file:
        return jsonify({'message': 'File not found'}), 404
    
    dialogues = Dialogue.query.filter_by(corpus_file_id=file_id).all()
    
    return jsonify({
        'file': {
            'id': corpus_file.id,
            'filename': corpus_file.filename,
            'title': corpus_file.title,
            'file_type': corpus_file.file_type,
            'total_lines': corpus_file.total_lines,
            'upload_time': corpus_file.upload_time.isoformat()
        },
        'dialogues': [{
            'id': d.id,
            'line_number': d.line_number,
            'timestamp_start': d.timestamp_start,
            'timestamp_end': d.timestamp_end,
            'character': d.character,
            'original_text': d.original_text,
            'normalized_text': d.normalized_text,
            'pos_tags': d.pos_tags,
            'is_formal': d.is_formal,
            'formality_level': d.formality_level
        } for d in dialogues]
    })

@bp.route('/files/<int:file_id>', methods=['DELETE'])
@token_required
def delete_file(file_id):
    corpus_file = CorpusFile.query.filter_by(id=file_id, user_id=request.user_id).first()
    
    if not corpus_file:
        return jsonify({'message': 'File not found'}), 404
    
    if os.path.exists(corpus_file.filepath):
        os.remove(corpus_file.filepath)
    
    Dialogue.query.filter_by(corpus_file_id=file_id).delete()
    db.session.delete(corpus_file)
    db.session.commit()
    
    return jsonify({'message': 'File deleted successfully'})
