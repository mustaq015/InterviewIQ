# Spark Session and DataFrame

This section covers creating SparkSession and DataFrames in PySpark.

## Introduction to PySpark

PySpark is Apache Spark's Python API for distributed data processing.

## Creating Spark Session

```python
from pyspark.sql import SparkSession
spark = SparkSession.builder.appName('practice').getOrCreate()
```

## Creating DataFrames

```python
data = [(1, 'krish'), (2, 'ajay')]
columns = ['id', 'name']
df = spark.createDataFrame(data, columns)
df.show()
```

---

## Cheat Sheet

| Command | Description |
|---------|-------------|
| `SparkSession.builder` | Create session |
| `.appName('name')` | Set app name |
| `.getOrCreate()` | Get/create session |
| `spark.createDataFrame()` | Create DataFrame |
| `spark.createDataFrame(data, schema)` | With schema |
| `df.show()` | Display data |
| `df.printSchema()` | Show schema |
| `df.columns` | Column names |
| `df.dtypes` | Column types |