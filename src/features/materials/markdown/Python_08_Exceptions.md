# Exceptions & File Handling

> Exception handling, raising errors, and file operations in Python.

---

## Exception Handling

```python
try:
    # Code to try
    x = 10 / 0
except ZeroDivisionError:
    print('Cannot divide by zero')
except ValueError as e:
    print(f'Error: {e}')
else:
    print('Success')
finally:
    print('Always runs')
```

---

## Common Exceptions

| Exception | Description |
|-----------|-------------|
| `ZeroDivisionError` | Division by zero |
| `ValueError` | Invalid value |
| `TypeError` | Wrong type |
| `FileNotFoundError` | File not found |
| `IndexError` | Index out of range |
| `KeyError` | Dictionary key missing |

---

## Raise Custom Exception

```python
def withdraw(amount):
    balance = 1000
    if amount > balance:
        raise Exception('Insufficient balance')
    return balance - amount

try:
    print(withdraw(10000))
except Exception as e:
    print(f'Error: {e}')
```

### Validate Input
```python
def set_age(age):
    if age < 0:
        raise Exception('Age cannot be negative')
    return age

try:
    age = int(input('Enter age: '))
    print(set_age(age))
except Exception as e:
    print(e)
```

---

## File Handling

### Read File
```python
with open('file.txt', 'r') as file:
    for line in file:
        print(line)
```

### Write File
```python
with open('file.txt', 'w') as file:
    file.write('Hello ')
    file.write('World')
```

### Append to File
```python
with open('file.txt', 'a') as file:
    file.write('\nNew line')
```

---

## File Modes

| Mode | Description |
|------|-------------|
| `r` | Read |
| `w` | Write (overwrite) |
| `a` | Append |
| `r+` | Read and write |

---

## Common Algorithms

### Palindrome
```python
def palindrome(x):
    return x == x[::-1]

palindrome('mom')  # True
```

### Fibonacci
```python
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

list(fibonacci(10))  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

### Count Occurrences
```python
def count_occurrences(x):
    count = {}
    for i in x:
        count[i] = count.get(i, 0) + 1
    return count

count_occurrences('aabbccddee')
# {'a': 2, 'b': 2, 'c': 2, 'd': 2, 'e': 2}
```

### Anagram Check
```python
def is_anagram(word1, word2):
    return sorted(word1.lower()) == sorted(word2.lower())

is_anagram('listen', 'silent')  # True
```

### Group Anagrams
```python
def group_anagrams(words):
    anagram_dict = {}
    for i in words:
        key = ''.join(sorted(i))
        if key in anagram_dict:
            anagram_dict[key].append(i)
        else:
            anagram_dict[key] = [i]
    return anagram_dict

group_anagrams(['bat', 'tab', 'tap', 'pat', 'cat'])
# {'abt': ['bat', 'tab'], 'apt': ['tap', 'pat'], 'act': ['cat']}
```

---

## Cheat Sheet

| Keyword | Use |
|---------|-----|
| `try` | Attempt code |
| `except` | Catch error |
| `raise` | Throw error |
| `finally` | Always run |
| `with open()` | Safe file access |