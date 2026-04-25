# Python Functions

> Functions, parameters, return values, and common algorithms.

---

## Function Basics

```python
def function_name(parameters):
    """Docstring"""
    # code
    return value

# Simple function
def greet(name):
    print('Hello ' + name)

greet('Krish')
```

---

## Function Types

### No Parameters
```python
def print_hello():
    print('Hello')

print_hello()
```

### With Parameters
```python
def add(a, b):
    print(a + b)

add(1, 5)
```

### Return Values
```python
def square(x):
    return x * x

result = square(12)
```

### Default Parameters
```python
def greet(name='World'):
    print('Hello ' + name)

greet()           # Hello World
greet('Krish')  # Hello Krish
```

---

## Common Functions

### Find Maximum
```python
def find_max(i):
    return max(i)

find_max([1, 2, 3, 4, 5])  # 5
```

### Count Vowels
```python
def count_vowels(s):
    vowels = 'aeiouAEIOU'
    count = 0
    for i in s:
        if i in vowels:
            count += 1
    return count

count_vowels('bangalore')  # 4
```

### Reverse String
```python
def reverse_string(s):
    return s[::-1]

reverse_string('krishna')  # 'anhsirk'
```

### Reverse Manually
```python
def reverse_string(s):
    newstring = ''
    for i in s:
        newstring = i + newstring
    return newstring

reverse_string('krishna')  # 'anhsirk'
```

### Count Digits
```python
def count_digits(x):
    count = 0
    while x > 0:
        x = x // 10
        count += 1
    return count

count_digits(231326)  # 6
```

### Count Occurrences
```python
def count_occurrence(s):
    output = {}
    for i in s:
        if i in output:
            output[i] += 1
        else:
            output[i] = 1
    return output

count_occurrence('aaabbaccddeeef')
# {'a': 4, 'b': 2, 'c': 2, 'd': 2, 'e': 3, 'f': 1}
```

---

## Banking Application Example

```python
bank_account = {}

def create_account(account_number, name, initial_balance=0):
    if account_number in bank_account:
        print('Account already exists')
    else:
        bank_account[account_number] = {'name': name, 'balance': initial_balance}
        print('Account created')

def view_balance(account_number):
    if account_number in bank_account:
        print(f'Balance: {bank_account[account_number]["balance"]}')
    else:
        print('Account does not exist')

def deposit_money(account_number, amount):
    if account_number in bank_account:
        bank_account[account_number]['balance'] += amount
        print('Deposited')
    else:
        print('Account does not exist')

def withdraw_money(account_number, amount):
    if account_number in bank_account:
        if bank_account[account_number]['balance'] >= amount:
            bank_account[account_number]['balance'] -= amount
            print('Withdrawn')
        else:
            print('Insufficient funds')
    else:
        print('Account does not exist')
```

---

## List/Word Operations

```python
words = ['hi', 'hello', 'python']
upper_words = [i.upper() for i in words]
# ['HI', 'HELLO', 'PYTHON']

# Word lengths
words = ['data', 'engineering', 'is', 'hot']
lengths = [len(i) for i in words]
# [4, 11, 2, 3]
```

---

## Cheat Sheet

| Function | Syntax |
|----------|--------|
| Define | `def name():` |
| Return | `return value` |
| Default param | `def f(x=1):` |
| *args | `def f(*args):` |
| **kwargs | `def f(**kwargs):` |