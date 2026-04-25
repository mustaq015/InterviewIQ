# SQL Joins

> Learn different types of SQL joins including INNER, LEFT, RIGHT, FULL OUTER, and self joins.

---

## Join Types Overview

| Join Type | Description |
|----------|-------------|
| **INNER JOIN** | Returns matching elements from both tables |
| **LEFT JOIN** | All from left + matching from right (NULL for no match) |
| **RIGHT JOIN** | All from right + matching from left (NULL for no match) |
| **FULL OUTER JOIN** | All from both tables (NULL where no match) |
| **SELF JOIN** | Join table to itself |

---

## Visual Representation

```
Table A    | Table B
-----------+----------
1          | 1
1          | 1
null       | 2
2          | null
null      | 3
4          | 2
```

| Join Type | Result |
|----------|--------|
| INNER | 1, 1, 1, 2, 2, 2 |
| LEFT | 1, 1, 1, 2, 2, 2, null, 4 |
| RIGHT | 1, 1, 1, 2, 2, 2, null, 3 |
| FULL | 1, 1, 1, 2, 2, 2, null, null, 4, 3 |

---

## Example Tables

### Employee Table
```sql
employee
id (pk) | name | id (salary) | employee_id (fk)
--------|------|-------------|-----------------
1       | a    | 1           | 2
2       | b    | 2           | 4
3       | c    | 3           | 1
4       | d    | 4           | null
```

---

## Inner Join

Returns only matching rows from both tables:

```sql
SELECT e.first_name, e.last_name, d.department_name
FROM employees e
JOIN departments d
ON e.department_id = d.department_id;
```

---

## Left Join

All employees + department info (NULL if no match):

```sql
SELECT e.first_name, d.department_name
FROM employees e
LEFT JOIN departments d
ON e.department_id = d.department_id;
```

Department data even with no employees:

```sql
SELECT d.department_name, e.first_name, e.last_name
FROM departments d
LEFT JOIN employees e
ON d.department_id = e.department_id;
```

---

## Right Join

All departments + employee info (NULL if no match):

```sql
SELECT e.first_name, d.department_name
FROM employees e
RIGHT JOIN departments d
ON e.department_id = d.department_id;
```

---

## Multiple Joins

Join across three tables:

```sql
SELECT e.first_name, e.last_name, d.department_name, j.job_title
FROM employees e
JOIN departments d ON e.department_id = d.department_id
JOIN jobs j ON e.job_id = j.job_id;
```

---

## Self Join

Find employees earning more than their manager:

```sql
-- Employee table with managerid
employee
employeeid | firstname | lastname | salary | managerid
----------|----------|---------|--------|----------
1         | a       | b       | 35000  | null
2         | c       | d       | 20000  | 1
3         | e       | f       | 30000  | 1
4         | g       | h       | 40000  | 2
```

```sql
SELECT e.firstname, e.lastname, e.salary AS employee_salary,
       m.firstname AS manager_name, m.salary AS manager_salary
FROM employees e
JOIN employees m ON e.managerid = m.employeeid
WHERE e.salary > m.salary;
```

---

## Department Change Tracking

Find employees who changed departments:

```sql
SELECT e.first_name, e.last_name,
       d1.department_name AS previous_department,
       d2.department_name AS current_department
FROM employees e
JOIN job_history jh1 ON e.employee_id = jh1.employee_id
JOIN departments d1 ON jh1.department_id = d1.department_id
JOIN job_history jh2 ON jh2.employee_id = e.employee_id
JOIN departments d2 ON jh2.department_id = d2.department_id
WHERE jh1.end_date IS NOT NULL
  AND jh2.end_date IS NULL
  AND jh1.department_id <> jh2.department_id;
```

---

## IT Department Employees

```sql
SELECT e.first_name, e.last_name, d.department_name, j.job_title,
       jh.start_date, jh.end_date
FROM employees e
JOIN departments d ON e.department_id = d.department_id
JOIN job_history jh ON e.employee_id = jh.employee_id
JOIN jobs j ON jh.job_id = j.job_id
WHERE d.department_name = 'IT';
```

---

## Cross Join

Combines all rows from both tables (Cartesian product):

```sql
SELECT t1.team_name AS team_a, t2.team_name AS team_b
FROM teams t1
CROSS JOIN teams t2;
```

Generate all unique team pairings (each team plays each other once):

```sql
SELECT t1.team_name AS team_a, t2.team_name AS team_b
FROM teams t1
JOIN teams t2 ON t1.team_id < t2.team_id;
```

---

## Cheat Sheet

| Join Type | Includes |
|----------|----------|
| `INNER JOIN` | Only matching rows |
| `LEFT JOIN` | All left + matching right |
| `RIGHT JOIN` | All right + matching left |
| `FULL OUTER` | All rows from both |
| `CROSS JOIN` | Cartesian product |
| `SELF JOIN` | Table to itself |