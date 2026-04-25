# Python Data Structures

> Lists, tuples, dictionaries, and sets with all operations.

---

## Data Structures Overview

| Structure | Ordered | Duplicates | Mutable |
|-----------|---------|-----------|---------|
| **List** | Yes | Yes | Yes |
| **Tuple** | Yes | Yes | No |
| **Dictionary** | Yes | No (keys) | Yes |
| **Set** | No | No | Yes |

---

## Lists

### Create
```python
x = [1, 2, 3, 4, 4, 5, 'krish', True, 1.004]
```

### Access
```python
x[0]     # First element
x[-1]     # Last element
x[0:3]    # Elements 0-2
x[:3]      # First 3
x[3:]       # From index 3
x[::2]      # Every 2nd
x[::-1]     # Reverse
```

### Add Elements
```python
x = [1, 2, 2, 4, 5]

x.append(10)           # Add to end: [1,2,2,4,5,10]
x.extend([20, 30])     # Add multiple: [1,2,2,4,5,20,30]
x.insert(1, 'kiwi')    # Insert at index: [1,'kiwi',2,4,5]
```

### Remove Elements
```python
x.remove('kiwi')    # Remove by value
x.pop()             # Remove last
x.pop(0)           # Remove by index
x.clear()          # Clear all
```

### Modify
```python
x[0] = 'grapes'    # Change element
```

### Length
```python
len(x)              # Number of elements
```

---

## Tuples

### Create
```python
x = (1, 2, 3, 4, 5)
```

### Access (same as list)
```python
x[0]      # First element
x[0:3]    # Slicing
```

### Convert
```python
x = [1, 1, 2, 2]
tuple(x)   # To tuple
list(x)    # To list
```

---

## Dictionaries

### Create
```python
x = {
    'fname': 'krishna',
    'lname': 'bhargav',
    'age': 25,
    'city': 'bangalore',
    'country': 'india',
    'salary': 10000,
    'married': True,
    'phonenumbers': [123456789, 987654321]
}
```

### Access
```python
x['fname']              # 'krishna'
x.get('age')            # 25
x.keys()               # All keys
x.values()             # All values
x.items()              # Key-value pairs
```

### Modify
```python
x['fname'] = 'ajay'              # Update value
x['address'] = '123 road'     # Add new
x.pop('age')                # Remove
x.popitem()                 # Remove last
x.clear()                  # Clear all
```

### Nested Dictionary
```python
students = {
    'student1': {
        'fname': 'krishna',
        'courses': ['math', 'science']
    }
}

students['student1']['courses'][0]  # 'math'
```

---

## Sets

### Create
```python
x = {1, 2, 3, 4, 5}
```

### Operations
```python
x.add(6)          # Add
x.remove(6)       # Remove
x.discard(6)      # Remove (no error if missing)
x.clear()         # Clear
```

### Set Operations
```python
a = {1, 2, 3}
b = {3, 4, 5}

a.union(b)          # {1, 2, 3, 4, 5}
a.intersection(b)  # {3}
a.difference(b)    # {1, 2}
```

---

## Loops

### List Loop
```python
x = [1, 2, 3, 4, 5, 6]

for i in x:
    print(i)
```

### Tuple Loop
```python
x = (1, 2, 3, 4, 5)

for i in x:
    print(i)
```

### Dictionary Loop
```python
x = {'a': 1, 'b': 2}

for key in x:
    print(key, x[key])

for value in x.values():
    print(value)
```

---

## Cheat Sheet

| Structure | Create | Access | Add | Remove |
|-----------|--------|--------|-----|--------|
| List | `[1,2,3]` | `x[0]` | `.append()` | `.pop()` |
| Tuple | `(1,2,3)` | `x[0]` | N/A | N/A |
| Dict | `{'a':1}` | `x['a']` | `x['k']=v` | `.pop()` |
| Set | `{1,2,3}` | N/A | `.add()` | `.remove()` |