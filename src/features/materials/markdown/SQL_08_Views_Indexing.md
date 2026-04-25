# Views, Indexing & Optimization

> Database views, indexing techniques, and query optimization strategies.

---

## Views

A virtual table based on a query result.

### Regular View
```sql
CREATE VIEW indian_customers AS
SELECT * FROM customers WHERE country = 'India';

-- Use view
SELECT * FROM indian_customers WHERE age > 18;
```

### Materialized View
```sql
-- Stores query result on disk
CREATE MATERIALIZED VIEW it_employees AS
SELECT e.first_name, e.last_name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id
WHERE d.department_name = 'IT';

-- Refresh manually
REFRESH MATERIALIZED VIEW it_employees;
```

### View vs Materialized View

| Feature | View | Materialized View |
|---------|------|------------------|
| Data Storage | No | Yes |
| Performance | Slower | Faster |
| Updates | Real-time | On refresh |

---

## Indexing

### Create Index
```sql
-- Single column
CREATE INDEX idx_salary ON employees(salary);

-- Multiple columns
CREATE INDEX idx_name ON employees(first_name, last_name);
```

### Index Seek vs Scan

| Type | Description |
|------|-------------|
| **Index Seek** | Direct lookup using B-tree |
| **Index Scan** | Full index scan |

---

## Index Types

| Type | Description |
|------|-------------|
| **Clustered** | Physical order (one per table) |
| **Non-Clustered** | Pointer structure (multiple per table) |

---

## Optimization Techniques

1. **Use specific columns** - Avoid `SELECT *`

2. **Proper Joins** - Use `INNER JOIN` when possible

3. **WHERE Clauses** - Filter early

4. **Indexing** - On frequently queried columns

5. **Query Execution Plan**
```sql
EXPLAIN SELECT * FROM employees WHERE salary > 50000;
```

6. **Partitioning**
```sql
CREATE TABLE orders (
    orderid INT,
    customerid INT,
    orderdate DATE
)
PARTITION BY RANGE (YEAR(orderdate)) (
    PARTITION p2022 VALUES LESS THAN (2023),
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION pmax VALUES LESS THAN MAXVALUE
);
```

7. **CTEs** - Better than subqueries

8. **Materialized Views** - For complex queries

---

## Cron Jobs for Refresh

| Expression | Schedule |
|------------|----------|
| `* * * * *` | Every minute |
| `0 * * * *` | Every hour |
| `0 0 * * *` | Daily midnight |
| `0 0 * * FRI` | Friday midnight |
| `0 0 1 * *` | 1st of month |

---

## OLTP vs OLAP

| Feature | OLTP | OLAP |
|--------|-----|-----|
| Purpose | Transactions | Analytics |
| Normalization | High | Low |
| Databases | MySQL, PostgreSQL | Redshift, Snowflake |
| Operations | Insert, Update | Select, Aggregate |

---

## Star Schema

- Central fact table
- Surrounding dimension tables
- Denormalized data

```
    [Dimension: Customer]
           |
    [Fact: Sales] ---- [Dimension: Product]
           |
    [Dimension: Date]
```

---

## Cheat Sheet

| Technique | Use |
|-----------|-----|
| `CREATE VIEW` | Virtual table |
| `CREATE INDEX` | Speed up queries |
| `PARTITION BY` | Split large tables |
| `EXPLAIN` | Analyze query |
| CTE | Cleaner code |