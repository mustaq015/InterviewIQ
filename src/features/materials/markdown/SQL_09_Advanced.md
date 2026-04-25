# Advanced SQL Topics

> Case statements, duplicates, normalization, data modeling, and advanced techniques.

---

## CASE Statement

Conditional logic in SQL:

```sql
-- Basic CASE
SELECT first_name, job_id, salary,
    CASE
        WHEN job_id = 'DEV01' THEN salary * 0.1
        WHEN job_id = 'HR01' THEN salary * 0.15
        ELSE 0
    END AS bonus
FROM employees;

-- Categorize by Salary
SELECT first_name, salary,
    CASE
        WHEN salary >= 85000 THEN 'High'
        WHEN salary BETWEEN 63000 AND 84000 THEN 'Medium'
        ELSE 'Low'
    END AS category
FROM employees;
```

---

## Finding Duplicates

### Method 1: GROUP BY + HAVING
```sql
SELECT email, COUNT(*)
FROM employees
GROUP BY email
HAVING COUNT(*) > 1;
```

### Method 2: Subquery
```sql
SELECT * FROM employees
WHERE email IN (
    SELECT email FROM employees
    GROUP BY email
    HAVING COUNT(*) > 1
);
```

### Method 3: ROW_NUMBER
```sql
WITH duplicates AS (
    SELECT employee_id, first_name, last_name, email,
           ROW_NUMBER() OVER (
               PARTITION BY first_name, last_name, email
               ORDER BY employee_id
           ) AS row_num
    FROM employees
)
SELECT * FROM duplicates WHERE row_num = 1;
```

### Remove Duplicates
```sql
DELETE FROM employee
WHERE id IN (
    SELECT id FROM (
        SELECT id,
               ROW_NUMBER() OVER (
                   PARTITION BY first_name, last_name, email
                   ORDER BY employee_id
               ) AS row_num
        FROM employee
    ) t
    WHERE row_num > 1
);
```

---

## Normalization Forms

### 1NF (First Normal Form)
- Remove duplicate columns
- Atomic values only

```
-- Not 1NF:
StudentID | StudentName | Courses
101      | Alice      | Math, Science

-- 1NF:
StudentID | Course      | Instructor
101      | Math       | Dr. Krish
101      | Science    | Dr. Ray
```

### 2NF (Second Normal Form)
- Must be in 1NF
- No partial dependencies on composite key

```
Student Table:
StudentID(pk) | studentName
101           | Alice

Course Table:
courseID | courseName | instructorName | studentID(fk)
1        | math      | krish         | 101
```

### 3NF (Third Normal Form)
- Must be in 2NF
- No transitive dependencies

```
A -> B -> C (transitive dependency)
```

---

## Data Modeling Types

### Conceptual Model
- High-level structure
- Entities and relationships

### Logical Model
- Detailed relationships
- No implementation details

### Physical Model
- Actual storage
- Data types, indexing

---

## UNION vs UNION ALL

```sql
-- Removes duplicates
SELECT country FROM customers
UNION
SELECT country FROM suppliers;

-- Keeps duplicates
SELECT country FROM customers
UNION ALL
SELECT country FROM suppliers;
```

---

## Complex Query Patterns

### Second Highest Salary
```sql
WITH ranked AS (
    SELECT salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS rank
    FROM employee
)
SELECT * FROM ranked WHERE rank = 2;
```

### Manager-Employee Hierarchy
```sql
SELECT e.empid, e.empname, m.empname AS manager_name
FROM employee e
LEFT JOIN employee m ON e.managerid = m.empid;
```

### Calculate Time Differences
```sql
SELECT employeeid,
       logintime,
       logouttime,
       TIMESTAMPDIFF(second, logintime, logouttime) AS total_seconds
FROM logtable;
```

---

## Cheat Sheet

| Topic | Key Commands |
|-------|-------------|
| CASE | Conditional logic |
| Duplicates | ROW_NUMBER, GROUP BY |
| UNION | Combine results |
| Normalization | 1NF, 2NF, 3NF |