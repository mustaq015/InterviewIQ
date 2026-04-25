# Decorators, Generators & Regex

> Decorators, generators, regular expressions, and JSON in Python.

---

## Decorators

Functions that modify other functions:

```python
def my_decorator(func):
    def wrapper():
        print('Before function')
        func()
        print('After function')
    return wrapper

@my_decorator
def say_hello():
    print('Hello')

say_hello()
# Before function
# Hello
# After function
```

### Login Required Example
```python
def login_required(func):
    def wrapper(user):
        if user['loggedin']:
            func(user)
        else:
            print('Access denied')
    return wrapper

@login_required
def view_profile(user):
    print(f'Welcome {user["name"]}')

user = {'name': 'krish', 'loggedin': True}
view_profile(user)  # Welcome krish
```

---

## Generators

Memory-efficient iterators using `yield`:

```python
def my_generator():
    yield 1
    yield 2
    yield 3

for i in my_generator():
    print(i)
# 1, 2, 3
```

### Read Large Files
```python
def read_file(filepath):
    with open(filepath, 'r') as file:
        for line in file:
            yield line

for line in read_file('data.csv'):
    print(line)
```

---

## Regular Expressions

```python
import re
```

### Basic Patterns

| Pattern | Description |
|---------|-------------|
| `.` | Any character |
| `^` | Starts with |
| `$` | Ends with |
| `*` | Zero or more |
| `+` | One or more |
| `?` | Zero or one |
| `\d` | Digit |
| `\w` | Word character |
| `\s` | Whitespace |

### Find Patterns

```python
txt = 'The rain in Spain'

# Find all matches
re.findall('ain', txt)  # ['ain', 'ain']

# Search
re.search('^The.*Spain$', txt)  # Match object

# Split
re.split(' ', txt)  # ['The', 'rain', 'in', 'Spain']

# Replace
re.sub('Spain', 'Portugal', txt)  # 'The rain in Portugal'
```

### Extract Emails
```python
text = 'Email: krish@example.com and test@company.org'
emails = re.findall(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', text)
# ['krish@example.com', 'test@company.org']
```

### Extract Phone Numbers
```python
text = 'Call (987) 654-3210 or 6363402404'
phones = re.findall(r'\(\d{3}\)\s?\d{3}-\d{4}', text)
# ['(987) 654-3210']

indian_phones = re.findall(r'\b\d{10}\b', text)
# ['6363402404']
```

### Extract Dates
```python
text = 'Born on 16-05-1994'
date = re.search(r'\d{2}-\d{2}-\d{4}', text)
date.group()  # '16-05-1994'
```

### Extract Postal Code
```python
text = 'Pincode: 560001'
pincode = re.findall(r'\b\d{6}\b', text)
# ['560001']
```

---

## JSON Operations

```python
import json
```

### Load String to JSON
```python
x = '{"name": "krish", "age": 30, "city": "bangalore"}'
y = json.loads(x)

y['name']  # 'krish'
```

### Dump JSON to String
```python
x = {'name': 'krish', 'age': 30, 'city': 'bangalore'}
y = json.dumps(x)

y  # '{"name": "krish", "age": 30, ...}'
```

---

## File Operations

### Delete File
```python
import os
os.remove('filename.txt')
```

---

## Cheat Sheet

| Topic | Key |
|-------|-----|
| Decorator | `@decorator` |
| Generator | `yield` |
| Regex | `re.findall()` |
| JSON | `json.loads()` / `json.dumps()` |