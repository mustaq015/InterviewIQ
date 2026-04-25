# 05 Airflow


**Cells:** [12, 13, 14]

---

<!-- Cell 12 -->

# prompt: print all status code

status_codes = {
    100: "Informational",
    200: "Success",
    300: "Redirection",
    400: "Client Error",
    500: "Server Error"
}

for code, description in status_codes.items():
  print(f"{code}: {description}")


  #medallion architecture
  #bronze: raw layer (unstructure, semi, structured)
  #silver: cleaning and enriching data (join, filter, cleaning)
  #gold:answring business questions:  aggregration, daily revenue, total sales by region, total salary by department.


<!-- Cell 13 -->

#redshift: Datawarehouse: final tranformed data after all aggregations is stored in datawarehouse and it is used for analytical purposes.
#Redshift | snowflake

# Fully managed petabyte scale datawarehouse service which is part of aws.

#Architecutre
#leader node: manges all communications between client and the cluster.
#coordinates query processing, compiles and optimises the query plan.
#distributes the data across compute nodes. The leader node does not store data but handles metadata and query optimisation.

#compute node: these nodes store data and execute the queries. a redshift cluster can have one or more compute nodes,
#these nodes will handle the actuial procesing of queries. Each compute node is divided into slices with each slice handling a piece of the data.

# Each slice stores a portion of the data and handles a portion of the query workload.

#mpp archiecture: massively parallel processing.

#it also uses columnar storage.

#redshift: it support multiple databases within a single cluster.

#psycopg2 is used to interact with redshift for jdbc connections or we can use boto3.


#redshift also uses columnar storage. (like parquet, orc)
#read optimised, run big data analytics very efficiently. (OLAP)


#parallel query execution:
#redshift divides queries into smaller parts that can be execcuted in parallel across multiple nodes.

#Massively parallel processing: it uses mpp architecture. each node in the cluster works independently to perfom the query execution in parallel. optmises the query performance.

#Redshift spectrum: like athena (servery sql enginer). We can run sql queries ddirectly against data stored in s3 without importing the data into redshift.
#large exabytes of data stored in your datalake

Athena vs redshift:

Athena: serverless, fully managed | query data directly from source for eg: s3, glue data catalog,rds | mainly used for adhoc analysis or validations

Redshift spectrum : it is extension of redshift | servers are managed in redshift (clusters) | when we want to mix redshift data with s3 data.

for eg: join tables in s3 with tables in redshift. | benefits is joining data from redshift without bringing the data into redshift.


<!-- Cell 14 -->

#Features of redshift:
#highly scalable.
#columnar storage
#data compression
#sql query
#mpp architecture
#cost effective (redshift spectrum)
#cross database integration
#parallel processing
#automatic query optimisation



#Limitations
#it is not meant for small data
#it does not support real time data streaming
# it can be expensive depending on the size the data



---

## Cheat Sheet

### Key Commands
[Quick reference commands for this topic]



