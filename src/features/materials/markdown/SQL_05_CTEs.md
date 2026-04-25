# Common Table Expressions (CTEs)

> Learn CTEs for cleaner, more readable SQL queries with virtual tables.

---

## What is a CTE?

A CTE (Common Table Expression) is a temporary named result set that exists only for the duration of a single query.

**Advantages:**
- Easier to read and maintain
- Optimizes query execution
- No data storage required

```sql
WITH cte_name AS (
    SELECT column1, column2
    FROM table
    WHERE condition
)
SELECT * FROM cte_name;
```

---

## Basic CTE Examples

### Filter High Earners
```sql
WITH high_earners AS (
    SELECT employee_id, first_name, last_name, salary
    FROM employees
    WHERE salary > 70000
)
SELECT * FROM high_earners
WHERE first_name LIKE 'A%' OR last_name LIKE 'A%'
ORDER BY salary DESC
LIMIT 1;
```

### Total Salary by Department
```sql
WITH dept_salary AS (
    SELECT department_id, SUM(salary) AS total_salary
    FROM employees
    GROUP BY department_id
)
SELECT * FROM dept_salary
WHERE total_salary > 80000;
```

### Average Salary by Department
```sql
WITH dept_avg AS (
    SELECT department_id, AVG(salary) AS average_salary
    FROM employees
    GROUP BY department_id
)
SELECT * FROM dept_avg;
```

---

## CTE vs Subquery

| Feature | CTE | Subquery |
|---------|-----|---------|
| Readability | More readable | Less readable |
| Reuse | Can reference multiple times | Single use |
| Performance | Optimized | May repeat |
| Complexity | Simple | Can become complex |

---

## Nested CTEs

```sql
WITH dept_salary AS (
    SELECT department_id, SUM(salary) AS total
    FROM employees
    GROUP BY department_id
),
qualifying_depts AS (
    SELECT * FROM dept_salary
    WHERE total > 150000
)
SELECT d.department_name, qs.total
FROM qualifying_depts qs
JOIN departments d ON qs.department_id = d.department_id;
```

---

## Recursive CTE

Used for hierarchical data (org charts, reporting structures):

```sql
WITH RECURSIVE org_chart AS (
    -- Base case: top-level employees
    SELECT employee_id, first_name, manager_id, 1 AS level
    FROM employees
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Recursive case: employees with managers
    SELECT e.employee_id, e.first_name, e.manager_id, oc.level + 1
    FROM employees e
    JOIN org_chart oc ON e.manager_id = oc.employee_id
)
SELECT * FROM org_chart;
```

---

## Cheat Sheet

| Syntax | Description |
|--------|-------------|
| `WITH cte AS (...)` | Define CTE |
| `SELECT * FROM cte` | Use CTE |
| Multiple CTEs | Chain with commas |
| `RECURSIVE` | For hierarchies |