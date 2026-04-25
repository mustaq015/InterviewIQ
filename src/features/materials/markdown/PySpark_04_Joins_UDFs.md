# Joins and UDFs

This section covers joins and User Defined Functions in PySpark.

## Joins

```python
mergeddf = ordersdf.join(customer_df, on='customerid', how='inner')
newdf = mergeddf.select('CustomerID', 'Name', 'Quantity', 'Country')
```

## UDFs (User Defined Functions)

```python
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType, IntegerType, FloatType

def to_uppercase(s):
    return s.upper()

myudf = udf(to_uppercase, StringType())
df.withColumn('uppercase_name', myudf('Name'))
```

## SQL in PySpark

```python
employee_df.createOrReplaceTempView('employee')
spark.sql('SELECT * FROM employee WHERE department = "HR"').show()
spark.sql('SELECT department, avg(salary) FROM employee GROUP BY department').show()
```

---

## Cheat Sheet

### Joins
| Command | Description |
|---------|-------------|
| `df1.join(df2, on, 'inner')` | Inner join |
| `df1.join(df2, on, 'left')` | Left join |
| `df1.join(df2, on, 'right')` | Right join |
| `df1.join(df2, on, 'outer')` | Outer join |
| `broadcast(df)` | Broadcast join |

### UDFs
| Command | Description |
|---------|-------------|
| `udf(func, returnType)` | Create UDF |
| `from pyspark.sql.types import *` | Import types |
| `df.withColumn('col', udf(col))` | Apply UDF |

### SQL Operations
| Command | Description |
|---------|-------------|
| `df.createOrReplaceTempView('name')` | Create view |
| `spark.sql('query')` | Run SQL |
| `.show()` | Display results |