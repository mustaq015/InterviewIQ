# ETL Pipeline

This section covers building ETL pipelines with Pandas and medallion architecture.

## ETL Pipeline

```python
# Extract
df = pd.read_csv('data.csv')

# Transform
df.drop_duplicates(inplace=True)
df['Revenue'].fillna(df['Revenue'].mean(), inplace=True)
df['total_revenue'] = df['Revenue']
df['profit'] = df['Revenue'] - df['Expenses']

# Load
df.to_parquet('output.parquet')
```

## Medallion Architecture

- **Bronze Layer**: Raw data
- **Silver Layer**: Cleaned data (duplicates removed, nulls filled)
- **Gold Layer**: Aggregated data for reporting

## Validation Checks

1. Row count validation
2. Schema validation
3. Data type validation
4. Missing data validation
5. Wrong data validation

---

## Cheat Sheet

| Command | Description |
|---------|-------------|
| `pd.read_csv('file.csv')` | Extract |
| `df.drop_duplicates()` | Deduplicate |
| `df.fillna(value)` | Handle nulls |
| `df['col'].astype(type)` | Cast types |
| `df.to_parquet('file.parquet')` | Load to Parquet |
| `df.to_sql('table', conn)` | Load to DB |

### Medallion Architecture
| Layer | Description |
|-------|-------------|
| Bronze | Raw data |
| Silver | Cleaned data |
| Gold | Aggregated |