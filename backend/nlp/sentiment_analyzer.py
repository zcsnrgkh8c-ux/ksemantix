import re
from collections import Counter

class SentimentAnalyzer:
    def __init__(self):
        self.emotion_keywords = {
            'happy': [
                '좋다', '좋아', '행복', '기쁨', '즐거', '웃', '사랑', '좋아요', '입니다', 
                '잘', '괜찮', '、最高', '完美', '厉害', '좋습니다', '축하', '신나', '대박',
                'amazing', 'great', 'good', 'happy', 'love', 'best', 'wonderful', 'excellent'
            ],
            'angry': [
                '화나', '분노', '터지', '짜증', '미치', '밖', '죽겠', '嫌', '可恶', '生气',
                'angry', 'hate', 'stupid', 'damn', 'fuck', 'shit', 'bastard', 'idiot',
                '싫어', '可恶', '체', '년', '개', '놈'
            ],
            'sad': [
                '슬프', '울', '눈물', '괴롭', '힘들', '절망', '한탄', '悲', '叹', '伤',
                'sad', 'cry', 'tears', 'miss', 'lonely', 'depressed', 'unhappy', 'sorry',
                '아프', '痛い', '难受', '心痛'
            ],
            'neutral': [
                '뭐', '어', '저', '그', '이', '뭐', '뭘', '무엇', '어디', '누구', '언제',
                'what', 'where', 'who', 'when', 'how', 'this', 'that', 'these', 'those'
            ]
        }
        
        self.intensity_patterns = {
            'very_high': [r'정말', r'너무', r'진짜', r'매우', r'완전히', r'absolutely', r'very', r'really', r'so much'],
            'high': [r' 많이', r' 많이', r' 상당히', r' 많이', r' pretty', r' quite'],
            'medium': [r' 약간', r' 조금', r' somewhat', r' a bit'],
            'low': [r' 微', r' slightly', r' a little']
        }

    def analyze(self, text):
        if not text:
            return 'neutral', 0.0
        
        text_lower = text.lower()
        text_korean = text
        
        emotion_scores = Counter()
        
        for emotion, keywords in self.emotion_keywords.items():
            for keyword in keywords:
                if keyword.lower() in text_lower or keyword in text_korean:
                    emotion_scores[emotion] += 1
        
        intensity = self.detect_intensity(text)
        for emotion in emotion_scores:
            emotion_scores[emotion] *= intensity
        
        if not emotion_scores:
            return 'neutral', 0.5
        
        dominant_emotion = emotion_scores.most_common(1)[0][0]
        total_score = sum(emotion_scores.values())
        confidence = emotion_scores[dominant_emotion] / total_score if total_score > 0 else 0.5
        
        confidence = min(confidence * intensity, 1.0)
        
        return dominant_emotion, round(confidence, 3)

    def detect_intensity(self, text):
        for intensity, patterns in self.intensity_patterns.items():
            for pattern in patterns:
                if re.search(pattern, text):
                    intensity_values = {
                        'very_high': 1.5,
                        'high': 1.3,
                        'medium': 1.0,
                        'low': 0.7
                    }
                    return intensity_values.get(intensity, 1.0)
        
        return 1.0

    def analyze_batch(self, texts):
        results = []
        
        for text in texts:
            emotion, confidence = self.analyze(text)
            results.append({
                'text': text,
                'emotion': emotion,
                'confidence': confidence
            })
        
        return results

    def get_emotion_distribution(self, analyses):
        distribution = Counter()
        
        for analysis in analyses:
            if isinstance(analysis, dict):
                emotion = analysis.get('emotion', 'neutral')
            else:
                emotion = analysis
            distribution[emotion] += 1
        
        return dict(distribution)
