# Python Data Types & Methods

> Detailed coverage of string methods, type conversion, and operators.

---

## String Methods

```python
x = 'krishna'

# Case methods
x.upper()           # 'KRISHNA'
x.lower()           # 'krishna'
x.capitalize()      # 'Krishna'

# Check methods
x.startswith('k')  # True
x.endswith('a')    # True

# Find
x = 'my name is krish, i am from bangalore'
x.find('bangalore')  # 22

# Replace
x = 'hello'
x.replace('h', 'ke')  # 'keello'

# Strip whitespace
x = ' hello '
x.strip()  # 'hello'
```

---

## Slicing

```python
x = 'krishna'

x[0:3]    # 'kri' - start to index 3
x[:3]     # 'kri' - beginning to 3
x[3:]     # 'shna' - index 3 to end
x[::2]    # 'ksn' - every 2nd character
x[::-1]   # 'anhsirk' - reverse
```

---

## Type Conversion

```python
# String to int
x = '123'
int(x)    # 123

# Float to int
x = 1.004
int(x)    # 1

# Any to bool
x = 10
bool(x)   # True

# Int to float
x = 6
float(x)  # 6.0
```

---

## Operators

### Arithmetic
```python
+ - * / % // **
```

### Assignment
```python
x = 5     # assign
x += 5    # x = x + 5
x -= 5    # x = x - 5
x *= 5    # x = x * 5
x /= 5    # x = x / 5
x %= 5    # x = x % 5
```

### Comparison
```python
==  # equal
!=  # not equal
>   # greater
<   # less
>=  # greater or equal
<=  # less or equal
```

### Logical
```python
x = 10
y = 20

x >= 10 and y == 20   # True
not(x < 5 or y == 6) # True
```

### Truth Table

| A | B | A and B | A or B |
|---|---|--------|--------|
| T | T | T | T |
| T | F | F | T |
| F | T | F | T |
| F | F | F | F |

### Identity
```python
x = 6
y = x
x is y     # True
x is not y # False
```

---

## String Split and Join

```python
# Split
x = 'hello world'
x.split(' ')  # ['hello', 'world']

# Join
words = ['hey', 'wassup', 'how', 'are', 'you?']
' '.join(words)  # 'hey wassup how are you?'
```

---

## Check Character Types

```python
x = 'AbCdeFG123KL'

for char in x:
    if char.isupper():
        print(f'Upper: {char}')
    elif char.islower():
        print(f'Lower: {char}')
    elif char.isnumeric():
        print(f'Digit: {char}')
```

---

## Cheat Sheet

| Method | Use |
|--------|-----|
| `.upper()` | Uppercase |
| `.lower()` | Lowercase |
| `.strip()` | Remove spaces |
| `.replace(a, b)` | Replace |
| `.split(d)` | Split by delimiter |
| `.join(list)` | Join list |
| `.isalpha()` | Letters only |
| `.isdecimal()` | Digits only |