# Aggregations and Grouping

> Learn GROUP BY, HAVING, and aggregate functions for data analysis.

---

## GROUP BY

Group rows and apply aggregate functions:

### Basic Syntax
```sql
SELECT column, aggregate_function(column)
FROM table
GROUP BY column;
```

### Average Salary by Department
```sql
SELECT d.department_name, 
       AVG(e.salary) AS average_salary,
       COUNT(e.employee_id) AS employee_count
FROM employees e
JOIN departments d ON e.department_id = d.department_id
GROUP BY d.department_name;
```

### Count by Department
```sql
SELECT d.department_name, 
       COUNT(e.employee_id) AS employee_count
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id
GROUP BY d.department_name;
```

### Total Salary by Department
```sql
SELECT department_id, SUM(salary) AS total_salary
FROM employees
GROUP BY department_id;
```

---

## HAVING

Filter groups after aggregation (like WHERE but for groups):

```sql
SELECT department_id, SUM(salary) AS total_salary
FROM employees
GROUP BY department_id
HAVING SUM(salary) > 80000;
```

### Difference: WHERE vs HAVING

| Clause | Filters | Applied |
|--------|---------|----------|
| `WHERE` | Individual rows | Before grouping |
| `HAVING` | Groups | After grouping |

---

## Common Aggregates

| Function | Description |
|----------|-------------|
| `COUNT(*)` | Count all rows |
| `COUNT(column)` | Count non-null values |
| `SUM(column)` | Sum of values |
| `AVG(column)` | Average |
| `MIN(column)` | Minimum |
| `MAX(column)` | Maximum |

---

## Employee Analysis Examples

### Newest Hire
```sql
SELECT first_name, last_name, hire_date
FROM employees
WHERE hire_date = (SELECT MAX(hire_date) FROM employees);
```

### Salary Above Average
```sql
SELECT first_name, last_name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

### First Hired Employee
```sql
SELECT first_name, last_name, hire_date
FROM employees
ORDER BY hire_date
LIMIT 1;
```

### Top 2 Highest Salary
```sql
SELECT first_name, last_name, salary
FROM employees
ORDER BY salary DESC
LIMIT 2;
```

---

## Data Modification Commands

### DROP vs TRUNCATE vs DELETE

| Command | Effect | Can Rollback |
|---------|--------|-------------|
| `DROP` | Delete table/database | No |
| `TRUNCATE` | Delete all rows | No |
| `DELETE` | Delete rows with condition | Yes |

```sql
-- Delete specific rows
DELETE FROM employees WHERE employee_id = 105;

-- Delete all rows (can rollback)
DELETE FROM employees;

-- Delete all rows (cannot rollback)
TRUNCATE TABLE employees;

-- Delete table completely
DROP TABLE employees;
```

---

## Cheat Sheet

| Command | Use For |
|---------|--------|
| `GROUP BY` | Aggregate by category |
| `HAVING` | Filter aggregated results |
| `COUNT` | Count rows |
| `SUM` | Add values |
| `AVG` | Calculate average |
| `MIN/MAX` | Find extremes |
| `WHERE` | Filter before group |
| `HAVING` | Filter after group |