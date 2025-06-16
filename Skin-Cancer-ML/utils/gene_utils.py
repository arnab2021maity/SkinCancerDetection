import pandas as pd
from sklearn.preprocessing import StandardScaler

def preprocess_gene_excel(file):
    df = pd.read_excel(file, index_col=0).transpose()
    X = df.astype(float).values
    scaler = StandardScaler()
    return scaler.fit_transform(X)
