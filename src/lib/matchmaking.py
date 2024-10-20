from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def find_top_matches(user_id, user_data, top_n=5):
    vectorizer = TfidfVectorizer()
    features = vectorizer.fit_transform([user["text"] for user in user_data])
    similarity_scores = cosine_similarity(features)

    user_index = user_id - 1
    similar_users = list(enumerate(similarity_scores[user_index]))
    similar_users = sorted(similar_users, key=lambda x: x[1], reverse=True)
    top_matches = [user_data[index]["user_id"] for index, _ in similar_users[1:top_n+1]]
    return top_matches