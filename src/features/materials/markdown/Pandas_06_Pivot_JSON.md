# Pivot and JSON

This section covers pivot tables and JSON normalization in Pandas.

## Pivot

```python
newdf = df.pivot(index='date', columns='city', values='temperature')
```

## JSON Normalize

```python
df = pd.json_normalize(data)
df = pd.json_normalize(data2, record_path='orders', meta=['id', 'name'])
```

---

## Cheat Sheet

| Command | Description |
|---------|-------------|
| `df.pivot(index, columns, values)` | Pivot table |
| `df.pivot_table(aggfunc=...)` | Pivot with agg |
| `df.melt()` | Unpivot |
| `pd.json_normalize(data)` | Flatten JSON |
| `pd.json_normalize(record_path)` | Nested JSON |
| `df.stack() / df.unstack()` | Stack/Unstack |