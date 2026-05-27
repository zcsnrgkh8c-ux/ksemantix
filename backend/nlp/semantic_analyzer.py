from collections import defaultdict
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class SemanticAnalyzer:
    def __init__(self):
        self.model = None
        self.embedding_dim = 768

    def load_model(self):
        if self.model is None:
            try:
                from sentence_transformers import SentenceTransformer
                self.model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
                print("Sentence transformer model loaded successfully")
            except Exception as e:
                print(f"Failed to load sentence transformer model: {e}")
                self.model = "fallback"
        
        return self.model is not None

    def get_embeddings(self, texts):
        if not texts:
            return np.array([])
        
        if self.model == "fallback" or self.model is None:
            return self._get_fallback_embeddings(texts)
        
        try:
            embeddings = self.model.encode(texts)
            return embeddings
        except Exception as e:
            print(f"Error getting embeddings: {e}")
            return self._get_fallback_embeddings(texts)

    def _get_fallback_embeddings(self, texts):
        embeddings = []
        for text in texts:
            hash_value = hash(text) % 1000
            embedding = np.random.randn(self.embedding_dim)
            embedding = embedding / np.linalg.norm(embedding)
            embedding = embedding * (0.5 + hash_value / 1000)
            embeddings.append(embedding)
        
        return np.array(embeddings)

    def extract_character_patterns(self, dialogues):
        character_patterns = defaultdict(lambda: {
            'speech_samples': [],
            'total_lines': 0,
            'avg_length': 0,
            'formality_distribution': defaultdict(int)
        })
        
        for dialogue in dialogues:
            char = dialogue.character or 'Unknown'
            text = dialogue.original_text or ''
            
            character_patterns[char]['total_lines'] += 1
            character_patterns[char]['speech_samples'].append(text)
            
            if dialogue.is_formal:
                character_patterns[char]['formality_distribution']['formal'] += 1
            else:
                character_patterns[char]['formality_distribution']['informal'] += 1
        
        for char in character_patterns:
            samples = character_patterns[char]['speech_samples']
            character_patterns[char]['avg_length'] = sum(len(s) for s in samples) / len(samples) if samples else 0
            character_patterns[char]['speech_samples'] = samples[:20]
        
        return dict(character_patterns)

    def calculate_similarities(self, character_patterns):
        similarities = {}
        
        characters = list(character_patterns.keys())
        
        if len(characters) < 2:
            return similarities
        
        all_samples = []
        for char in characters:
            samples = character_patterns[char]['speech_samples'][:10]
            if not samples:
                samples = ['대화']
            all_samples.append(' '.join(samples))
        
        embeddings = self.get_embeddings(all_samples)
        
        if len(embeddings) == 0 or embeddings.shape[0] < 2:
            return self._calculate_fallback_similarities(character_patterns)
        
        try:
            similarity_matrix = cosine_similarity(embeddings)
            
            for i, char1 in enumerate(characters):
                similarities[char1] = {}
                for j, char2 in enumerate(characters):
                    if i != j:
                        similarities[char1][char2] = float(similarity_matrix[i][j])
        except Exception as e:
            print(f"Error calculating similarities: {e}")
            return self._calculate_fallback_similarities(character_patterns)
        
        return similarities

    def _calculate_fallback_similarities(self, character_patterns):
        similarities = {}
        characters = list(character_patterns.keys())
        
        for i, char1 in enumerate(characters):
            similarities[char1] = {}
            for j, char2 in enumerate(characters):
                if i != j:
                    freq1 = character_patterns[char1]['total_lines']
                    freq2 = character_patterns[char2]['total_lines']
                    base_similarity = 0.3
                    
                    if abs(freq1 - freq2) < 10:
                        base_similarity += 0.2
                    
                    form1 = character_patterns[char1]['formality_distribution']
                    form2 = character_patterns[char2]['formality_distribution']
                    
                    if form1.get('formal', 0) > form1.get('informal', 0) and \
                       form2.get('formal', 0) > form2.get('informal', 0):
                        base_similarity += 0.2
                    
                    similarities[char1][char2] = base_similarity
        
        return similarities

    def build_relationship_network(self, similarities):
        relationships = {}
        
        for char1, char_data in similarities.items():
            relationships[char1] = []
            
            sorted_similarities = sorted(char_data.items(), key=lambda x: x[1], reverse=True)
            
            for char2, similarity in sorted_similarities[:5]:
                if similarity > 0.2:
                    relationship_type = self._classify_relationship(similarity)
                    relationships[char1].append({
                        'character': char2,
                        'similarity': similarity,
                        'type': relationship_type
                    })
        
        return relationships

    def _classify_relationship(self, similarity):
        if similarity > 0.8:
            return 'very_close'
        elif similarity > 0.6:
            return 'close'
        elif similarity > 0.4:
            return 'moderate'
        elif similarity > 0.2:
            return 'distant'
        else:
            return 'unrelated'

    def find_similar_dialogues(self, dialogues, target_text, top_k=5):
        if not dialogues or not target_text:
            return []
        
        target_embedding = self.get_embeddings([target_text])
        
        dialogue_texts = [d.original_text for d in dialogues if d.original_text]
        
        if not dialogue_texts:
            return []
        
        dialogue_embeddings = self.get_embeddings(dialogue_texts)
        
        if len(target_embedding) == 0 or len(dialogue_embeddings) == 0:
            return []
        
        try:
            similarities = cosine_similarity(target_embedding, dialogue_embeddings)[0]
            
            top_indices = similarities.argsort()[-top_k:][::-1]
            
            results = []
            for idx in top_indices:
                results.append({
                    'dialogue': dialogues[idx],
                    'similarity': float(similarities[idx])
                })
            
            return results
        except Exception as e:
            print(f"Error finding similar dialogues: {e}")
            return []
