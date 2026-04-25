# Pandas DataFrame Operations

> Creating Series and DataFrames, handling missing data in Pandas.

---

## What is Pandas?

Pandas is a data cleaning and manipulation framework:

1. Missing data
2. Duplicate data
3. Wrong data type
4. Wrong data

---

## Series

One-dimensional array:

```python
import pandas as pd

a = [1, 7, 2]
s = pd.Series(a)

s[0]  # 1

# With custom index
s = pd.Series(a, index=['x', 'y', 'z'])
s['y']  # 7
```

---

## DataFrame

Two-dimensional (rows and columns):

```python
data = {
    "calories": [420, 10, 100, 50],
    "duration": [50, 5, 50, 65]
}
df = pd.DataFrame(data)
```

---

## Read Data

```python
df = pd.read_csv('data.csv')
df.head()    # First 5 rows
df.tail()    # Last 5 rows
df.info()     # Schema info
```

---

## Read JSON

```python
df = pd.read_json('data.json')
```

---

## Missing Data

| Method | Description |
|--------|-------------|
| `fillna(value)` | Fill missing with value |
| `dropna()` | Remove rows with missing |
| `mean()` | Replace with average |
| `median()` | Replace with middle value |
| `mode()` | Replace with most common |

```python
df.fillna(130, inplace=True)
df.dropna(inplace=True)
df['column'].fillna(df['column'].mean(), inplace=True)
```

---

## Cheat Sheet

| Command | Description |
|---------|-------------|
| `pd.Series()` | Create Series |
| `pd.DataFrame()` | Create DataFrame |
| `read_csv()` | Load CSV |
| `head()`/`tail()` | View data |
| `fillna()` | Fill missing |
| `dropna()` | Remove missing |