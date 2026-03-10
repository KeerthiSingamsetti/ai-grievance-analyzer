import sys
import json
import re
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from transformers import pipeline
import nltk
nltk.download('punkt',     quiet=True)
nltk.download('punkt_tab', quiet=True)
nltk.download('stopwords', quiet=True)
from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords

# ---------------------------
# STEP 1: Train category model (Naive Bayes)
# ---------------------------
cat_data   = pd.read_csv("grievance_dataset.csv")
cat_texts  = cat_data["text"]
cat_labels = cat_data["category"]

cat_vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1, sublinear_tf=True)
X_cat = cat_vectorizer.fit_transform(cat_texts)

cat_model = MultinomialNB()
cat_model.fit(X_cat, cat_labels)

# ---------------------------
# STEP 2: Train priority model (Logistic Regression)
# ---------------------------
pri_data   = pd.read_csv("priority_dataset.csv")
pri_texts  = pri_data["text"]
pri_labels = pri_data["priority"]

# Logistic Regression pipeline with its own TF-IDF vectorizer
priority_pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1, sublinear_tf=True)),
    ("lr",    LogisticRegression(max_iter=1000, C=1.0, random_state=42)),
])
priority_pipeline.fit(pri_texts, pri_labels)

# ---------------------------
# STEP 3: Sentiment model (DistilBERT)
# Used only for Positive/Negative label — NOT for priority anymore
# ---------------------------
sentiment_model = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

# ---------------------------
# STEP 4: Category → Department map
# ---------------------------
DEPT_MAP = {
    "Network"        : "Network",
    "Electrical"     : "Electrical",
    "Mess"           : "Mess",
    "Infrastructure" : "Infrastructure",
    "Academic"       : "Academic",
    "Administration" : "Administration",
    "General"        : "Administration",
}

# ---------------------------
# STEP 5: Text cleaner
# ---------------------------
def clean_sentence(sentence):
    sentence = re.sub(r'\s+\.', '', sentence)
    sentence = re.sub(r'\.+',   '', sentence)
    sentence = re.sub(r'\s+',   ' ', sentence)
    sentence = sentence.strip()
    if sentence:
        sentence = sentence[0].upper() + sentence[1:]
    return sentence

# ---------------------------
# STEP 6: Sentence splitter
# Only splits on full stops and semicolons — NOT commas or "and"
# ---------------------------
def split_into_sentences(text):
    text = re.sub(r'\.([A-Za-z])', r'. \1', text)
    text = re.sub(r';', '. ', text)
    text = re.sub(r'\.\s+', '. ', text)
    sentences = sent_tokenize(text)
    return [s.strip() for s in sentences if len(s.strip()) > 10]

# ---------------------------
# STEP 7: Deduplication
# ---------------------------
stop_words = set(stopwords.words('english'))

def get_keywords(text):
    words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
    return set(w for w in words if w not in stop_words)

def is_duplicate(new_issue, existing_issues, threshold=0.55):
    new_kw = get_keywords(new_issue)
    if not new_kw:
        return False
    for existing in existing_issues:
        existing_kw = get_keywords(existing["issue"])
        if not existing_kw:
            continue
        intersection = len(new_kw & existing_kw)
        union        = len(new_kw | existing_kw)
        similarity   = intersection / union if union > 0 else 0
        if similarity >= threshold:
            return True
    return False

# ---------------------------
# STEP 8: Read complaint
# ---------------------------
complaint = sys.argv[1]

# ---------------------------
# STEP 9: Split into sentences
# ---------------------------
sentences = split_into_sentences(complaint)

# ---------------------------
# STEP 10: Analyze each sentence
# ---------------------------
issues_found = []
departments  = []

for sentence in sentences:

    # sentiment (Positive/Negative label only)
    sentiment = sentiment_model(sentence)[0]["label"]

    # skip purely positive sentences
    if sentiment == "POSITIVE":
        continue

    # predict category using Naive Bayes
    category = cat_model.predict(
        cat_vectorizer.transform([sentence])
    )[0]

    # skip general filler
    if category == "General":
        continue

    # predict priority using Logistic Regression (ML — not keywords!)
    priority = priority_pipeline.predict([sentence])[0]

    clean = clean_sentence(sentence)

    # deduplication check
    if is_duplicate(clean, issues_found):
        continue

    issues_found.append({
        "issue"    : clean,
        "category" : category,
        "sentiment": sentiment,
        "priority" : priority,
    })

    dept = DEPT_MAP.get(category, category)
    if dept not in departments:
        departments.append(dept)

# ---------------------------
# STEP 11: Overall priority
# ---------------------------
overall_priority = "High" if any(
    i["priority"] == "High" for i in issues_found
) else "Low"

# ---------------------------
# STEP 12: Final result
# ---------------------------
result = {
    "total_issues"         : len(issues_found),
    "overall_priority"     : overall_priority,
    "departments_to_notify": departments,
    "issues"               : issues_found,
}

print(json.dumps(result, indent=2))