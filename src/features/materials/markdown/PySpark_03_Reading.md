# 03 Reading


**Cells:** [20, 21, 22, 23, 24, 25, 26, 27, 28, 29]

---

<!-- Cell 20 -->


from pyspark.sql.window import Window
from pyspark.sql.functions import dense_rank, lead,lag,rank,row_number, col

window_spec  = Window.partitionBy(col('department')).orderBy(col('salary').desc())
ranked_df = employee_df.withColumn('rank', dense_rank().over(window_spec))
ranked_df.show()


#window : pyspark.sql.window | pyspark.sql.functions | pyspark.sql.types import IntegerType, StringType, FloatType |


<!-- Cell 21 -->

secondhighestsalary = ranked_df.filter( col('rank')==2 ).show()

<!-- Cell 22 -->

#second highest salary by department
from pyspark.sql import SparkSession
spark = SparkSession.builder.appName('practice').getOrCreate()

from pyspark.sql import Window
from pyspark.sql.functions import col,dense_rank

data = [
    (1, 'Alice', 'HR', 50000),
    (2, 'Bob', 'Engineering', 60000),
    (3, 'Charlie', 'HR', 55000),
    (4, 'David', 'HR', 45000),
    (5, 'Eve', 'Engineering', 70000),
]

columns = ['employee_id', 'employee_name', 'department', 'salary']

employee_df = spark.createDataFrame(data, columns)

windowspec = Window.partitionBy('department').orderBy(col('salary').desc())

ranked_df = employee_df.withColumn('rank', dense_rank().over(windowspec))

second_highest_df = ranked_df.filter( col('rank') == 2 )

second_highest_df.show()



<!-- Cell 23 -->

employee_df.createOrReplaceTempView('employee')

spark.sql('select * from employee where department= "HR"').show()
spark.sql('select * from employee where department= "IT"').show()

<!-- Cell 24 -->

spark.sql("select department, avg(salary) as avgsalary from employee group by department").show()

<!-- Cell 25 -->

spark.sql("select * from employee order by salary desc").show()

<!-- Cell 26 -->

query = """ select department, employee_name, salary from (select department, employee_name, salary, dense_rank()
over (partition by department order by salary desc) as rank from employee) where rank = 2"""

spark.sql(query).show()

<!-- Cell 27 -->

#most frequently asked interview question : extract data from one source to another apply simple transformation
# Data source format
# Transformattion to be applied
# use case : why are we doing this ?
# final format of data?
# frequency of data
# size

#SQL server : connections

# define the source link: link = 'mylink/data.csv'
# destinationpath = 'mypath/newdata.parquet'
# extract: spark.read.csv(link)
# df.drop_duplicates()
# df.withColumn('city',lit('bangalore'))
# df.write.parquet(destinationpath)


from pyspark.sql import SparkSession
from pyspark.sql.functions import lit
spark = SparkSession.builder.appName('practice').getOrCreate()


df = spark.read.csv('mylink/data.csv')
df.dropDuplicates()
dfwithnewco = df.withColumn('city', lit('bangalore'))
dfwithnewco.show()

# id name age city
# 1 a 16 bangalore
# 2 b 16 bangalore
# 3 c 18 bangalore



#scenario 2 : data is sitting in sql server

from pyspark.sql import SparkSession

spark = SparkSession.builder.appName('practice').getOrCreate()

import mysqlconnector-python
mysqlurl = 'myurl'

# employeetable = 'employee'
# departmenttable = 'department'
mysqltable = ['employee','department']

mysqlproperties =
{
    'host':'myhost',
    'user':'root',
    'password':'password',
    'driver': 'mydriver'
}


#interview version

mysqlurl = 'myurl'
mysqltables= table1

employeedf =   spark.read.jdbc(url=mysqlurl, table=mysqltable[0], properties=mysqlproperties)
departmentdf = spark.read.jdbc(url=mysqlurl, table=mysqltable[1], properties=mysqlproperties)

employeedf.show()
departmentdf.show()

#joined the dataframes
mergeddf = employeedf.join(departmentdf, employeedf.departmentid == departmentdf.departmentid, how = 'inner')

#change the name of the column : withColumnRenamed(col('name),'newname)

#drop duplicates
mergeddf.dropDuplicates(['employeeid']).show()
df.withColumn('city', lit('bangalore'))
mergeddf.write.parquet('path')




<!-- Cell 28 -->

#we have data in a database , extract data (employee and department).

sqlproperties= {
url:myurl
id:admin
password:password
host:localhost
driver:com.mysql.cj.jdbc.Driver
}

tables = ['employee','department']

employee_df = spark.read.jdbc(url = url, table = 'employee', properties = sqlproperties)
department_df = spark.read.jdbc(url = url, table = 'department', properties = sqlproperties)

#join hte data and tranform

newdf  = employeedf.join(departmetndf, employeedf.departmentid == departmentdf.departmentid, how = 'inner')

newdf.withColumn('city', lit('bangalore'))

#write the data in parquet format in a location

newdf.write.parquet(path)


<!-- Cell 29 -->

#read data from csv
#apply udf
#filter
#join
# window functions
#create a new column
#read data from json or csv
#read data from databse  : jdbc connection  spark.read.jdbc
#write data into parquet

---

## Cheat Sheet

### Key Commands
[Quick reference commands for this topic]

