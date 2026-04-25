# Transformations

This section covers DataFrame transformations in PySpark including filtering, joins, and conditional columns.

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

## Joins

```python
mergeddf = ordersdf.join(customer_df, on='customerid', how='inner')
newdf = mergeddf.select('CustomerID', 'Name', 'Quantity', 'Country')
```

## Data Handling

```python
# Read from S3
df = spark.read.csv('s3://bucket/path', header=True, inferSchema=True)

# Write to S3
df.write.mode('overwrite').parquet('s3://bucket/path')

# Read from JDBC
properties = {
    'user': 'username',
    'password': 'password',
    'driver': 'com.mysql.cj.jdbc.Driver'
}
df = spark.read.jdbc(url='jdbc:mysql://host:3306/db', table='table', properties=properties)
```

### Handling Duplicates
```python
df = df.dropDuplicates()
```

### Handling Nulls
```python
df = df.fillna({'age': 30, 'salary': 50000})
```

### Conditional Columns
```python
from pyspark.sql.functions import when

df = df.withColumn(
    'salarycategory',
    when(col('salary') < 50000, 'Low')
    .when((col('salary') >= 50000) & (col('salary') < 60000), 'Medium')
    .otherwise('High')
)
```

## Real-world Examples

### E-commerce Pipeline

```python
# Extract data
customerdf = spark.read.jdbc(url, 'customers', properties)
ordersdf = spark.read.jdbc(url, 'orders', properties)
productsdf = spark.read.jdbc(url, 'products', properties)

# Transform
products_broadcast = productsdf.broadcast()
order_details = ordersdf.join(products_broadcast, 'product_id')
filtered = order_details.filter(col('quantity') > 1)
newdf = filtered.withColumn('total_price', col('quantity') * col('price'))

# Cache
newdf.cache()

# Aggregate
aggregated = newdf.groupBy('city', 'category').sum('total_price')

# Repartition
repartitioned = aggregated.repartition(4)
final = repartitioned.coalesce(1)

# Write
finaldf.write.mode('overwrite').parquet('s3://bucket/output')
```

---

## Cheat Sheet

### Transformations
| Command | Description |
|---------|-------------|
| `df.filter(condition)` | Filter rows |
| `df.select(col1, col2)` | Select columns |
| `df.withColumn(name, expr)` | Add column |
| `df.drop(col)` | Remove column |
| `df.dropDuplicates()` | Remove dupes |
| `df.orderBy(col)` | Sort data |
| `df.groupBy(col)` | Group by |
| `df.agg({'col': 'sum'})` | Aggregate |

### Joins
| Command | Description |
|---------|-------------|
| `df1.join(df2, on, how)` | Join DataFrames |
| `how='inner'` | Inner join |
| `how='left'` | Left join |
| `how='right'` | Right join |
| `how='outer'` | Outer join |
| `broadcast(df)` | Broadcast join |

### Data Handling
| Command | Description |
|---------|-------------|
| `df.fillna(value)` | Fill nulls |
| `df.dropna()` | Remove nulls |
| `df.na.fill(value)` | Fill NA |
| `when(condition, val)` | Conditional |