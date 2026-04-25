# Basic SQL Queries

> Fundamentals of SQL querying including SELECT, WHERE, ORDER BY, and aggregate functions.

---

## Creating Tables

```sql
CREATE TABLE Employees (
    employee_id INT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    phone_number VARCHAR(20),
    hire_date DATE,
    job_id VARCHAR(10),
    salary DECIMAL(10, 2),
    department_id INT
);

CREATE TABLE Departments (
    department_id INT PRIMARY KEY,
    department_name VARCHAR(100),
    location VARCHAR(100),
    manager_id INT
);
```

---

## Inserting Data

```sql
INSERT INTO Departments (department_id, department_name, location, manager_id)
VALUES
(10, 'Development', 'New York', 101),
(20, 'Human Resources', 'Chicago', 102),
(30, 'Finance', 'Boston', 103),
(40, 'Marketing', 'Los Angeles', 104),
(50, 'IT', 'San Francisco', 109),
(60, 'Support', 'Remote', NULL);

INSERT INTO Employees (employee_id, first_name, last_name, email, phone_number, hire_date, job_id, salary, department_id)
VALUES
(101, 'John', 'Doe', 'john.doe@example.com', '123-456-7890', '2020-01-15', 'DEV01', 75000.00, 10),
(102, 'Jane', 'Smith', 'jane.smith@example.com', '234-567-8901', '2019-03-22', 'HR01', 68000.00, 20),
(103, 'Robert', 'Brown', 'robert.brown@example.com', '345-678-9012', '2018-07-01', 'FIN01', 85000.00, 30),
(104, 'Emily', 'Davis', 'emily.davis@example.com', '456-789-0123', '2021-11-10', 'MKT01', 62000.00, 40),
(105, 'Michael', 'Wilson', 'michael.wilson@example.com', '567-890-1234', '2022-06-18', 'DEV02', 78000.00, 10),
(106, 'Olivia', 'Taylor', 'olivia.taylor@example.com', '678-901-2345', '2020-04-12', 'HR02', 71000.00, 20),
(107, 'William', 'Moore', 'william.moore@example.com', '789-012-3456', '2017-09-25', 'FIN02', 90000.00, 30),
(108, 'Sophia', 'Anderson', 'sophia.anderson@example.com', '890-123-4567', '2023-02-14', 'MKT02', 65000.00, 40),
(109, 'James', 'Thomas', 'james.thomas@example.com', '901-234-5678', '2016-12-05', 'IT01', 87000.00, 50),
(110, 'Isabella', 'Jackson', 'isabella.jackson@example.com', '012-345-6789', '2019-08-30', 'IT02', 82000.00, 50);
```

---

## Job History Table

```sql
CREATE TABLE Job_History (
    employee_id INT,
    start_date DATE,
    end_date DATE,
    job_id VARCHAR(10),
    department_id INT,
    PRIMARY KEY (employee_id, start_date),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id),
    FOREIGN KEY (job_id) REFERENCES Jobs(job_id),
    FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);

INSERT INTO Job_History (employee_id, start_date, end_date, job_id, department_id)
VALUES
    (101, '2020-01-15', '2021-12-31', 'DEV01', 10),
    (101, '2022-01-01', NULL, 'DEV02', 20),
    (102, '2019-03-22', NULL, 'HR01', 20),
    (103, '2018-07-01', '2023-06-30', 'FIN01', 30),
    (103, '2023-07-01', NULL, 'FIN02', 40),
    (104, '2021-11-10', NULL, 'MKT01', 40),
    (105, '2022-06-18', NULL, 'DEV02', 10),
    (106, '2020-04-12', NULL, 'HR02', 20),
    (107, '2017-09-25', NULL, 'FIN02', 30),
    (108, '2023-02-14', NULL, 'MKT02', 40),
    (109, '2016-12-05', NULL, 'IT01', 50),
    (110, '2019-08-30', NULL, 'IT02', 50);
```

---

## Jobs Table

