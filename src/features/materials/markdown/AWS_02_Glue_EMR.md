# 02 Glue EMR


**Cells:** [3, 4, 5]

---

<!-- Cell 3 -->

s3://your-bucket-name/
├── raw_data/
        FINANCE/

│   ├──     csv_files/

│   │   ├── 2025-03-07_file1.csv
│   │   ├── 2025-03-07_file2.csv
│   │   └── ...
            JSON_files/

        SALES/

│   ├── google_analytics/
│   │   ├── 2025-03-07_google_analytics_data.json
│   │   └── ...
│   ├── facebook_insights/
│   │   ├── 2025-03-07_facebook_insights_data.json
│   │   └── ...
│   ├── jdbc_tables/
│   │   ├── table1/
│   │   │   ├── 2025-03-07_table1_part1.csv
│   │   │   └── 2025-03-07_table1_part2.csv
│   │   ├── table2/
│   │   │   └── 2025-03-07_table2.csv
│   │   └── ...
├── processed_data/
│   ├── cleaned/
│   │   ├── 2025-03-07_cleaned_file1.csv
│   │   └── ...
│   ├── transformed/
│   │   ├── 2025-03-07_transformed_file1.csv
│   │   └── ...
├── staging_data/
│   ├── intermediate/
│   │   ├── 2025-03-07_intermediate_file1.csv
│   │   └── ...
├── archive/
│   ├── 2025-03/
│   │   ├── archived_file1.csv
│   │   └── ...
└── metadata/
    ├── sftp_file_manifest.json
    ├── api_data_status.json
    └── jdbc_table_metadata.json


<!-- Cell 4 -->

#how will a AWS Account A share resources with AWS account B

# 1) Account A will add bucket policy to trust Account B
# 2) Account B create access point linked to account A bucket
# 3) Account B add access point policy granting IAM roles
# 4) Account B attach the iam policy to the specific role
# 5) account B use accoutn point ARN instead of bucket name








#ETL vs ELT
#Extract tranform and load
#Extract load and transform: The tranformation happens at the destination so its faster. large amounts of data to be loaded at once then we use ELT.

#when:0
# clean and validated data before loading to warehouse
# complex transformations
# small to medium sized data

#on premesis data: ETL
#complex preload validation needed ETL


#ELT:
# no need to clean and validate data before loading to warehouse
# simple transformations
# large amounts of data to be loaded at once

# large amount of data which needs less complex tranformation ELT (cloud)
# faster for real time analytics
# cloud based ELT tools: snowflake, databricks, bigquery

#pros and cons
#faster
#needs lot of storage in warehouse
#highly scalable

#etl: extract tranform and load
# the tranformation happens before loading to datawarehouse
#it is mainly used with OLTP databases , where the data is more normalised
#if we have a requirement to keep raw data before loading clean data.

#pros and cons
#slower
#less storage needed
#limited scalability.

#versions:
Glue: 4
python : 3.10
spark: 3.3
pandas : 1.3


#AWS Glue: ETL tool( extract tranform and load): large scalable data (we can use pyspark in glue).
#serverless: no backend strucutre to be maintained.

#Components:
#Glue can import data from multiple sources:

#1) Aws s3: datalake (csv, json, parquet, avro etc)
#2) JDBC connections: AWS RDS, redshift, mysql, postgressql, sql server.
#3) amazon dynamodb: Nosql database
#4) AWS kinesis data streams: real time data source.
#5) rest api, sftp

#classifiers: JSON, CSV, parquet etc

#AWS data catalog:
#metadata: data about data (datatype, size, format)

#Centralised metadata repository: metadata store that will hold all definitions of the data in the source. it stors the information about data sources, tables and data schemas.

#automatic Schema discovery: AWS glue can automatically discover and catalog data schemas from variaous data sources. Crawlers

#schema registry: is part of your data catalog it helps in managing schema versions. it will store and help evolve the schemas.

#schema registry modes:
backward: new schema can read old data
forward :old schema can read new data
full: both forward and backward
none: no compatilibity checks




#dynamicframes(glue): schema is flexible, we can also convert to dataframes and vice versa. Dataframes are strict on schema its not dynamic but dynamicframes are dynamic.
#data frames: schema is fixed and strict.
#dynamic frames: schema is flexible.

schema flexible
dynamic frames: yes
dataframes : no

null type toleracnce : it more acceptable with null or missing values.
dynamic frame: yes
dataframe : no

nested data : json:
dynamic frame: yes (builtin)
dataframe : no (we manually to flatten, json normalize)

error handling:
dynamic frames: supports errorrecords and errormapping.
dataframes: not supported (manually set up error handling using try except)


can i convert df to dyf?
#convert dynamicframe to df
df = dyf.toDF()

#dataframe to dynamicframe
dyf = dynamicFrame.FromDF(df,gluecontext,'mydynamicframe')


#how to trigger a crawler

#if the data is coming at 12am every midnight , we will set the crawler to run at 12:30 (time based trigger)
#awsglue> crawlers>edit your crawler> under schedule > run on schedule >set daily schedule like cron (30 0 * * ? * ) 12:30am

pros
#simple to setup
#fully managed (AWS)

cons:
#not real time
#can crawl even if data didnt come.

#s3event+ lambda trigger (event based)

set an s3 event notification to trigger a lambda function
lambd will call start_crawler() to launch the crawler

how?
#create a s3 event notification
#trigger on put to 'bucketname'

#Lambda is used to trigger the crawler.
goto lambda function
crate a lambda function
assign IAM

#s3 bucket
# goto s3 bucket in the aws console
# properties
# event notifications
# create event notification

# name: trigger_glue
# event type: put
# bucket: bucketname
# desintation: lambda function
# choose the lambda from your list
# save

