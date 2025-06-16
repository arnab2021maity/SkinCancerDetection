import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
import pickle

# Load the Excel file
df = pd.read_excel("GSE7553.xlsx")

# Transpose the data so samples are rows
df_t = df.T

# Set the first row as header (gene names), drop any rows with NaN
df_t.columns = df_t.iloc[0]  # First row becomes header
df_t = df_t.drop(df_t.index[0])

# Reset index for clean data
df_t.reset_index(inplace=True)

# Extract labels from the original index (column names in original df)
df_t["label"] = df_t["index"].apply(lambda name: name.split('.')[0].strip())

# Drop the original index column
df_t.drop(columns=["index"], inplace=True)

# Convert everything else to numeric (float), excluding the label
X = df_t.drop(columns=["label"]).astype(float)
y = df_t["label"]

# Scale the features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Encode labels
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

# Save the preprocessing objects
with open("scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)

with open("label_encoder.pkl", "wb") as f:
    pickle.dump(encoder, f)

print("✅ Preprocessing objects saved successfully!")
