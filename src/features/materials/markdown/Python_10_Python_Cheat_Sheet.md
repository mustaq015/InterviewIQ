# Python Cheat Sheet

Quick reference for common Python operations.

### Variables & Types
```python
x = 1              # int
x = 1.5            # float
x = 'text'          # string
x = True            # boolean
x = [1, 2, 3]      # list
x = (1, 2, 3)       # tuple
x = {'a': 1}        # dict
x = {1, 2, 3}       # set
```

### String Methods
```python
s.upper()       # UPPERCASE
s.lower()      # lowercase
s.strip()      # remove spaces
s.replace(x,y) # replace
s.split(x)     # split by x
s.join(list)   # join list
len(s)         # length
s[0]           # first char
s[-1]          # last char
s[0:5]         # slice
```

### List Operations
```python
lst.append(x)   # add
lst.extend(lst2) # extend
lst.insert(i,x)  # insert
lst.remove(x)   # remove by value
lst.pop()        # remove last
lst.clear()     # clear all
len(lst)        # length
```

### Loops
```python
for i in range(n):
    ...

for i in lst:
    ...

while condition:
    ...
```

### Functions
```python
def func(arg1, arg2=default):
    return value

# Lambda
f = lambda x: x*2
```

### Comprehensions
```python
[i*i for i in range(n)]         # list
{k: v*2 for k, v in d.items()}   # dict
```