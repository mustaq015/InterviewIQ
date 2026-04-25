# Lambda, Map & Filter

> Anonymous functions, map(), filter(), and reduce() in Python.

---

## Lambda Functions

Anonymous one-line functions:

```python
# Basic lambda
add = lambda x, y: x + y
add(10, 5)  # 15

# Square
square = lambda x: x * x
square(10)  # 100

# Even check
even = lambda x: x % 2 == 0
even(10)  # True

# Conditional lambda
check_even = lambda x: 'even' if x % 2 == 0 else 'odd'
check_even(10)  # 'even'

# Last character
last_char = lambda x: x[-1]
last_char('krishna')  # 'a'
```

---

## Map Function

Apply function to all elements:

```python
x = [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Square all
square = list(map(lambda i: i * i, x))
# [1, 4, 9, 16, 25, 36, 49, 64, 81]

# Uppercase
fruits = ['apple', 'banana', 'mango']
upper = list(map(lambda i: i.upper(), fruits))
# ['APPLE', 'BANANA', 'MANGO']

# Convert strings to int
nums = ['1', '2', '3', '4']
converted = list(map(lambda i: int(i), nums))
# [1, 2, 3, 4]
```

---

## Filter Function

Keep elements that pass condition:

```python
x = [1, 2, 3, 4, 5, 6]

# Even numbers
even = list(filter(lambda x: x % 2 == 0, x))
# [2, 4, 6]

# Words longer than 5 chars
fruits = ['apple', 'banana', 'mango', 'cherry']
long_words = list(filter(lambda i: len(i) > 5, fruits))
# ['banana', 'cherry']
```

---

## Reduce Function

Cumulative calculation:

```python
from functools import reduce

nums = [1, 2, 3, 4, 5]

# Sum all
total = reduce(lambda x, y: x + y, nums)
# 15

# Maximum
max_num = reduce(lambda x, y: x if x > y else y, nums)
# 5
```

---

## *args and **kwargs

### args - Variable Arguments
```python
def add_numbers(*args):
    total = 0
    for i in args:
        total += i
    return total

add_numbers(1, 2, 3, 4, 5)  # 15
```

### kwargs - Keyword Arguments
```python
def print_details(**kwargs):
    for key, value in kwargs.items():
        print(f'{key}: {value}')

print_details(name='krish', age=25)
# name: krish
# age: 25
```

### Combined
```python
def print_info(*args, **kwargs):
    print(args)    # (1, 2, 3)
    print(kwargs)  # {'name': 'krish'}

print_info(1, 2, 3, name='krish')
```

---

## Cheat Sheet

| Function | Use |
|-----------|-----|
| `lambda` | Anonymous function |
| `map()` | Apply to all elements |
| `filter()` | Keep matching elements |
| `reduce()` | Accumulate result |
| `*args` | Variable positional |
| `**kwargs` | Variable keyword |