# PySpark Session

> Getting started with PySpark DataFrames and basic operations.

---

## Installation

```python
!pip install pyspark
```

---

## Create SparkSession

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName('app').getOrCreate()
```

---

## Create DataFrame

```python
data = [(1, 'krish'), (2, 'ajay'), (3, 'james')]
columns = ['id', 'name']

df = spark.createDataFrame(data, columns)
df.show()
df.printSchema()
```

---

## Read Data

```python
df = spark.read.csv('file.csv', header=True, inferSchema=True)
df.show()
df.printSchema()
```

| Parameter | Description |
|-----------|-------------|
| `header=True` | First row is header |
| `inferSchema=True` | Auto-detect types |

---

## Basic Operations

### Filter
```python
newdf = df.filter(df['column'] < value)
newdf.show()
```

### Add Column
```python
df = df.withColumn('new_col', df['col1'] + df['col2'])
df.show()
```

### Select Columns
```python
newdf = df.select('col1', 'col2')
newdf.show()
```

---

## Joins

```python
merged = orders_df.join(
    customers_df,
    on='customerid',
    how='inner'
)
merged.show()
```

---

## Group By

```python
grouped = df.groupBy('column').count()
grouped.show()
```

---

## Cheat Sheet

| Command | Description |
|---------|-------------|
| `SparkSession` | Start Spark |
| `createDataFrame()` | Create DataFrame |
| `read.csv()` | Load CSV |
| `filter()` | Filter rows |
| `withColumn()` | Add column |
| `join()` | Join DataFrames |
| `groupBy()` | Aggregate |