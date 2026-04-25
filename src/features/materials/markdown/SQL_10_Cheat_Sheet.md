# SQL Complete Cheat Sheet

> Comprehensive reference for all SQL concepts and commands.

---

## Basic Queries

| Command | Description |
|---------|-------------|
| `SELECT * FROM table` | Select all columns |
| `SELECT col1, col2 FROM table` | Select specific columns |
| `WHERE condition` | Filter results |
| `ORDER BY col ASC/DESC` | Sort results |
| `LIMIT n` | Limit rows |

---

## Operators

| Operator | Description |
|----------|-------------|
| `=` | Equal |
| `!=` or `<>` | Not equal |
| `>` | Greater than |
| `<` | Less than |
| `>=` | Greater or equal |
| `<=` | Less or equal |
| `AND` | Both conditions |
| `OR` | Either condition |
| `NOT` | Negation |

---

## Joins

| Join Type | Description |
|----------|-------------|
| `INNER JOIN` | Matching rows |
| `LEFT JOIN` | All left + matching right |
| `RIGHT JOIN` | All right + matching left |
| `FULL OUTER` | All rows |
| `CROSS JOIN` | Cartesian product |
| `SELF JOIN` | Table to itself |

---

## Aggregates

| Function | Description |
|----------|-------------|
| `COUNT(*)` | Count rows |
| `SUM(col)` | Sum values |
| `AVG(col)` | Average |
| `MIN(col)` | Minimum |
| `MAX(col)` | Maximum |

---

## Window Functions

| Function | Description |
|----------|-------------|
| `RANK()` | Rank with gaps |
| `DENSE_RANK()` | Rank without gaps |
| `ROW_NUMBER()` | Sequential |
| `LAG(col)` | Previous value |
| `LEAD(col)` | Next value |

---

## Data Types

| Type | Description |
|------|-------------|
| `INT` | Integer |
| `VARCHAR(n)` | Variable string |
| `DATE` | Date |
| `TIMESTAMP` | Date + time |
| `DECIMAL(p,s)` | Fixed precision |
| `BOOLEAN` | True/False |

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `PRIMARY KEY` | Unique identifier |
| `FOREIGN KEY` | Reference other table |
| `UNIQUE` | No duplicates |
| `NOT NULL` | Required |
| `DEFAULT` | Default value |

---

## Clauses Order

1. `SELECT` - Columns
2. `FROM` - Tables
3. `JOIN` - Relationships
4. `WHERE` - Filters
5. `GROUP BY` - Groups
6. `HAVING` - Group filters
7. `ORDER BY` - Sort
8. `LIMIT` - Limit

---

## Common Patterns

### Create Table
```sql
CREATE TABLE table_name (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Insert
```sql
INSERT INTO table (col1, col2) VALUES (val1, val2);
```

### Update
```sql
UPDATE table SET col = value WHERE id = 1;
```

### Delete
```sql
DELETE FROM table WHERE id = 1;
```

---

## CTEs
```sql
WITH cte AS (
    SELECT col FROM table WHERE cond
)
SELECT * FROM cte;
```

---

## Views
```sql
CREATE VIEW view_name AS
SELECT col FROM table WHERE cond;
```

---

## Stored Procedure
```sql
CREATE PROCEDURE proc_name @param INT
AS
BEGIN
    SELECT * FROM table WHERE col = @param;
END;
```