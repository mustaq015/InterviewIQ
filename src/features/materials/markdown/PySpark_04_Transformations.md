# 04 Transformations


**Cells:** [30, 31, 32, 33, 34, 35, 36, 37, 38, 39]

---

<!-- Cell 30 -->

!pip install mysql-connector-pythonc

import mysql.connector #mysql database
import psycopg2 #redshift | postgressql
import sqlalchemy #anything generic


config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'password',
    'database': 'database'
}

connection = myurl
cursor = connection.cursor()

query = 'select * from employee'
cursor.execute(query)
result = cursor.fetchall()

for row in result:
  print(row)


<!-- Cell 31 -->

#internal SQL databases
#1) email ingestion
#2) dump the csv file into a folder any folder (SFTP -secure file transfer protocol)
#3) API integration (advantage it can customised and secured, disadvantage: money to develop and manage)
#4) JDBC - plug and play.


<!-- Cell 32 -->

from sqlalchemy import create_engine
import pandas as pd

mysqlurl = 'jdbc:mysql://localhost:3306/database'
mysqltable = 'employee'

engine = create_engine(mysqlurl)

df = pd.read_sql_table(mysqltable, engine)

df.head()



<!-- Cell 33 -->

#psyopg2 - postgres sql.

import psycopg2

connection = {

    host = 'localhost',
    database =  'mydatabase'
    user = 'myuser',
    password = 'mypassword'
    port='5432'
}

connection = psycopg2.connect(**connection)
cursor = connection.cursor()

query = 'select * from employee'
cursor.execute(query)
result = cursor.fetchall()

cursor.close()
connection.close()

for row in result:
  print(row)



<!-- Cell 34 -->

#exact Interview coding questions:

#Initialise and import relevant libraries
#how to import from database, s3bucket, datawarehouse (mysql, postgressql, s3bucket, jdbc connections)
#tranformations: create a new column, filter data,select data,sort, drop duplicates, merge dataframes, apply window function for second highest salary, UDF
#write data in csv format, parquet format or jdbc connection to a database (output)



<!-- Cell 35 -->

##example real world with coalesce, repartition, cache, persist, broadcast joins.

#ecommerce:
#usecase: analyse customer behaviour to provide custom offers and deals depending on customer behaviour|
#daily transactional dashboard (sales, returns, profits, losses, top selling item, lowest selling items
#top selling location, least selling location, Top selling category, least selling category, male vs female shoppers )


#Data sources

#internal database:JDBC: mysql database (transaction, customer, product, logistics)
#external data: API: api integration into google (trends , analytics), facebook (marketing spend, competitor marketing data) and 3rd party api's (benchmarking -competitor pricing ($1))
#Internal / external : SFTP(secure file transfer protocol) Folder :  - csv data: from individual departments ( customer survey, marketing department) :pysftp

#orders | customer | product|google analytics(external)

#3 tables:

#1) total orders by customer (orders, customer)
#2) amount spent by customer (orders and customers)
#3) date and time of the order by customer (orders)
#4) product category(product, orders, customer)
#5) location of customer (customer)
#6) popular product based on location, brand and pricing.(product, orders, customer)
#7) spend by gender,age, location, category.(orders, customer,product)

#Data engineer goals:
# I wrote scripts to extract the data from jdbc and sftp
# once the data was extracted i was responsible for the below:

# join the data set to get a consolidated view of purchased
# apply tranformations to clean and filter the data
# optimise the pipeline for large scale processing using coalesce, repartition, cache, persist and broadcast joins.


#customer: customerid | name | city

#orders : orderid | productid | quantity| orderdate|customerid

#product: productid | name| category | price


from pyspark.sql import SparkSession
from pyspark.sql.functions import col, lit

spark = SparkSession.builder.appName('practice').getOrCreate()

customers_data = [(1, 'Alice', 'New York'), (2, 'Bob', 'San Diego'), (3, 'Charlie', 'Seattle')]
orders_data = [(101, 1, 201, 2, '2023-12-25'), (102, 2, 202, 1, '2023-12-26'), (103, 3, 203, 3, '2023-12-27')]
products_data = [(201, 'Laptop', 'Electronics', 1000), (202, 'Smartphone', 'Electronics', 700), (203, 'Headphones', 'Accessories', 150)]


