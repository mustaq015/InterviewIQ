# Python Introduction

> Introduction to Python programming covering variables, data types, and basic operations.

---

## Python Features

| Feature | Description |
|---------|-------------|
| **English-like** | 40% English syntax, easy to learn |
| **Interpreted** | Execute line by line |
| **Dynamically Typed** | No variable declaration needed |
| **Large Community** | Extensive libraries |
| **Cross-Platform** | Windows, Mac, Linux |
| **Object-Oriented** | Class-based |

---

## Variables

### Naming Rules
- Cannot start with a number
- Only `a-zA-Z0-9_`
- Case sensitive
- Cannot use keywords

```python
# Valid
x = 1
x = 'krish'
x = True
x = 1.0004
first_name = 'krish'
```

### PEP 8 Standards
- Limit lines to 79 characters
- Use lowercase with underscores
- Use indentation
- Use docstrings

---

## Data Types

| Type | Example | Description |
|------|---------|-------------|
| `int` | `1, -100` | Whole numbers |
| `float` | `1.5, 3.14` | Decimal numbers |
| `bool` | `True, False` | Boolean |
| `str` | `'krish', "123"` | Text |

---

## Arithmetic Operations

| Operator | Operation | Example |
|----------|-----------|---------|
| `+` | Addition | `1 + 1` = 2 |
| `-` | Subtraction | `10 - 2` = 8 |
| `*` | Multiplication | `10 * 2` = 20 |
| `/` | Division | `10 / 2` = 5 |
| `%` | Modulus (remainder) | `11 % 2` = 1 |
| `//` | Floor division | `7 // 2` = 3 |
| `**` | Power | `2 ** 4` = 16 |

### Even/Odd Check
```python
x = 101
if x % 2 == 0:
    print('Even')
else:
    print('Odd')
```

---

## String Operations

| Method | Description |
|-------|-------------|
| `len(x)` | String length |
| `x.upper()` | Uppercase |
| `x.lower()` | Lowercase |
| `x.strip()` | Remove whitespace |
| `x.replace(a, b)` | Replace characters |
| `x.capitalize()` | First letter uppercase |
| `x.endswith(c)` | Check ending |
| `x.startswith(c)` | Check starting |
| `x.find(word)` | Find index |
| `x.isalpha()` | All alphabetic |
| `x.isdecimal()` | All digits |
| `x.split(delimiter)` | Split string |

### Indexing
```python
x = 'krishna'
x[0]      # 'k'
x[-1]      # 'a'
x[0:3]     # 'kri' (slicing)
x[::2]      # 'ksn' (step of 2)
x[::-1]     # 'anhsirk' (reverse)
```

---

## Boolean Operations

```python
True + True    # 2
False + False  # 0

5 > 3         # True
10 < 2        # False
10 == 10      # True
```

---

## Type Casting

```python
x = '123'
int(x)       # 123

x = 1.004
int(x)       # 1

x = 10
float(x)     # 10.0

x = 1
bool(x)      # True
```

---

## User Input

```python
x = input('Enter your name: ')
```

---

## Cheat Sheet

| Concept | Syntax |
|---------|--------|
| Variable | `x = value` |
| Int | `x = 1` |
| Float | `x = 1.5` |
| String | `x = 'text'` |
| Boolean | `x = True` |
| Length | `len(x)` |
| Upper | `x.upper()` |
| Split | `x.split(',')` |