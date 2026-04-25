# Pandas: loc vs iloc

> Selecting data using loc (label-based) and iloc (position-based) in Pandas.

---

## loc vs iloc

| Feature | `loc` | `iloc` |
|---------|-------|--------|
| Selection | By label | By integer position |
| Slicing | Inclusive | Exclusive |
| Use | Names/keys | Index numbers |

---

## Basic Examples

```python
import pandas as pd

data = {
    "calories": [420, 10, 100, 50],
    "duration": [50, 5, 50, 65]
}
df = pd.DataFrame(data)

# loc: by label
df.loc[0, 'calories']     # 420
df.loc[0:2, 'calories']   # rows 0,1,2

# iloc: by position
df.iloc[0, 0]           # 420
df.iloc[0:2, 0]          # rows 0,1
```

---

## Combined Selection

```python
df.loc[2, 'Calories']
df.iloc[2, 1]
```

---

## Cheat Sheet

| Method | Syntax | Description |
|--------|-------|-------------|
| `loc` | `df.loc[row, col]` | By label |
| `iloc` | `df.iloc[row, col]` | By position |