s3bucket = 'path/rawfolder/data.csv'
accesskey = 'accesskey'
secretkey = 'secretkey'

#step 1: automatically extract data into your df

customerdf = spark.read.csv('s3bucket',header = True, inferSchema=True)
ordersdf = spark.read.csv('s3bucket',header = True, inferSchema=True)
productsdf = spark.read.csv('s3bucket',header = True, inferSchema=True)

#step2: connect using jdbc

url = 'jdbc:mysql://localhost:3306/database'
connectionproperties = {
    'user':username,
    'password':password,
    'host' = 'host'
    'driver':'com.mysql.cj.jdbc.Driver'
}

#option 1: read data directly from the database using jdbc
customerdf = spark.read.jdbc(url='url', user= connectionproperties['username'], password=connectionproperties['password'], configuration= connectionproperties)
ordersdf = spark.read.jdbc(url='url', user= connectionproperties['username'], password=connectionproperties['password'], configuration= connectionproperties)
productsdf = spark.read.jdbc(url='url', user= connectionproperties['username'], password=connectionproperties['password']sword, configuration= connectionproperties)


# option2 :manual dataframe creation
customers_df = spark.createDataFrame(customers_data, ['customer_id', 'customer_name', 'city'])
orders_df = spark.createDataFrame(orders_data, ['order_id', 'customer_id', 'product_id', 'quantity', 'order_date'])
products_df = spark.createDataFrame(products_data, ['product_id', 'product_name', 'category', 'price'])

customers_df.show()
orders_df.show()
products_df.show()


#broadcast join - broadcast smallest dataframe to each node to reduce shuffling.
products_broadcast = products_df.broadcast()

#join the data

order_details_df= orders_df.join(products_broadcast, on='product_id', how='inner')

filtered_df = order_details_df.filter(col('quantity')>1)
newdf = filtered_df.withColumn('total_price', col('quantity') * col('price'))

#cache results for reuse
newdf.cache()

#aggregration

aggregated_df = newdf.groupBy('city', 'category').sum('total_price')

#repartition data for further processing

repartition_df  = aggregated_df.repartition(4)

#run the remaining aggregrations here

#coalesce to optimise partitions for writing

finaldf= repartition_df.coalesce(1)

#write_output

finaldf.write.mode('overwrite').parquet('/content/output')

#1) total orders by customer
#2) amount spent by customer
#3) date and time of the order by customer
#4) product category
#5) location of customer
#6) popular product based on location, brand and pricing.

<!-- Cell 36 -->

from pyspark.sql import SparkSession
from pyspark.sql.functions import lit

spark = SparkSession.builder.appName('practice').getOrCreate()

df = spark.read.parquet('file.parquet')

dfwithnewco = df.withColumn('city', lit('bangalore'))

dfwithnewco.show()

<!-- Cell 37 -->

#JDBC integration with mysql > s3 > redshift
#API integration to 3rd party api
#sftp integration
#SQL: removing duplicates (row number, having, distinct)
#pandas df and pyspark df
#RDD vs df
#joins in pyspark
#broadcast variable / join

#working for a ecommerce firm, we are getting data from multiple sources which includes sftp folder. the csv files from sftp are moved to s3 bucket, from s3 bucket extract the data into a sparf df
#write tranformations  : remove duplicates, count of na in each column, fillna, create a new column to run some aggregrations.
#i want to write the file to 2 places. one is redshift table and another is an s3 bucket. i want the file to be writter in parquet format.
# I want to create a dataframe manually

#initialise spark

from pyspark.sql import SparkSession
from pyspark.sql.types import StructType, StructField, StringType, IntegerType
from pyspark.sql.functions import col, when, lit, count, sum, avg, max, min, countDistinct

spark = SparkSession.builder.appName('practice').getOrCreate()


schema = StructType([
    StructField('customer_id', IntegerType(), True),
    StructField('customer_name', StringType(), True),
    StructField('city', StringType(), True),
    StructField('age', IntegerType(), True),
    StructField('gender', StringType(), True),
    StructField('salary', IntegerType(), True)
])

