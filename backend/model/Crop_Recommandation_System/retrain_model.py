"""
retrain_model.py
================
Run this ONCE to regenerate all .pkl files using your current
scikit-learn version (Python 3.10).

Usage:
    python retrain_model.py

Place this file next to Crop_recommendation.csv.
It will overwrite: RandomForest.pkl, DecisionTree.pkl,
NBClassifier.pkl, KNeighborsClassifier.pkl
"""

import pandas as pd
import numpy as np
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score
import warnings
warnings.filterwarnings('ignore')

# ── 1. Load data ──────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR, 'Crop_recommendation.csv')

print("Loading dataset...")
df = pd.read_csv(csv_path)
print(f"  Shape: {df.shape}")
print(f"  Crops : {df['label'].nunique()} unique labels")

features = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
target   = df['label']

# ── 2. Train / test split ─────────────────────────────────────────────────────
Xtrain, Xtest, Ytrain, Ytest = train_test_split(
    features, target, test_size=0.2, random_state=2
)

# ── 3. Helper to save a model ─────────────────────────────────────────────────
def save_model(model, filename):
    path = os.path.join(BASE_DIR, filename)
    with open(path, 'wb') as f:
        pickle.dump(model, f)
    print(f"  Saved → {filename}")

# ── 4. Train and save each model ──────────────────────────────────────────────

print("\n[1/4] Training Random Forest...")
RF = RandomForestClassifier(n_estimators=20, random_state=5)
RF.fit(Xtrain, Ytrain)
acc = accuracy_score(Ytest, RF.predict(Xtest))
print(f"  Accuracy: {acc*100:.2f}%")
save_model(RF, 'RandomForest.pkl')

print("\n[2/4] Training Decision Tree...")
DT = DecisionTreeClassifier(criterion="entropy", random_state=2, max_depth=5)
DT.fit(Xtrain, Ytrain)
acc = accuracy_score(Ytest, DT.predict(Xtest))
print(f"  Accuracy: {acc*100:.2f}%")
save_model(DT, 'DecisionTree.pkl')

print("\n[3/4] Training Naive Bayes...")
NB = GaussianNB()
NB.fit(Xtrain, Ytrain)
acc = accuracy_score(Ytest, NB.predict(Xtest))
print(f"  Accuracy: {acc*100:.2f}%")
save_model(NB, 'NBClassifier.pkl')

print("\n[4/4] Training KNN...")
KNN = KNeighborsClassifier(n_neighbors=5, metric='minkowski', p=2)
KNN.fit(Xtrain, Ytrain)
acc = accuracy_score(Ytest, KNN.predict(Xtest))
print(f"  Accuracy: {acc*100:.2f}%")
save_model(KNN, 'KNeighborsClassifier.pkl')

print("\nAll models retrained and saved successfully!")
print("Now run: python webapp.py")
