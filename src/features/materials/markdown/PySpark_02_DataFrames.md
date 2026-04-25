# 02 DataFrames


**Cells:** [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

---

<!-- Cell 10 -->

#sortdata
newdf = mergeddf.orderBy('Quantity', ascending=True)
newdf.show()

<!-- Cell 11 -->

#drop duplicates
newdf = mergeddf.dropDuplicates(['customerid'])
newdf.show()


<!-- Cell 12 -->

#udf: user defined function
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType,IntegerType, FloatType
def to_uppercase(s):
  return s.upper()


<!-- Cell 13 -->

myudf = udf(to_uppercase, StringType())

<!-- Cell 14 -->

from pyspark.sql.functions import udf
from pyspark.sql.types import StringType, IntegerType, FloatType

def to_uppercase(s):
  return s.upper()

myudf = udf(to_uppercase, StringType())

mergeddf = ordersdf.join(customer_df, on='customerid', how='inner')


#download udf
#create a udf object with output data type and function u need to apply
#create a new column and pass the udf with the parameter as the columns u to apply it to.




<!-- Cell 15 -->

mergeddf.show()
mergeddf.withColumn('uppercase_name', myudf('Name')).show()

<!-- Cell 16 -->

from pyspark.sql.types import FloatType
from pyspark.sql.functions import udf

def totalprice(quantity, price):
  return quantity * price

# Use FloatType if price or quantity might be floats
myudf = udf(totalprice, FloatType())


<!-- Cell 17 -->

from pyspark.sql.functions import udf
from pyspark.sql.types import IntegerType

def totalprice(quantity, price):
    return quantity * price

myudf = udf( totalprice , IntegerType())

udf
mergeddf = mergeddf.withColumn('total_price', myudf( mergeddf['quantity'], mergeddf['price'] ))

mergeddf.show()

<!-- Cell 18 -->

from pyspark.sql import SparkSession
spark = SparkSession.builder.appName('practice').getOrCreate()

data = [
    (1, 'Alice', 'HR', 50000),
    (2, 'Bob', 'HR', 60000),
    (3, 'Charlie', 'Sales', 55000),
    (4, 'David', 'Marketing', 45000),
    (5, 'Eve', 'Finance', 70000),
]

columns = ['employee_id', 'employee_name', 'department', 'salary']

employee_df = spark.createDataFrame(data, columns)

employee_df.show()


#with cte as (select employeename, salary, department, dense_rank() over (parition by department order by salary desc) as ranking
#from employees)

#select * from cte where ranking =2;

<!-- Cell 19 -->

# cte
# partition by department
# order by salary desc
# dense_rank() over (partition by department order by salary desc) as ranking


select * from cte
where ranking = 2;

---

## Cheat Sheet

### Key Commands
[Quick reference commands for this topic]

