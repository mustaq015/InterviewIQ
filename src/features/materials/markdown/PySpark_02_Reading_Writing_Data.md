# Reading and Writing Data

This section covers reading and writing data in various formats in PySpark.

## Reading Data

```python
df = spark.read.csv('path', header=True, inferSchema=True)
df = spark.read.parquet('path')
df = spark.read.json('path')
```

## Basic Operations

```python
# Filter
newdf = df.filter(df['longitude'] < -123)

# Add column
df = df.withColumn('sumdata', df['longitude'] + df['latitude'])

# Drop duplicates
newdf = mergeddf.dropDuplicates(['customerid'])

# Sort
newdf = mergeddf.orderBy('Quantity', ascending=True)
```

## Writing Data

```python
df.write.parquet('path')
df.write.csv('path', header=True)
df.write.mode('overwrite').parquet('path')
```

## Schema Definition

```python
from pyspark.sql.types import StructType, StructField, StringType, IntegerType

schema = StructType([
    StructField('customer_id', IntegerType(), True),
    StructField('customer_name', StringType(), True),
    StructField('city', StringType(), True)
])
df = spark.createDataFrame(data, schema)
```

## JDBC Connections

```python
df = spark.read.jdbc(url=url, table='table_name', properties=properties)
df.write.jdbc(url=url, table='table_name', mode='overwrite', properties=properties)
```

---

## Cheat Sheet

### Reading
| Command | Description |
|---------|-------------|
| `spark.read.csv(path)` | Read CSV |
| `spark.read.parquet(path)` | Read Parquet |
| `spark.read.json(path)` | Read JSON |
| `spark.read.jdbc(url, table)` | Read JDBC |
| `header=True` | Has header |
| `inferSchema=True` | Auto-detect type |

### Writing
| Command | Description |
|---------|-------------|
| `df.write.csv(path)` | Write CSV |
| `df.write.parquet(path)` | Write Parquet |
| `df.write.mode('overwrite')` | Overwrite mode |
| `df.write.mode('append')` | Append mode |
| `df.write.jdbc(url, table)` | Write JDBC |

### Schema
| Type | Description |
|------|-------------|
| `StructType` | Row schema |
| `StructField` | Column field |
| `StringType` | String |
| `IntegerType` | Integer |