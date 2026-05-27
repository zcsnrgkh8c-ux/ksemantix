import re
import unicodedata

class TextPreprocessor:
    def __init__(self):
        self.stopwords = set([
            '이', '그', '저', '것', '수', '등', '더', '또', '좀', '잘', '못', '말', '및', '또',
            '을', '를', '에', '에서', '까지', '부터', '에게', '한테', '께', '보다', '처럼', '만큼',
            '도', '만', '까지', '만', '은', '는', '이', '가', '의', '와', '과', '도', '만', '로',
            '으로', '고', '하고', '이며', '이며', '이나', '나', '이나', '랑', '이랑', '고', '으며'
        ])
        
        self.formal_markers = [
            '습니다', '니다', '어요', '아요', '입니다', '예요', '이에요',
            '습니까', '니까요', '어서', '기에', '게', '에게', '한테', '께',
            '합', '입', '니', '다', '요', '세', '소'
        ]
        
        self.informal_markers = [
            '야', '해', '해요', '야', '구나', '네', '아', '어', '지', '임'
        ]

    def normalize(self, text):
        if not text:
            return ""
        
        text = unicodedata.normalize('NFC', text)
        text = re.sub(r'<[^>]+>', '', text)
        text = re.sub(r'\[.*?\]', '', text)
        text = re.sub(r'\{.*?\}', '', text)
        text = re.sub(r'\(.*?\)', '', text)
        text = re.sub(r'[^\w\s가-힣.!?~]', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        text = text.strip()
        
        return text

    def tokenize(self, text):
        if not text:
            return []
        
        try:
            from konlpy.tag import Okt
            okt = Okt()
            tokens = okt.morphs(text)
            return tokens
        except:
            tokens = text.split()
            return tokens

    def pos_tagging(self, tokens):
        if not tokens:
            return []
        
        try:
            from konlpy.tag import Okt
            okt = Okt()
            text = ' '.join(tokens)
            pos_tags = okt.pos(text)
            return [(word, tag) for word, tag in pos_tags]
        except:
            return [(token, 'UNKNOWN') for token in tokens]

    def remove_stopwords(self, tokens):
        return [token for token in tokens if token not in self.stopwords and len(token) > 1]

    def detect_formality(self, tokens):
        if not tokens:
            return False, 0
        
        formal_count = sum(1 for token in tokens if any(marker in token for marker in self.formal_markers))
        informal_count = sum(1 for token in tokens if any(marker in token for marker in self.informal_markers))
        
        total = formal_count + informal_count
        if total == 0:
            return False, 0
        
        formality_ratio = formal_count / total
        
        if formality_ratio > 0.6:
            return True, 3
        elif formality_ratio > 0.3:
            return True, 2
        else:
            return False, 1

    def extract_nouns(self, tokens):
        try:
            from konlpy.tag import Okt
            okt = Okt()
            text = ' '.join(tokens)
            nouns = okt.nouns(text)
            return nouns
        except:
            return [token for token in tokens if len(token) > 1]

    def extract_verbs(self, tokens):
        try:
            from konlpy.tag import Okt
            okt = Okt()
            text = ' '.join(tokens)
            pos_tags = okt.pos(text)
            verbs = [word for word, tag in pos_tags if tag in ['Verb', 'VV', 'VA']]
            return verbs
        except:
            return []

    def extract_adjectives(self, tokens):
        try:
            from konlpy.tag import Okt
            okt = Okt()
            text = ' '.join(tokens)
            pos_tags = okt.pos(text)
            adjectives = [word for word, tag in pos_tags if tag in ['Adjective', 'VA']]
            return adjectives
        except:
            return []
