# SQL vs NoSQL

> Comparison between SQL (relational) and NoSQL (non-relational) databases, including table types and database constraints.

---

## SQL Overview

SQL (Structured Query Language) is a relational database model with these characteristics:

| Feature | SQL Database |
|---------|-------------|
| Data Structure | Tables with rows and columns |
| Schema | Fixed/Predefined |
| Scalability | Vertical (add more servers, RAM, storage) |
| Examples | MySQL, PostgreSQL, SQL Server, Oracle |
| Use Cases | Transactional databases (banking, social media, e-commerce) |

**CRUD Operations:** Create | Read | Update | Delete

---

## NoSQL Overview

NoSQL databases store data in flexible formats:

| Feature | NoSQL Database |
|---------|---------------|
| Data Structure | Key-value pairs (JSON), graphs, documents |
| Schema | Dynamic/Flexible |
| Scalability | Horizontal (distributed architecture) |
| Examples | MongoDB |
| Use Cases | Big data, analytics, AI/ML |

---

## Table Types

### Fact Table
Quantitative data such as sales and financial data.

### Factless Fact Table
A table with numerical data that is not measurable.

### Dimension Table
Descriptive data that defines fact tables (customer table, product table, logistics).

---

## Database Constraints

| Constraint | Description |
|------------|-------------|
| **Primary Key** | Unique, not null, can be composite |
| **Foreign Key** | References primary key in another table |
| **Unique Key** | Must be unique, allows null values |
| **Surrogate Key** | System-generated primary key |
| **Natural Key** | Business-provided key |
| **Candidate Key** | Columns that can uniquely identify a row |
| **Not Null** | Column must have a value |
| **Composite Key** | Combination of columns for unique identification |

---

## Sample Schema

### Sales Table
```sql
sales
salesid | amount | date       | customerid(fk) | productid(fk)
--------|--------|------------|---------------|--------------
1       | 100    | 2023-01-01 | 1              | 1
2       | 200    | 2023-01-02 | 2              | 2
3       | 300    | 2023-01-03 | 1              | 1
4       | 400    | 2023-01-04 | 2              | 1
```

### Product Table
```sql
product
productid | productname
----------|------------
1         | laptop
2         | mobile
3         | tablet
```

### Customer Table
```sql
customer
customerid | customername
-----------|-------------
1          | kalyan
2          | ajay
```

### Order Table
```sql
order
orderid | orderdate  | orderitem   | order_amount | customerid(fk) | vendorid(fk)
--------|-----------|-------------|--------------|----------------|-------------
1       | 2024-01-01| laptop      | 100000       | 1              | 1
2       | 2024-01-02| mobile      | 50000        | 2              | 2
3       | 2024-01-03| tablet      | 30000        | 3              | 2
4       | 2024-01-04| headphones | 5000         | 4              | 1
5       | 2024-01-04| headphones | 5000         | 4              |
```

### Vendor Table
```sql
vendor
vendorid | vendorname
----------|------------
1         | fedex
2         | dhl
3         | professional
```

---

## Null Handling Differences

| Database | Null Comparison | Multiple Nulls Allowed |
|----------|-----------------|----------------------|
| SQL Server | `NULL = NULL` is TRUE | No (only 1 null) |
| PostgreSQL/MySQL | `NULL <> NULL` | Yes |

---

## Cheat Sheet

| Concept | Description |
|---------|-------------|
| SQL | Relational database with fixed schema |
| NoSQL | Non-relational with dynamic schema |
| Primary Key | Unique identifier, not null |
| Foreign Key | Links to another table's primary key |
| Vertical Scaling | Add more hardware resources |
| Horizontal Scaling | Add more machines |
| OLTP | Online Transaction Processing |
| OLAP | Online Analytical Processing |