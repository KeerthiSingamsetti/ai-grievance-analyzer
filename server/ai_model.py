import sys
import json
import re
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from transformers import pipeline
import nltk
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
from nltk.tokenize import sent_tokenize

# ---------------------------
# STEP 1: Load dataset
# ---------------------------
data   = pd.read_csv("grievance_dataset.csv")
texts  = data["text"]
labels = data["category"]

# ---------------------------
# STEP 2: TF-IDF with bigrams
# ---------------------------
vectorizer = TfidfVectorizer(
    ngram_range=(1, 2),
    min_df=1,
    sublinear_tf=True
)
X = vectorizer.fit_transform(texts)

# ---------------------------
# STEP 3: Train Naive Bayes
# ---------------------------
model = MultinomialNB()
model.fit(X, labels)

# ---------------------------
# STEP 4: Sentiment model
# ---------------------------
sentiment_model = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

# ---------------------------
# STEP 5: Text cleaner
# cleans up messy split sentences
# professionally ✅
# ---------------------------
def clean_sentence(sentence):
    # remove extra dots and spaces
    sentence = re.sub(r'\s+\.', '', sentence)
    sentence = re.sub(r'\.+', '', sentence)
    sentence = re.sub(r'\s+', ' ', sentence)
    sentence = sentence.strip()

    # capitalize first letter
    sentence = sentence[0].upper() + sentence[1:] if sentence else sentence

    return sentence

# ---------------------------
# STEP 6: Smart clause splitter
# ---------------------------
def split_into_clauses(text):

    text = re.sub(
        r'\b(but|however|also|although|though|yet|whereas|moreover|furthermore)\b',
        '. ',
        text,
        flags=re.IGNORECASE
    )

    text = re.sub(r',', '. ', text)
    text = re.sub(r'\band\b', '. ', text, flags=re.IGNORECASE)
    text = re.sub(r'\.[\s\.]+', '. ', text)
    text = text.strip()

    sentences = sent_tokenize(text)
    return [s.strip() for s in sentences if len(s.strip()) > 8]

# ---------------------------
# STEP 7: Read complaint
# ---------------------------
complaint = sys.argv[1]

# ---------------------------
# STEP 8: Split into clauses
# ---------------------------
clauses = split_into_clauses(complaint)

# ---------------------------
# STEP 9: Analyze each clause
# ---------------------------
issues_found = []
departments  = []

for clause in clauses:

    sentiment = sentiment_model(clause)[0]["label"]

    if sentiment == "POSITIVE":
        continue

    category = model.predict(
        vectorizer.transform([clause])
    )[0]

    priority = "High" if sentiment == "NEGATIVE" else "Low"

    # clean the sentence instead of issue label ✅
    clean = clean_sentence(clause)

    issues_found.append({
        "issue"    : clean,       # clean sentence AS the issue ✅
        "category" : category,
        "sentiment": sentiment,
        "priority" : priority
    })

    if category not in departments:
        departments.append(category)

# ---------------------------
# STEP 10: Overall priority
# ---------------------------
overall_priority = "High" if any(
    i["priority"] == "High" for i in issues_found
) else "Low"

# ---------------------------
# STEP 11: Final result
# ---------------------------
result = {
    "total_issues"         : len(issues_found),
    "overall_priority"     : overall_priority,
    "departments_to_notify": departments,
    "issues"               : issues_found
}

print(json.dumps(result, indent=2))