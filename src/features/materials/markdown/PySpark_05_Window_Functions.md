# Window Functions

This section covers window functions in PySpark for analytical queries.

## Window Functions

```python
from pyspark.sql.window import Window
from pyspark.sql.functions import dense_rank, rank, row_number, lag, lead

window_spec = Window.partitionBy(col('department')).orderBy(col('salary').desc())
ranked_df = employee_df.withColumn('rank', dense_rank().over(window_spec))
```

## Window Functions in SQL

```python
employee_df.createOrReplaceTempView('employee')
spark.sql('SELECT * FROM employee WHERE department = "HR"').show()
spark.sql('SELECT department, avg(salary) FROM employee GROUP BY department').show()
```

---

## Cheat Sheet

| Command | Description |
|---------|-------------|
| `Window.partitionBy(col)` | Partition window |
| `Window.orderBy(col)` | Order window |
| `dense_rank()` | Dense rank |
| `rank()` | Rank (gaps) |
| `row_number()` | Row number |
| `lag(col)` | Previous row |
| `lead(col)` | Next row |
| `sum(col).over(window)` | Running sum |
| `avg(col).over(window)` | Running avg |

### SQL Window Functions
```sql
SELECT *, RANK() OVER (PARTITION BY dept ORDER BY salary DESC)
FROM employee
```