```sql
CREATE TABLE Jobs (
    job_id VARCHAR(10) PRIMARY KEY,
    job_title VARCHAR(255),
    min_salary DECIMAL(10, 2),
    max_salary DECIMAL(10, 2)
);

INSERT INTO Jobs (job_id, job_title, min_salary, max_salary)
VALUES
    ('DEV01', 'Senior Developer', 70000.00, 100000.00),
    ('DEV02', 'Lead Developer', 90000.00, 130000.00),
    ('HR01', 'HR Manager', 60000.00, 90000.00),
    ('HR02', 'HR Specialist', 50000.00, 75000.00),
    ('FIN01', 'Financial Analyst', 75000.00, 110000.00),
    ('FIN02', 'Senior Accountant', 80000.00, 120000.00),
    ('MKT01', 'Marketing Specialist', 55000.00, 80000.00),
    ('MKT02', 'Marketing Manager', 65000.00, 95000.00),
    ('IT01', 'IT Manager', 85000.00, 125000.00),
    ('IT02', 'Network Engineer', 78000.00, 115000.00);
```

---

## Basic SELECT Queries

### Select All Data
```sql
SELECT * FROM employees;
```

### Filter by Condition
```sql
SELECT * FROM employees
WHERE salary > 75000;
```

### Filter by Multiple Conditions
```sql
SELECT * FROM employees
WHERE hire_date > '2020-01-01' AND salary > 75000;
```

### Select Specific Columns
```sql
SELECT first_name, last_name, salary FROM employees;
```

### Order By
```sql
-- Ascending (default)
SELECT first_name, last_name, salary FROM employees
ORDER BY salary
LIMIT 1;

-- Descending
SELECT first_name, last_name, salary FROM employees
ORDER BY salary DESC;
```

### Multiple Conditions
```sql
-- AND: both conditions must be true
SELECT first_name, last_name, salary FROM employees
WHERE salary > 75000 AND first_name = 'Michael';

-- OR: at least one condition is true
SELECT first_name, last_name, salary FROM employees
WHERE salary > 75000 OR first_name = 'Michael';

-- NOT: opposite of condition
SELECT first_name, last_name, salary FROM employees
WHERE NOT salary > 75000;
```

---

## Aggregate Functions

| Function | Description |
|----------|-------------|
| `COUNT(*)` | Count of rows |
| `SUM(column)` | Total sum |
| `AVG(column)` | Average value |
| `MIN(column)` | Minimum value |
| `MAX(column)` | Maximum value |

```sql
-- Count all rows
SELECT count(*) FROM employees;

-- Total salary
SELECT sum(salary) AS totalsum FROM employees;

-- Average salary
SELECT avg(salary) AS averagesalary FROM employees;
```

---

## LIKE Operator

| Pattern | Matches |
|---------|---------|
| `M%` | Starts with M |
| `%n` | Ends with n |
| `a%` | Starts with a |
| `____` | Exactly 4 characters |
| `[aeiou]%` | Starts with vowel |

```sql
-- Names starting with M
SELECT * FROM employees WHERE first_name LIKE 'M%';

-- Names ending with n
SELECT * FROM employees WHERE first_name LIKE '%n';

-- Names starting with a
SELECT * FROM employees WHERE first_name LIKE 'a%';

-- Exactly 4 characters
SELECT * FROM employees WHERE first_name LIKE '____';

-- Start with vowel
SELECT * FROM employees WHERE first_name LIKE '[aeiou]%';
```

---

## IN and BETWEEN

```sql
-- IN: specific values
SELECT * FROM employees
WHERE last_name IN ('Doe', 'Smith', 'Davies');

-- BETWEEN: range of values
SELECT * FROM employees
WHERE department_id BETWEEN 10 AND 40;
```

---

## Alias

```sql
SELECT first_name AS fname, last_name AS lname, salary AS sal FROM employees;
```

---

## Cheat Sheet

| Command | Description |
|---------|-------------|
| `SELECT *` | Select all columns |
| `WHERE` | Filter conditions |
| `ORDER BY` | Sort results |
| `LIMIT` | Limit number of results |
| `AS` | Column alias |
| `LIKE` | Pattern matching |
| `IN` | Multiple values |
| `BETWEEN` | Range of values |
| `AND/OR/NOT` | Logical operators |