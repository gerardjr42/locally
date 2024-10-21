import json
import sys
from http.server import BaseHTTPRequestHandler

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def find_top_matches(user_id, user_data):
    vectorizer = TfidfVectorizer()
    features = vectorizer.fit_transform([user["text"] for user in user_data])
    similarity_scores = cosine_similarity(features)

    user_index = user_id - 1
    similar_users = list(enumerate(similarity_scores[user_index]))
    similar_users = sorted(similar_users, key=lambda x: x[1], reverse=True)
    top_matches = [user_data[index]["user_id"] for index, _ in similar_users[1:]]
    return top_matches

if __name__ == "__main__":
    user_id = sys.argv[1]
    user_data = json.loads(sys.argv[2])
    result = find_top_matches(user_id, user_data)
    print(json.dumps(result))

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        user_id = data['userId']
        user_data = data['userData']
        
        result = find_top_matches(user_id, user_data)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(result).encode('utf-8'))
        return
