# PySpark Cheat Sheet

Quick reference for common PySpark operations.

### Setup
```python
from pyspark.sql import SparkSession
spark = SparkSession.builder.appName('app').getOrCreate()
```

### Read/Write
```python
spark.read.csv('path', header=True, inferSchema=True)
spark.read.parquet('path')
spark.read.jdbc(url, table, properties)
df.write.parquet('path')
df.write.mode('overwrite').parquet('path')
```

### Transformations
```python
df.filter(condition)
df.select('col1', 'col2')
df.withColumn('new', df['col'] * 2)
df.dropDuplicates()
df.dropna()
df.fillna(value)
df.orderBy('col')
```

### Aggregations
```python
df.groupBy('col').sum()
df.groupBy('col').avg()
df.groupBy('col').count()
df.groupBy('col').agg({'col': 'sum', 'col2': 'avg'})
```

### Joins
```python
df1.join(df2, on='key', how='inner')
df1.join(df2, (df1.key == df2.key), how='left')
df1.select('col').distinct()
```

### Window Functions
```python
from pyspark.sql.window import Window
from pyspark.sql.functions import dense_rank

window = Window.partitionBy('col').orderBy('col')
df.withColumn('rank', dense_rank().over(window))
```

### UDFs
```python
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType

myudf = udf(lambda x: x.upper(), StringType())
df.withColumn('upper', myudf('col'))
```