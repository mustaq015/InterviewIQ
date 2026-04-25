# 03 Lambda


**Cells:** [6, 7, 8]

---

<!-- Cell 6 -->

# how did you handle incremental loads in your project?

#1 we enabled job bookmarks which will only process the data that has not been processed yet and this was monitored based on timestamp column or the id column.



#2 the files were saved in our landing bucket. we used a directory structure based on timestamps (yyyy_mm_dd) which helped in data management.

#3 set up a system to indentiry which files are new or updated.

#4)  using timestamp(lastupdated/ modified date)
#store the max timestamp processed in config table
#fetch only rows where lastupdated = max(timestamp)

#pyspark
lastprocessedtime= max(col('lastupdated'))
df = spark.read.jdbc(sourceurl, 'table', properties = properties)
df = df.filter(df['lastupdated'] == lastprocessedtime)

#survive | sustain | scale | leave


#CDC : change data capture
#AWS DMS - data migration service

#CDC is a technique that will identify and capture any changes (insert,update,delete) in the source database
#avoid full table scan
#it will be almost real time sync
#ideal for incremental loads


#AWS DMS> are trying to migrate data from one source to another.
Step1: Source DB (mysql)
Step 2: Change capture (AWS DMS): extract changes and move it to s3

1) DMS source endpoint (mysql connection details)
2) DMS target endpoint (s3 details)
3) enable CDC mode (start with full load +CDC, CDC only)
4) the data can be configured to json csv or parquet format


AWS s3: landing zone
Glue : will extract using crawlers
Redshift : load the data to redshift


#done using:

#1 file timestamp: check for files with timestamps greater than the last load time.
#2 we can also do this by having appropriate naming conventions.
#3 we also handled this by using lambda which got triggered by new files in s3.
#4 we would trigger the files based on our naming convention and prefix and suffix. mydata_01012025.json
#5 WE also used CDC (change data capture) by ysing tools like aws dms to capture only the changed rows in the source database. the changes was pushed in redshift.
#6 We used the upsert method (merge) in redshift to update existing rows and load new rows of data.

<!-- Cell 7 -->

#lambda: Severless compute service provided by aws. it will run code and no need to manage servers. JAVA,Scala,python .it runs functions on the lambda environment.
#Mainly used for triggers.
#event based and time based.
#event driven:  it executes code in response to triggers from components like s3, dynamodb, glue, cloudwatch events etc.
#serverless: we dont need to manage any servers, aws handles everything.
#auto scaling: it automaticaly scales the function based on incoming requests.
#It supports python, node js, java, c#, go
#statetless: it is independent and isolated and is not influencing an upcoming event.

#layers: predefined packages that can be loaded to lambda to use withing lambda : eg. pandas layers
#we can also load custom packages through aws cli(command line interface)



<!-- Cell 8 -->

#limitations of lambda
# the maximum execution timeout is 15 minutes.
# max memory allocation of 10GB
# the deployment package in lamdda (code, libraries, dependencies) is limited to 50mb and if deployed through s3 250mb.
# concurrency limit: by default lambda can have 1000 concurrent connections per region (can be increased if needed through aws contacts)
# cold start latency: when i start lambda funtion for the first time it will take time to initiate.

---

## Cheat Sheet

### Key Commands
[Quick reference commands for this topic]

