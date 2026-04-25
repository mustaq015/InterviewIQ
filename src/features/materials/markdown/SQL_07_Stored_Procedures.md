# Stored Procedures

> Reusable SQL code blocks that perform specific operations with parameters.

---

## What is a Stored Procedure?

A stored procedure is a precompiled SQL code block that can be called by name.

**Benefits:**
- Faster execution
- Reusable code
- Security (prevents SQL injection)
- Reduced network traffic

---

## Basic Syntax

### SQL Server
```sql
CREATE PROCEDURE procedure_name
    @param1 datatype,
    @param2 datatype
AS
BEGIN
    -- SQL statements
END;
```

### Execute
```sql
EXEC procedure_name @param1 = value, @param2 = value;
```

---

## Examples

### Update Employee Salary
```sql
CREATE PROCEDURE update_employee_salary
    @employee_id INT,
    @new_salary DECIMAL(10,2)
AS
BEGIN
    UPDATE employees
    SET salary = @new_salary
    WHERE employee_id = @employee_id;
END;

-- Execute
EXEC update_employee_salary 
    @employee_id = 105, 
    @new_salary = 70000.00;
```

### Update Multiple Employees
```sql
CREATE PROCEDURE update_employees_salary
    @employee_ids VARCHAR(MAX),
    @new_salary DECIMAL(10,2)
AS
BEGIN
    UPDATE employees
    SET salary = @new_salary
    WHERE employee_id IN (
        SELECT value FROM STRING_SPLIT(@employee_ids, ',')
    );
END;

EXEC update_employees_salary 
    @employee_ids = '101,103,105', 
    @new_salary = 80000.00;
```

### Insert New Employee
```sql
CREATE PROCEDURE add_new_employee
    @first_name VARCHAR(255),
    @last_name VARCHAR(255),
    @email VARCHAR(255),
    @phone_number VARCHAR(255),
    @hire_date DATE,
    @job_id VARCHAR(255),
    @salary DECIMAL(10,2),
    @department_id INT
AS
BEGIN
    INSERT INTO employees (first_name, last_name, email, phone_number, hire_date, job_id, salary, department_id)
    VALUES (@first_name, @last_name, @email, @phone_number, @hire_date, @job_id, @salary, @department_id);
END;

EXEC add_new_employee 
    @first_name = 'John',
    @last_name = 'Doe',
    @email = 'john.doe@example.com',
    @phone_number = '123-456-7890',
    @hire_date = '2020-01-15',
    @job_id = 'DEV01',
    @salary = 75000.00,
    @department_id = 10;
```

### Get Employees by Department
```sql
CREATE PROCEDURE get_employees_by_department
    @department_name VARCHAR(255)
AS
BEGIN
    SELECT e.first_name, e.last_name, d.department_name
    FROM employees e
    JOIN departments d ON e.department_id = d.department_id
    WHERE d.department_name = @department_name;
END;

CALL get_employees_by_department('HR');
```

---

## Cheat Sheet

| Command | Description |
|---------|-------------|
| `CREATE PROCEDURE` | Define new procedure |
| `EXEC` / `CALL` | Execute procedure |
| `@param` | Parameter name |
| `AS BEGIN...END` | Procedure body |