# 04 Missing


**Cells:** [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99]

---

<!-- Cell 80 -->

df.head()

<!-- Cell 81 -->

#save it in parquet format

#parkay : prounce
#it is columnar storage
#it is compressed
#it is binary format
#it is read heavy

#it is used for large scale data mainly for machine learning and AI

#csv: comma seperate value > it just like excel.

df.to_parquet('/content/finance_data.parquet')

df =pd.read_parquet('/content/finance_data.parquet')

<!-- Cell 82 -->

df

<!-- Cell 83 -->

#pandas: merge

import pandas as pd
df1 = pd.DataFrame({'id':[1,2,5,4],'class':[9,10,11,12]})
df2 = pd.DataFrame({'id':[1,2,3,4],'student':['a','b','c','d']})
df1

# student table:
# studentid | name | age
# 1 | a | 16
# 2 | b| 18
# 3| c | 19


# marks table:

# studentid | subject | marks
# 1 | math | 90
# 2 | science | 92
# 4| english | 88

inner join: matching elements between the 2 tables
1 |a|16|math|90
2|b|18|science|92

left join : all elements from the left table and matching elements from the right table and where there is no match it will have null values
1 |a|16|math|90
2|b|18|science|92
3|c|19|null |null

right join : all elements from the right table and matching elements from the left table and where there is no match it will have null values
1 |a|16|math|90
2|b|18|science|92
4|null|null|english|88

full outer join: all elements from both tables and where there is no match it will have null values
1 |a|16|math|90
2|b|18|science|92
3|c|19|null |null
4|null|null|english|88

# table1   |   table2
# id1      |    id2
# 1             1
# 1             2
# 2             4
# 3             null
# 4             2
# null          3
# null          4
# 2             null
# 5             7

# 1  1
# 1  1
# 2  2
# 2  2
# 2  2
# 2  2
# 3  3
# 4  4
# 4  4


# null null
# null null
# 5  null
# 1  1
# 1  1
# 2  2
# 2  2
# 2  2
# 2  2
# 3  3
# 4  4
# 4  4
# null null
# null null
# null 7



# inner join: 1,1,2,2,2,2,3,4,4

# left join:  1,1,2,2,2,2,3,4,4,null, null, 5

# right join:1,1,2,2,2,2,3,4,4, null, null, 7

# full outer join: 1,1,2,2,2,2,3,4,4 , null, null, 5, null, null, 7



<!-- Cell 84 -->

df2

<!-- Cell 85 -->

result = pd.merge(df1,df2, on='id', how = 'inner')

<!-- Cell 86 -->

result

<!-- Cell 87 -->

#joins : inner join, left join, right join , full outer join.

#self, cartesian(cross)



<!-- Cell 88 -->

#inner join : it gives only matching data from both the tables

import pandas as pd

df1 = pd.DataFrame({'id':[1,2,3,4],'Name':['krish','ajay', 'adveer','anuj']})

df2 = pd.DataFrame({'id':[3,4,5],'age':[25,28,22]})

output = pd.merge(df1,df2, on='id',how= 'outer')

# 1 KRISH NULL
# 2 AJAY NULL
# 3 ADVEER 25
# 4 ANUJ 28
output


output = pd.merge(df1,df2, on='id',how= 'right')

3 ADVEER 25
4 ANUJ 28
5 NULL 22

print(output)

#left join : all elemnts from left table and any matching elements from right table

output = pd.merge(df1,df2, on='id' , how ='left')

id | name | age
1   krish  null
2   ajay   null
3   adveer 25
4   anuj   28

#right join: all elements from right table and any matching elements from the left table.

id | name | age

3   adveer 25
4   anuj   28
5   null   22

output = pd.merge(df1,df2, on='id' , how ='outer')


id | name | age

1   krish  null
2   ajay   null
3   adveer 25
4   anuj   28
5   null   22




#full outer join: all elements from both tables



<!-- Cell 89 -->

import pandas as pd
df1 = pd.DataFrame({
    'city':['bangalore','ajmer','kolkata','delhi'],
    'id': [1,2,3,4],
    'Name':['krish','ajay','adveer','anuj']
})

df2 = pd.DataFrame({
    'city':['kolkata','ajmer','bangalore','delhi'],
    'id': [3,4,1,2],
    'age': [25,28,22,24]
})

<!-- Cell 90 -->

output = pd.merge(df1,df2, on=['id'], how='inner')

<!-- Cell 91 -->

output

<!-- Cell 92 -->

df1 = pd.DataFrame({
    'id': [1,2,3],
    'Name':['john','Anna','Peter']
})

df2 = pd.DataFrame({
    'id': [3,4,5],
    'age': [25,28,22]
})

df3 = pd.DataFrame({
    'id': [1,2,3],
    'country':['USA','UK','India']
})

<!-- Cell 93 -->

output  = pd.merge(df1,df2, on='id',how = 'inner')

<!-- Cell 94 -->

newdf = pd.merge(output,df3, on='id', how='inner')

<!-- Cell 95 -->

newdf

<!-- Cell 96 -->

#pivot:
import pandas as pd
df = pd.DataFrame({
    'date':['2021-01-01', '2021-01-01','2021-01-02','2021-01-02'],
    'city':['newyork', 'los angeles', 'newyork','los angeles'],
    'temperature':[32,75,34,77]})


<!-- Cell 97 -->

df

<!-- Cell 98 -->

newdf = df.pivot(index='date', columns='city', values='temperature')

---

## Cheat Sheet

### Key Commands
[Quick reference commands for this topic]

<!-- Cell 99 -->

newdf
