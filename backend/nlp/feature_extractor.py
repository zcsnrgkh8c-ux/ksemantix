from collections import Counter
import re

class FeatureExtractor:
    def __init__(self):
        self.common_catchphrases = []
    
    def extract_word_frequencies(self, dialogues):
        word_freq = Counter()
        
        for dialogue in dialogues:
            if not dialogue.normalized_text:
                continue
            
            tokens = dialogue.normalized_text.split()
            tokens = [token for token in tokens if len(token) > 1 and re.match(r'^[가-힣]+$', token)]
            word_freq.update(tokens)
        
        return dict(word_freq.most_common(100))
    
    def extract_nouns(self, dialogues):
        noun_freq = Counter()
        
        for dialogue in dialogues:
            if not dialogue.original_text:
                continue
            
            try:
                from konlpy.tag import Okt
                okt = Okt()
                nouns = okt.nouns(dialogue.original_text)
                noun_freq.update(nouns)
            except:
                tokens = dialogue.original_text.split()
                noun_freq.update([t for t in tokens if len(t) > 1])
        
        return dict(noun_freq.most_common(50))
    
    def extract_verbs(self, dialogues):
        verb_freq = Counter()
        
        for dialogue in dialogues:
            if not dialogue.original_text:
                continue
            
            try:
                from konlpy.tag import Okt
                okt = Okt()
                pos_tags = okt.pos(dialogue.original_text)
                verbs = [word for word, tag in pos_tags if tag in ['Verb', 'VV', 'VA', 'VX']]
                verb_freq.update(verbs)
            except:
                pass
        
        return dict(verb_freq.most_common(50))
    
    def analyze_formality(self, dialogues):
        formal_count = 0
        informal_count = 0
        total_lines = 0
        
        formality_levels = []
        
        for dialogue in dialogues:
            total_lines += 1
            
            if dialogue.is_formal:
                formal_count += 1
            else:
                informal_count += 1
            
            if dialogue.formality_level is not None:
                formality_levels.append(dialogue.formality_level)
        
        avg_level = sum(formality_levels) / len(formality_levels) if formality_levels else 0
        
        return {
            'formal_count': formal_count,
            'informal_count': informal_count,
            'formal_ratio': formal_count / total_lines if total_lines > 0 else 0,
            'average_formality_level': round(avg_level, 2)
        }
    
    def analyze_sentence_lengths(self, dialogues):
        lengths = []
        
        for dialogue in dialogues:
            if dialogue.original_text:
                length = len(dialogue.original_text)
                lengths.append(length)
        
        return lengths
    
    def analyze_character_stats(self, dialogues):
        char_stats = {}
        
        for dialogue in dialogues:
            char = dialogue.character or 'Unknown'
            
            if char not in char_stats:
                char_stats[char] = {
                    'total_lines': 0,
                    'total_words': 0,
                    'avg_line_length': 0,
                    'formal_lines': 0,
                    'informal_lines': 0
                }
            
            char_stats[char]['total_lines'] += 1
            
            if dialogue.original_text:
                word_count = len(dialogue.original_text.split())
                char_stats[char]['total_words'] += word_count
            
            if dialogue.is_formal:
                char_stats[char]['formal_lines'] += 1
            else:
                char_stats[char]['informal_lines'] += 1
        
        for char in char_stats:
            stats = char_stats[char]
            if stats['total_lines'] > 0:
                stats['avg_line_length'] = round(stats['total_words'] / stats['total_lines'], 2)
        
        return char_stats
    
    def extract_catchphrases(self, dialogues):
        phrase_freq = Counter()
        
        for dialogue in dialogues:
            if not dialogue.original_text:
                continue
            
            text = dialogue.original_text
            
            patterns = [
                r'^[가-힣]+아/야[^\s]*',
                r'^[가-힣]+이/가[^\s]*',
                r'^[가-힣]+呀/耶[^\s]*',
                r'^[가-힣]+다[^\s]*',
            ]
            
            for pattern in patterns:
                matches = re.findall(pattern, text)
                phrase_freq.update(matches)
        
        common_phrases = phrase_freq.most_common(20)
        
        return [{
            'phrase': phrase,
            'count': count
        } for phrase, count in common_phrases]
