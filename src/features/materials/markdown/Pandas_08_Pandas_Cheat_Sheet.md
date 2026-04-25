# Pandas Cheat Sheet

Quick reference for common Pandas operations.

### Read Data
```python
pd.read_csv('file.csv')
pd.read_json('file.json')
pd.read_parquet('file.parquet')
pd.read_excel('file.xlsx')
```

### Inspect Data
```python
df.head()       # First 5 rows
df.tail()       # Last 5 rows
df.info()       # Schema
df.describe()  # Stats
df.shape       # Dimensions
df.columns     # Column names
```

### Missing Data
```python
df.dropna()                # Drop nulls
df.fillna(value)         # Fill nulls
df['col'].fillna(mean)    # Fill with mean
```

### Filtering
```python
df[df['col'] > value]
df[(df['col1'] > value) & (df['col2'] == 'text')]
```

### Aggregations
```python
df.groupby('col').sum()
df.groupby('col').mean()
df.groupby('col').count()
df.agg({'col': 'sum', 'col2': 'mean'})
```

### Joins
```python
pd.merge(df1, df2, on='key', how='inner')
pd.merge(df1, df2, on=['key1', 'key2'])
```

### Data Types
```python
df.dtypes
df['col'].astype(int)
df['col'].astype(str)
pd.to_datetime(df['col'])
```

### Export
```python
df.to_csv('file.csv')
df.to_parquet('file.parquet')
df.to_excel('file.xlsx')
```