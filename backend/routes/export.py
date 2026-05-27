from flask import Blueprint, request, jsonify, make_response
from routes.auth import token_required
from app import db
from models.database import CorpusFile, Dialogue, Sentiment, WordFrequency
from reportlab.lib.pagesizes import A4, letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak
from reportlab.graphics.shapes import Drawing, Rect
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics import renderPDF
from io import BytesIO
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')
import seaborn as sns
from datetime import datetime

bp = Blueprint('export', __name__, url_prefix='/api/export')

@bp.route('/pdf-report/<int:file_id>', methods=['GET'])
@token_required
def export_pdf_report(file_id):
    corpus_file = CorpusFile.query.filter_by(id=file_id, user_id=request.user_id).first()
    
    if not corpus_file:
        return jsonify({'message': 'File not found'}), 404
    
    dialogues = Dialogue.query.filter_by(corpus_file_id=file_id).all()
    
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1e3a8a'),
        spaceAfter=30,
        alignment=1
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#3b82f6'),
        spaceBefore=20,
        spaceAfter=12
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=6
    )
    
    story = []
    
    story.append(Paragraph("K-Semantix AI", title_style))
    story.append(Paragraph("Korean Semantic Analysis Report", title_style))
    story.append(Spacer(1, 20))
    
    story.append(Paragraph(f"Analysis Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", normal_style))
    story.append(Paragraph(f"File: {corpus_file.title}", normal_style))
    story.append(Paragraph(f"Total Dialogues: {len(dialogues)}", normal_style))
    story.append(Spacer(1, 30))
    
    word_freqs = WordFrequency.query.filter_by(
        corpus_file_id=file_id,
        word_type='general'
    ).order_by(WordFrequency.frequency.desc()).limit(20).all()
    
    if word_freqs:
        story.append(Paragraph("Top 20 Word Frequencies", heading_style))
        
        word_data = [['Rank', 'Word', 'Frequency']]
        for idx, wf in enumerate(word_freqs[:20], 1):
            word_data.append([str(idx), wf.word, str(wf.frequency)])
        
        word_table = Table(word_data, colWidths=[50, 200, 100])
        word_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f0f9ff')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#93c5fd'))
        ]))
        story.append(word_table)
        story.append(Spacer(1, 20))
    
    emotion_counts = db.session.query(
        Sentiment.emotion,
        db.func.count(Sentiment.id)
    ).join(Dialogue).filter(
        Dialogue.corpus_file_id == file_id
    ).group_by(Sentiment.emotion).all()
    
    if emotion_counts:
        story.append(Paragraph("Emotion Distribution Analysis", heading_style))
        
        emotion_data = [['Emotion', 'Count', 'Percentage']]
        total = sum(count for _, count in emotion_counts)
        emotion_labels = {'happy': 'Happy', 'angry': 'Angry', 'sad': 'Sad', 'neutral': 'Neutral'}
        
        for emotion, count in emotion_counts:
            emotion_data.append([
                emotion_labels.get(emotion, emotion),
                str(count),
                f"{(count/total*100):.2f}%"
            ])
        
        emotion_table = Table(emotion_data, colWidths=[150, 100, 100])
        emotion_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8b5cf6')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f5f3ff')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#c4b5fd'))
        ]))
        story.append(emotion_table)
        story.append(Spacer(1, 20))
    
    character_dialogue_counts = db.session.query(
        Dialogue.character,
        db.func.count(Dialogue.id)
    ).filter(
        Dialogue.corpus_file_id == file_id
    ).group_by(Dialogue.character).order_by(db.func.count(Dialogue.id).desc()).all()
    
    if character_dialogue_counts:
        story.append(Paragraph("Character Dialogue Statistics", heading_style))
        
        char_data = [['Character', 'Dialogue Count']]
        for char, count in character_dialogue_counts[:15]:
            char_data.append([char, str(count)])
        
        char_table = Table(char_data, colWidths=[250, 150])
        char_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#10b981')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#ecfdf5')),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#6ee7b7'))
        ]))
        story.append(char_table)
        story.append(Spacer(1, 20))
    
    story.append(PageBreak())
    
    story.append(Paragraph("AI-Powered Analysis Summary", heading_style))
    story.append(Spacer(1, 10))
    
    summary_text = f"""
    This analysis report was automatically generated by K-Semantix AI platform.
    The analysis includes {len(dialogues)} dialogue lines from the uploaded subtitle file.
    
    Key Findings:
    - Most frequent words and expressions used in the content
    - Emotional distribution patterns across different characters
    - Character interaction patterns and speech styles
    - Formality levels and language patterns
    
    The data presented in this report can be used for:
    - Academic research on Korean language patterns
    - Character personality analysis in media content
    - Emotional trajectory analysis in storytelling
    - Cross-cultural communication studies
    """
    
    story.append(Paragraph(summary_text, normal_style))
    story.append(Spacer(1, 30))
    
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.grey,
        alignment=1
    )
    story.append(Paragraph("Generated by K-Semantix AI Platform | Korean Semantic Analysis", footer_style))
    story.append(Paragraph(f"Report ID: {file_id}-{datetime.now().strftime('%Y%m%d%H%M%S')}", footer_style))
    
    doc.build(story)
    
    buffer.seek(0)
    response = make_response(buffer.getvalue())
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = f'attachment; filename=ksemantix_report_{file_id}.pdf'
    
    return response

@bp.route('/json-report/<int:file_id>', methods=['GET'])
@token_required
def export_json_report(file_id):
    from sqlalchemy import func
    import json
    
    corpus_file = CorpusFile.query.filter_by(id=file_id, user_id=request.user_id).first()
    
    if not corpus_file:
        return jsonify({'message': 'File not found'}), 404
    
    dialogues = Dialogue.query.filter_by(corpus_file_id=file_id).all()
    
    word_freqs = WordFrequency.query.filter_by(
        corpus_file_id=file_id
    ).order_by(WordFrequency.frequency.desc()).limit(50).all()
    
    emotion_counts = db.session.query(
        Sentiment.emotion,
        func.count(Sentiment.id)
    ).join(Dialogue).filter(
        Dialogue.corpus_file_id == file_id
    ).group_by(Sentiment.emotion).all()
    
    report_data = {
        'metadata': {
            'file_id': file_id,
            'filename': corpus_file.filename,
            'title': corpus_file.title,
            'analysis_date': datetime.now().isoformat(),
            'total_dialogues': len(dialogues)
        },
        'word_frequencies': [
            {'word': wf.word, 'frequency': wf.frequency, 'type': wf.word_type}
            for wf in word_freqs
        ],
        'emotion_distribution': {
            emotion: count for emotion, count in emotion_counts
        },
        'character_analysis': {},
        'summary': {
            'total_unique_words': len(word_freqs),
            'total_dialogues_analyzed': sum(count for _, count in emotion_counts),
            'most_common_emotion': max(emotion_counts, key=lambda x: x[1])[0] if emotion_counts else None
        }
    }
    
    return jsonify(report_data)
