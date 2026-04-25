# Reading & Processing Data

> Reading CSV files, handling data types, and transformations in Pandas.

---

## Reading CSV Files

```python
import pandas as pd

df = pd.read_csv('data.csv')
df.info()
df.head()
```

---

## Data Type Conversion

```python
# Convert date column
df['Date'] = pd.to_datetime(df['Date'])

# Format date
df['Date'] = pd.to_datetime(df['Date']).dt.strftime('%d-%m-%Y')
```

---

## Missing Data Handling

### Fill with Mean
```python
x = df['Calories'].mean()
df.fillna(x, inplace=True)
```

### Fill with Value
```python
df['Date'].fillna('1900/01/01', inplace=True)
df['Department'].fillna('unknown', inplace=True)
```

### Drop Duplicates
```python
df.drop_duplicates(inplace=True)
```

---

## Data Validation

| Validation | Description |
|------------|-------------|
| Row count | Expected vs actual rows |
| Schema | Column count |
| Data type | Expected vs actual types |
| Missing data | Count of nulls |
| Wrong data | Valid value checks |

---

## Fix Wrong Data

```python
for i in df.index:
    if df.loc[i, 'Duration'] > 120:
        df.loc[i, 'Duration'] = 120
```

---

## ETL Pipeline

### Extraction
```python
df = pd.read_csv('/path/to/file.csv')
```

### Transformation
```python
# Remove duplicates
df.drop_duplicates(inplace=True)

# Fill nulls
df['Revenue'].fillna(df['Revenue'].mean(), inplace=True)
df['Department'].fillna('unknown', inplace=True)

# Create calculated columns
df['profit'] = df['Revenue'] - df['Expenses']
df['gross_margin'] = (df['Revenue'] - df['COGS']) / df['Revenue']
```

### Loading
```python
df.to_parquet('output.parquet')
```

---

## File Formats

| Format | Use Case |
|--------|----------|
| CSV | Human readable |
| JSON | Web APIs |
| Parquet | Analytics, compressed |
| Excel | Spreadsheets |
| ORC | Hive/Hadoop |

---

## Medallion Architecture

| Layer | Description |
|-------|-------------|
| Bronze | Raw data |
| Silver | Cleaned/transformed |
| Gold | Aggregated for reporting |

---

## Cheat Sheet

| Command | Description |
|---------|-------------|
| `pd.read_csv()` | Load CSV |
| `to_datetime()` | Convert dates |
| `fillna()` | Fill missing |
| `drop_duplicates()` | Remove duplicates |
| `to_parquet()` | Save as Parquet |