data = [
    (1, 'Alice', 'New York', 25, 'Female', 50000),
    (2, 'Bob', 'San Diego', 30, 'Male', 60000),
    (3, 'Charlie', 'Seattle', 35, 'Male', 55000),
    (4, 'David', 'Los Angeles', 28, 'Male', 45000),
    (5, 'Eve', 'Chicago', 32, 'Female', 70000),
    (6, 'Frank', 'Miami', 29, 'Male', 55000),
    (7, 'Grace', 'San Francisco', 31, 'Female', 65000),
    (8, 'Henry', 'Boston', 27, 'Male', 52000)
       ]

df = spark.createDataFrame(data, schema)

df.printSchema()

#s3 credentials

s3bucket = 'path/rawfolder/data.csv'
accesskey = 'accesskey'
secretkey = 'secretkey'

#redshift credentials:

redshift_table = 'tablename'
redshift_cluster = 'clustername'
redshift_url = 'jdbc:redshift://endpoint:5439/dbname'
username= 'redshiftusername'
password = 'password'


#count of nulls

namecount = df['name'].isnull().sum()

for i in df.columns:
  print(i, df[i].isNull().sum())


#drop duplicates
df = df.dropDuplicates()

#fillna

df = df.fillna({'age':30, 'salary':50000})

#create a new column salary category

df = df.withColumn(
    'salarycategory',
    when(col('salary') < 50000, 'Low').when((col('salary') >= 50000) & (col('salary') < 60000), 'Medium').otherwise('High')
)

df.show()


s3_target_path = 's3://bucket/data/'
df.write.mode('overwrite').parquet(s3_target_path)

#write to redshift

df.write.format('jdbc').option('url',redshift_url).option('dbtable', redshift_table).option('user', username).option('password', password).mode('overwrite').save()

print(' the data was succesffull saved ')





<!-- Cell 38 -->

#read a file from a s3 bucket, Its a csv file and run some minor tranformation on it and move it into anothe s3 bucket. use boto3 library.



<!-- Cell 39 -->

#read a file from a s3 bucket which has date in the name of the file, we only need to read the file that has today's date
#and any other dates we need to move the file to archive folder.#after reading the file we need to run some minor tranformation and move the file to another s3 bucket.

#initiate spark session

#naming convention
rawdata\
  logistics\
  customersurvey\
  finance\
    08092025\
    09092025\
      finance_09092025


from pyspark.sql import SparkSession
import boto3
from datetime import datetime

spark = SparkSession.builder.appName('test').getOrCreate()

#mention the location of the file which is s3path
sourcebucket = 'mybucket/source'
destinationbucket = 'mybucket/destination'
archivebucket = 'mybucket/archive'


#calculte today'date
today = datetime.now().strftime('%d%m%Y')

#initiate boto3

s3client = boto3.client('s3')

#get all the files in my s3 bucket


response = s3client.list_objects_v2(bucket= sourcebucket)

filelist = {'data_01012025':1,'data_02012025':1}

#check if there are duplicate files in my s3 bucket if its there then delete the second file.
for i in response['Contents']:
  key = i['Key']
  if key in filelist:
    s3client.delete_object(Bucket=sourcebucket, Key=key)
    print(f'File {key} moved to archive bucket.'


#read the file after duplicate files are deleted and then if the today date is in the key name then read and tranform and
#load to destination or copy to archive and delete at source.

for obj in response['Contents']:
  key =obj['Key']

  #look for today's date in the filename

  if today in key:

    #if today's date in file name read the file.

    df=spark.read.csv('path', header=True, inferSchema= True)

    #drop duplicates

    newdf =df.withColumn('city', lit('bangalore'))


    #export the df to anotehr bucket.
    newdf.write.parquet(destinationbucket)

    print('The file has been succesfully tranformed and moved')

  else:

    s3client.copy_object(CopySource={'Bucket': sourcebucket, 'Key': key}, Bucket=archivebucket, Key=key)
    s3client.delete_object(Bucket=sourcebucket, Key=key)
    print(f'File {key} moved to archive bucket.')

spark.stop()

---

## Cheat Sheet

### Key Commands
[Quick reference commands for this topic]

