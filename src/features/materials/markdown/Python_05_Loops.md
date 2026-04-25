# Python Loops

> For and while loops, range, and list comprehension in Python.

---

## While Loop

Execute until condition is true:

```python
# Basic while
count = 1
while count <= 5:
    print('count:', count)
    count += 1

# Sum calculation
total = 0
i = 1
while i <= 5:
    total += i
    i += 1
print(total)  # 15
```

### Password Checker
```python
correct_password = 'admin123'
entered = ''
attempts = 0
max_attempts = 3

while attempts < max_attempts:
    entered = input('Enter Password: ')
    if entered == correct_password:
        print('Password accepted')
        break
    else:
        attempts += 1
        print(f'Wrong! Attempts: {attempts}')
```

---

## For Loop

```python
# Loop through list
fruits = ['apple', 'banana', 'mango', 'cherry']
for i in fruits:
    print(i)

# Loop through range
for i in range(6):       # 0,1,2,3,4,5
    print(i)

for i in range(1, 10):   # 1 to 9
    if i % 2 == 0:
        print(i)

# Sum with range
total = 0
for i in range(1, 11):
    total += i
print(total)  # 55
```

---

## Range Function

| Syntax | Output |
|--------|--------|
| `range(6)` | 0, 1, 2, 3, 4, 5 |
| `range(1, 10)` | 1 to 9 |
| `range(1, 10, 2)` | 1, 3, 5, 7, 9 |

---

## List Comprehension

Shorthand for creating lists:

```python
# Basic
square = [i*i for i in range(11)]

# With condition
even = [i for i in range(11) if i % 2 == 0]

# Square of odd numbers
x = [1, 2, 4, 5, 78, 91, 5, 6]
square = [i*i for i in x if i % 2 != 0]
```

---

## Dictionary Comprehension

```python
# Basic
squares = {i: i*i for i in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# With condition
nums = [1, 2, 3, 4, 5, 6, 7, 8, 9]
even_square = {i: i*i for i in nums if i % 2 == 0}
```

---

## String Operations

```python
# Loop through string
x = 'krishna'
for i in x:
    print(i)

# Count vowels
vowels = 'aeiouAEIOU'
x = 'krishna'
vowel_list = [i for i in x if i in vowels]
```

---

## Password Generator

```python
import random
import string

def generate_password(length=8):
    uppercase = string.ascii_uppercase
    lowercase = string.ascii_lowercase
    special = '!@#$%^&*()_=+|'
    numbers = '0123456789'
    all_chars = uppercase + lowercase + special + numbers
    
    password = [
        random.choice(uppercase),
        random.choice(lowercase),
        random.choice(special),
        random.choice(numbers)
    ]
    
    for _ in range(length - 4):
        password.append(random.choice(all_chars))
    
    random.shuffle(password)
    return ''.join(password)

print(generate_password())
```

---

## Bubble Sort

```python
def bubble_sort(xlist):
    n = len(xlist)
    for i in range(n):
        for j in range(n - i - 1):
            if xlist[j] > xlist[j + 1]:
                xlist[j], xlist[j + 1] = xlist[j + 1], xlist[j]
    return xlist

x = [2, 1, 5, 14, 3, 6, 9, 8]
print(bubble_sort(x))  # [1, 2, 3, 5, 6, 8, 9, 14]
```

---

## Cheat Sheet

| Loop Type | Use Case |
|----------|----------|
| `while` | Unknown iterations |
| `for` | Known iterations |
| `range()` | Generate numbers |
| List comprehension | Quick lists |