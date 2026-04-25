# Python Operators

> Complete reference for all Python operators.

---

## Arithmetic Operators

| Operator | Name | Example | Result |
|----------|------|---------|--------|
| `+` | Addition | `1 + 1` | 2 |
| `-` | Subtraction | `10 - 2` | 8 |
| `*` | Multiplication | `10 * 2` | 20 |
| `/` | Division | `10 / 2` | 5 |
| `%` | Modulus | `11 % 2` | 1 |
| `//` | Floor Division | `7 // 2` | 3 |
| `**` | Exponent | `2 ** 4` | 16 |

---

## Assignment Operators

| Operator | Example | Equivalent |
|----------|---------|------------|
| `=` | `x = 5` | Assign |
| `+=` | `x += 5` | `x = x + 5` |
| `-=` | `x -= 5` | `x = x - 5` |
| `*=` | `x *= 5` | `x = x * 5` |
| `/=` | `x /= 5` | `x = x / 5` |
| `%=` | `x %= 5` | `x = x % 5` |
| `//=` | `x //= 5` | `x = x // 5` |
| `**=` | `x **= 5` | `x = x ** 5` |

---

## Comparison Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `==` | Equal | `5 == 5` → `True` |
| `!=` | Not equal | `5 != 6` → `True` |
| `>` | Greater | `10 > 5` → `True` |
| `<` | Less | `5 < 10` → `True` |
| `>=` | Greater or equal | `5 >= 5` → `True` |
| `<=` | Less or equal | `5 <= 5` → `True` |

---

## Logical Operators

```python
x = 10
y = 20

# AND - both must be true
x >= 10 and y == 20    # True

# OR - one must be true
x < 5 or y == 20       # True

# NOT - opposite
not(x < 5)           # True
```

---

## Identity Operators

```python
x = 6
y = x

x is y      # True (same object)
x is not y  # False
```

---

## Membership Operators

```python
x = [1, 2, 3, 4]

1 in x      # True
5 in x     # False
1 not in x  # False
```

---

## Operator Precedence

| Priority | Operator |
|----------|----------|
| 1 | `**` |
| 2 | `* / % //` |
| 3 | `+ -` |
| 4 | `== != < > <= >=` |
| 5 | `not` |
| 6 | `and` |
| 7 | `or` |

---

## Cheat Sheet

| Category | Operators |
|---------|-----------|
| Math | `+ - * / % // **` |
| Compare | `== != > < >= <=` |
| Logical | `and or not` |
| Identity | `is is not` |
| Member | `in not in` |