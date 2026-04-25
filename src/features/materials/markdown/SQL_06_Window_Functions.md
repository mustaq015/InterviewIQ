# Window Functions

> Perform calculations across related rows without grouping. Includes RANK, DENSE_RANK, ROW_NUMBER, LAG, LEAD.

---

## What are Window Functions?

Window functions perform calculations across a set of rows related to the current row, unlike aggregate functions that collapse rows.

**Key Difference:**
- Aggregates: Return one row per group
- Window Functions: Return all rows with calculations

```sql
FUNCTION() OVER (
    PARTITION BY column
    ORDER BY column
)
```

---

## Ranking Functions

| Function | Description |
|----------|-------------|
| `RANK()` | Same rank, skips next (1,1,3) |
| `DENSE_RANK()` | No skip (1,1,2) |
| `ROW_NUMBER()` | Unique sequential (1,2,3) |

### Example Data
```sql
salary | RANK | DENSE_RANK | ROW_NUMBER
-------|-----|-----------|------------
50000  | 1   | 1         | 1
50000  | 1   | 1         | 2
45000  | 3   | 2         | 3
45000  | 3   | 2         | 4
20000  | 5   | 3         | 5
```

### Rank Employees by Salary
```sql
WITH ranked AS (
    SELECT employee_id, first_name, last_name, salary,
           RANK() OVER (ORDER BY salary DESC) AS rank,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank,
           ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num
    FROM employees
)
SELECT * FROM ranked;
```

### Second Highest Salary
```sql
WITH ranked AS (
    SELECT salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS ranking
    FROM employees
)
SELECT DISTINCT salary FROM ranked
WHERE ranking = 2;
```

### Rank by Department
```sql
WITH dept_ranked AS (
    SELECT department_id, employee_id, first_name, last_name, salary,
           DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS ranking
    FROM employees
)
SELECT * FROM dept_ranked
WHERE ranking = 2;
```

---

## LAG and LEAD

| Function | Description |
|----------|-------------|
| `LAG(column)` | Previous row value |
| `LEAD(column)` | Next row value |

### Previous Employee Salary
```sql
SELECT employee_id, first_name, salary,
       LAG(salary) OVER (ORDER BY hire_date) AS previous_salary
FROM employees;
```

### Next Employee Salary
```sql
SELECT employee_id, first_name, salary,
       LEAD(salary) OVER (ORDER BY hire_date) AS next_salary
FROM employees;
```

### Both Previous and Next
```sql
SELECT employee_id, first_name, salary,
       LAG(salary) OVER (ORDER BY hire_date) AS prev_salary,
       LEAD(salary) OVER (ORDER BY hire_date) AS next_salary
FROM employees;
```

### Salary Difference
```sql
SELECT employee_id, first_name, salary,
       salary - LAG(salary) OVER (ORDER BY hire_date) AS salary_growth
FROM employees;
```

---

## Running Total and Moving Average

### Running Total
```sql
SELECT employee_id, salary,
       SUM(salary) OVER (ORDER BY hire_date) AS running_total
FROM employees;
```

### Moving Average (Last 3)
```sql
SELECT employee_id, salary,
       AVG(salary) OVER (
           ORDER BY hire_date 
           ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ) AS moving_avg
FROM employees;
```

---

## Partition Examples

### Top 5 Sales by Region
```sql
WITH ranked AS (
    SELECT customerid, customername, region,
           SUM(salesamount) AS total_sales,
           DENSE_RANK() OVER (
               PARTITION BY region 
               ORDER BY SUM(salesamount) DESC
           ) AS ranking
    FROM sales
    GROUP BY customerid, customername, region
)
SELECT * FROM ranked
WHERE ranking <= 5;
```

### Sales Change from Previous
```sql
SELECT customerid, saledate, amount,
       amount - LAG(amount) OVER (
           PARTITION BY customerid 
           ORDER BY saledate
       ) AS sales_change
FROM sales;
```

### Days Between Transactions
```sql
SELECT customerid, saledate,
       LAG(saledate) OVER (
           PARTITION BY customerid 
           ORDER BY saledate
       ) AS previous_date,
       DATEDIFF(day, 
               LAG(saledate) OVER (
                   PARTITION BY customerid 
                   ORDER BY saledate
               ), 
               saledate
       ) AS days_between
FROM sales;
```

---

## Cheat Sheet

| Function | Use Case |
|----------|----------|
| `RANK()` | Rank with gaps |
| `DENSE_RANK()` | Rank without gaps |
| `ROW_NUMBER()` | Sequential numbers |
| `LAG()` | Previous row value |
| `LEAD()` | Next row value |
| `SUM() OVER()` | Running total |
| `AVG() OVER()` | Moving average |