import sys
import json
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB

from transformers import pipeline

# ---------------------------
# STEP 1: Load dataset
# ---------------------------

data = pd.read_csv("grievance_dataset.csv")

texts = data["text"]
labels = data["category"]

# ---------------------------
# STEP 2: Convert text to numbers
# ---------------------------

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)

# ---------------------------
# STEP 3: Train classifier
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
# STEP 5: Read complaint
# ---------------------------

complaint = sys.argv[1]

# ---------------------------
# STEP 6: Predict category
# ---------------------------

complaint_vector = vectorizer.transform([complaint])
category = model.predict(complaint_vector)[0]

# ---------------------------

# STEP 7: Sentiment
# ---------------------------

sentiment = sentiment_model(complaint)[0]["label"]



# ---------------------------
# STEP 7: Issue detection
# ---------------------------

complaint_lower = complaint.lower()

if sentiment == "POSITIVE":
    issue = "No issue detected"

else:

    if "fan" in complaint_lower:
        issue = "Fan not working"

    elif "wifi" in complaint_lower or "internet" in complaint_lower:
        issue = "Internet issue"

    elif "food" in complaint_lower or "mess" in complaint_lower:
        issue = "Food quality issue"

    elif "water" in complaint_lower:
        issue = "Water supply problem"

    elif "light" in complaint_lower or "electric" in complaint_lower:
        issue = "Electrical problem"

    elif "library" in complaint_lower:
        issue = "Library infrastructure issue"

    else:
        issue = "General complaint"

# ---------------------------
# STEP 8: Priority
# ---------------------------

priority = "High" if sentiment == "NEGATIVE" else "Low"

# ---------------------------
# STEP 9: Return result
# ---------------------------

result = {
 "category": category,
 "issue": issue,
 "sentiment": sentiment,
 "priority": priority
}

print(json.dumps(result))