#give s3 persmission to invoke lambda


#second method:
# goto lambda function
# create lambda function
# event: object created event
# s3 bucket: select the s3 bucket that you are monitoring
# event type: put
# save





#Create a lambda (object created event)
import boto3

def lambda_handler(event,context):
  glue = boto3.client('glue')
  glue.start_crawler(Name='name of the crawler')
  return {
      'statusCode': 200,
      'body': json.dumps('Crawler started successfully')
  }



#status codes:
1 series: informational
2 series: success
3 series: redirection
4 series: client error
5 series: server error


#pros:
# realtime
# only runs if data is uploaded
# event driven not time driven


#Glue crawler:
#crawlers scan the data source to infers schema and create and update tables in the glue data catalog
#Schema Evolution: it will fix the change of schema from source data and crawlers will automatically update the catalog based on the schema changes.
#crawlers can be scheduled to run  at regular intervals , ensuring the metadata is always up to date.


#AWS glue studio: it is drag and drop tool to create jobs.

#AWS Glue etl jobs: (glue jobs): can be written in python, scala, pyspark.
#extract from source
#tranform data using our tranformation logic (filtereing, joining, deduplication, fillna, dropna, joins, aggregrated columns)
#load the data as well to our final destination (s3, redshift, postgressql, mysql)

from aws.context import GlueContext
from aws.job import Job
from pyspark.context import SparkContext
from awsglue.dynamicFrame import DynamicFrame

sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init

dyf = glueContext.create_dynamic_frame.from_catalog(database= 'landingdb',
                                                    tablename='sales')

#transformations
newdyf = dyf.dropDuplicates()
df = newdyf.toDF()
df = df.dropna
df = df.withColumn('region',upper(df['region']))

#write the data to final s3

df.write.parquet('finals3bucket', index= False)

job.commit()

#s3 event notification > put event > invoke the lambda > the lambda will trigger the crawler using boto3> glue will emit events when crawler changes state to success>
#we will use cloudwatch events (eventbridge) and trigger a gluejob as soon as the crawler event is success.

AWS console> eventbridge > rules>create rule

target > glue job (select the glue job u want to run)

provide iam roles to read the glue catalog, access to read /write to s3.


#option 2
#AWS Glue> workflows

# create a workflow
# add the crawler >first step
# add you glue job as the next step
# add a notification after

lambda trigger after crawler

#cloudwatch events (eventbridge) > it will monitor crawler completion and start glue job.


#glue jobs: automatically scales based on data size and it is serveless.
#pyspark support
#job bookmarks: it will process data incrementally it will keep track of data thats been processed and it will only tranform data that has not been processed.

#job bookmarks:  keep track of last processed record in a hidden table inside the glue data catalog. if timestamp is part of your data , it will remember the last processed timestamp.

#Incremental loading: mainly used for incremental loads, it will use the bookmarks to fetch the records that havent been processed.

#CDC: Change data capture : AWS DMS> it will update existing data in target or increment new data in the target. timestamp columns : created_at, updated_at

#glue automatically manages the bookmarks for you. updating the bookmark state after each run is managed automatically.

#Job parameters> enable job bookmarks.

#dynamic frames:  core feature of glue.
#1) schema is flexible: dynamic frames will handle the evolving schema. we use this when the scchema is very dynamic in real world pipelines.
#2 it automatically infers the schema of incoming data and even if the data comes from multiple sources or if the schema is inconsistent.

#Example
#we are getting
#Customer orders : a set of csv files from customers table
#prodcut inforation: json files with nested data
#customer activity logs : raw log data from the website.

#load the data into aws glue
#clean
#join the data
#store the final data into redshift.

import boto3
from awsglue.context import GlueContext
from pyspark.context import SparkContext
sc = SparkContext()
gluecontext = GlueContext(sc)

ordersdf = gluecontext.create_dynamic_frame.from_options(
    connection_options = {'paths':['s3//path/orders/']}, format = 'csv'
)

#ordersdf = spark.read.csv('path',header=True, inferSchema=True)

productsdf = gluecontext.create_dynamic_frame.from_options(
    connection_type = 's3',
    connection_options = {'paths':['s3//path/products/']}, format = 'csv'
)

activitydf = gluecontext.create_dynamic_frame.from_options(
    connection_type = 's3',
    connection_options = {'paths':['s3//path/activity/']}, format = 'json'
)

gluecontext.write_dynamic_frame.from_options(
    finaldf, connecction_type = 'redshift',
    connection_options= {
        'url':jdbc,'user':username, 'password':password, dbtable:tablename
    }
)



<!-- Cell 5 -->

#SCD Types: Slowly changing dimensions

SCD 0) the table will not allow us to update. the table is fixed and will not allow to overwrite.

SCD 1) i will write it on top of what we have

SCD 2) I will create a new row i will add start date and end date and flag

id | name    | address     | startdate| enddate| flag
1 | indumati | 123 mg road | 01012025 | 03082025| N
1 | indumati | 234 mg road | 03082025 | 31129999| Y


from pyspark.sql import SparkSession
from pyspark.sql.functions import lit, current_date, col,  when
from pyspark.sql.types import *


spark = SparkSession.builder.appName('myapplication').getOrCreate()

customerdfschema = ['id','name','address']

newdf = customerdf.withColumn('startdate',current_date()).withColumn('enddate',lit('9999-12-31')).withColumn('FLAG',lit('Y'))


SCD 3) i will add another new column and track previous or historical data.

id | name       | address           | job title     |  previous job title
1   |  indumati | 123 abc road  | lecturer |          data engineer |

SCD 4) i will track the historical data on  different table.

SCD 6) this is hybrid model which is a combination of 1 + 2 + 3

---

## Cheat Sheet

### Key Commands
[Quick reference commands for this topic]

