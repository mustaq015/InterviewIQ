# Azure Data Engineer Q&A

**Topic:** Azure
**Pages:** 14
**Source:** C:\Users\User\InterviewIQ\pdf-materials\Azure Data Engineer Q&A.pdf

---

Time travel is a Delta Lake feature that allows querying historical data
(snapshots).
Example: or
Use Case: Debugging, auditing, or recreating datasets for ML models.

## TIMESTAMP AS OF

1️⃣  Parameters and Variables in ADF :

Parameters : Used to pass values at runtime to pipelines. They are
defined at the pipeline level and cannot be changed during execution.
 Variables: Used to store values within the pipeline and can change
during execution. Variables are updated using Set Variable or Append
Variable activities.
2️⃣  Time Travel in Your Project :
SELECT * FROM table_name VERSION AS OF 5
'2023-01-15'
.
3️⃣  Resume Pipeline from Failed Activity :
 Enable checkpointing or activity retry in ADF. Use a failure path with
logic to resume execution by using the Get Metadata activity to
evaluate where the pipeline failed.
4️⃣  Pipelines You've Worked With :
 Example: ETL pipelines to ingest and transform raw data from Azure
Data Lake using Data Flows and Spark jobs.
 Mention specifics like copy data activities , data validation,
and orchestration of transformations .
5️⃣  Partition vs. Bucketing :
These are some excellent Azure Data Engineer interview questions to
prepare! Here's how you can tackle them effectively:
Key Answers:
Partitioning: Divides the data into directories based on keys (e.g., year,
month).
Bucketing: Hashes data into fixed-sized buckets, optimizing joins and
aggregations.
Medallion Architecture :
o
Bronze : Raw ingested data.
o Silver: Cleaned and transformed data.
o
Gold : Business-level aggregates and insights.
7️⃣  Azure Key Vault :
8️⃣  Unity Catalog vs. Hive Metastore :
Joins in PySpark :
 
Inner Join : Matches rows from both datasets based on a condition.
 Left/Right Join: Keeps all rows from the left/right and matches with
the right/left dataset.
 Full Outer Join: Includes all rows from both datasets.
 
Cross Join : Cartesian product of both datasets.
How to Implement Parallel Processing in ADF?
 Use For Each Activity with the Batch Count property set for
parallelism.
 A data architecture that separates data into three layers:
Securely stores secrets, keys, and certificates.
Use in ADF to access Key Vault without hardcoding
credentials.
Managed Identity
Unity Catalog: Centralized data governance and access control for all
your Databricks workspaces.
Hive Metastore: Manages metadata for Hive and Spark tables, but lacks
robust access control.
1️⃣ 1️⃣  Difference Between Narrow and Wide Transformations :
1️⃣ 2️⃣  What is SCD? Explain SCD1, SCD2, SCD3 :
 
SCD (Slowly Changing Dimensions) handles historical changes in
dimension data.
 SCD1: Overwrites old data with new data.
 SCD2: Maintains history by adding new rows for changes (e.g., adding
an Effective_Date ).
 
SCD3 : Adds new columns to store historical data for specific attributes.
1️⃣ 3️⃣  Cluster Options in Databricks :
1️⃣ 4️⃣  Difference Between Managed and External Tables :
Enable in pipeline settings.
Use partitioned datasets for parallel reads/writes to optimize
execution.
concurrent execution
Narrow: Data is processed within the same partition (e.g., map, filter).
Minimal shuffling.
Wide: Data is shuffled across partitions (e.g., groupBy, join). Higher
computational cost.
Standard Cluster: For general-purpose workloads.
High-Concurrency Cluster: Optimized for multiple concurrent users.
Single Node Cluster: For lightweight testing and debugging.
Jobs Cluster: Automatically created for specific jobs and deleted
afterward.
Managed Tables: Databricks manages the data and metadata (stored in
default storage).
External Tables: Data is stored outside Databricks, and only metadata
is managed in the metastore.
1️⃣ 5️⃣  What is a Surrogate Key?
 A unique identifier for a record, not derived from application data.
 Example: Auto-increment ID in databases.
1️⃣
Spark Optimization Techniques :
1️⃣ 7️⃣  Why is Databricks Better Than Dataflow?
 
Flexibility : Databricks supports more complex workloads (e.g., ML,
streaming).
 Notebook Interface: Collaborative development environment.
 Performance: Databricks uses Apache Spark with optimizations like
Delta Lake.
 
Dataflow is simpler for straightforward ETL use cases.
1️⃣ 8️⃣  Difference Between Data Lake and Delta Lake :
1️⃣
Explain Spark Architecture :
Cache/persist frequently used data.
Use for smaller datasets.
Partition data effectively.
Enable for filters.
Avoid wide transformations where possible.
predicate pushdown
broadcast joins
Data Lake: Stores raw, unstructured data. No ACID compliance.
Delta Lake: Built on top of a data lake with ACID transactions, time
travel, and schema enforcement.
Driver: Coordinates execution, maintains DAG, and schedules tasks.
Executors: Run tasks assigned by the driver. Each executor has its
memory and cache.
Cluster Manager: (e.g., YARN, Kubernetes) Allocates resources to the
driver and executors.
2️⃣
Difference Between groupByKey and reduceByKey :
2️⃣ 1️⃣  Why is MapReduce Not Widely Used Now? Similarities Between
Spark and MapReduce?
 
Why not MapReduce :

Similarities :

Spark Advantages :
2️⃣ 2️⃣  What is Delta Lake? Key Features and Creating Delta Tables :

Delta Lake : A storage layer on top of Data Lake offering ACID
compliance and reliability.

Key Features :

Creating Delta Tables :
groupByKey: Groups all key-value pairs by key and shuffles all data.
More memory-intensive.
reduceByKey: Combines values at the mapper side before shuffling,
reducing network traffic. Preferred for better performance.
o High latency due to disk I/O for intermediate results.
o Complex to code compared to Spark.
o Both process large-scale data using distributed computing.
o Use key-value pairs for transformations.
o In-memory computation, faster execution, rich APIs (Python,
Scala).
o ACID transactions.
o Schema enforcement and evolution.
o Time travel and versioning.
2️⃣ 3️⃣  Difference Between Serverless Pool and Dedicated SQL Pool :

Serverless Pool :

Dedicated SQL Pool :
2️⃣ 4️⃣  Prerequisites Before Migration :
2️⃣ 5️⃣  What is a Mount Point in Databricks?
 A mount point is a shortcut to a storage account, enabling easier
access.
 Example: Mounting an Azure Data Lake Gen2 folder using
a
dbutils.fs.mount
command.
2️⃣
How to Optimize Databricks Performance :
 Enable Delta Lake optimizations like Z-ordering and OPTIMIZE.
 Use Auto-scaling for clusters.
 Use broadcast joins for smaller datasets.
 Optimize shuffling with correct partitioning.
 Persist reusable datasets in memory with
cache()
.
CREATE TABLE delta_table USING DELTA LOCATION 'path_to_delta';
o Pay-per-query model.
o Used for ad-hoc queries on data lakes.
o Pre-provisioned resources with fixed cost.
o Designed for high-performance data warehousing.
 Assess source and target environments.
 Ensure schema compatibility.
 Perform data profiling and cleansing.
 Set up network, storage, and permissions.
 Validate data transformation logic.
2️⃣ 7️⃣  Difference Between map and flatMap :
 
map : Transforms each element into another element, 1-to-1 mapping.
 
flatMap : Can produce 0 or more elements per input, 1-to-n mapping.
2️⃣ 8️⃣  How to Fetch Details from Key Vault :
 Use Azure Key Vault Linked Service in ADF or Databricks.
 In Databricks:
2️⃣
Applying Indexing on a Databricks Table :
 Use Delta Lake Z-order indexing :
3️⃣
Transferring Data to Azure Synapse :
3️⃣ 1️⃣  What is Incremental Loading? How to Implement It?
 
Definition : Loading only new or updated data to a target without
reloading the entire dataset.
secret_value = dbutils.secrets.get(scope="key_vault_scope",
key="secret_name")
OPTIMIZE delta_table_name ZORDER BY (column_name);
 Helps improve query performance for large datasets.
Use Azure Data Factory for ETL pipelines.
command in Synapse for fast ingestion from Data Lake.
Databricks-to-Synapse via JDBC connector or PolyBase.

## COPY INTO

 
Implementation :
3️⃣ 2️⃣  How Does Z-Ordering Work?

Z-Ordering : A data layout optimization in Delta Lake that reduces I/O
by co-locating similar data on disk.

How :
3️⃣ 3️⃣  What is Dimension Modeling? Dimension and Fact Tables?
3️⃣ 4️⃣  Difference Between a Data Lake and a Data Warehouse :
 
Data Lake :
MERGE INTO target_table AS target
USING source_table AS source
ON target.id = source.id
WHEN MATCHED THEN UPDATE SET target.col = source.col
Watermarking
Delta Lake
changes.
ADF: Use Lookup + Filter activities.
: Merge using UPSERT logic:
: Use timestamps or surrogate keys to identify
o
WHEN NOT MATCHED THEN INSERT (columns) VALUES (values);
o Applies a multi-dimensional sort algorithm.
o Improves query performance on frequently filtered columns.
OPTIMIZE table_name ZORDER BY (column1, column2);
Dimension Modeling: A design technique for data warehouses to
optimize query performance using star or snowflake schemas.
Fact Tables: Store numeric measures (e.g., sales amount).
Dimension Tables: Describe the context of facts (e.g., customer,
product).

Data Warehouse :
3️⃣ 5️⃣  Using Logic Apps in Your Project :
3️⃣
What is Data Skewness?

Definition : Uneven distribution of data across partitions, leading to
performance bottlenecks.

Mitigation :
o Use salting techniques (adding random keys).
o Optimize partitioning with balanced keys.
3️⃣ 7️⃣  What is Fault Tolerance and Its Use in Real-Time Applications?

Definition : The ability of a system to recover from failures.

Real-Time Use :
3️⃣ 8️⃣  Converting RDD to DataFrame & Vice Versa :
o Stores raw, unstructured data.
o Scalable, cost-effective.
o Example: Azure Data Lake.
o Stores structured, processed data for analytics.
o Schema-on-write.
o Example: Azure Synapse.
 Automates workflows between services like ADF, Synapse, and
notifications.
 Example Use Case:
o Trigger data pipelines based on events (e.g., file upload).
o Send failure alerts via email or Teams.
o Spark achieves fault tolerance by storing lineage and
recomputing lost partitions.
o In ADF, retry policies handle transient failures.

RDD to DataFrame :
 from pyspark.sql import SparkSession
 
DataFrame to RDD :
3️⃣
Encryption Techniques :
 
At Rest : Encrypt data in storage using Azure Storage Service
Encryption (SSE).
 In Transit: Use TLS/SSL for secure data transfer.
 
Column-Level Encryption : Secure sensitive data fields (e.g., PII).
4️⃣
How Does Auto Loader Work?
 A feature in Databricks for incremental file processing from cloud
storage.
 
Working :
4️⃣ 1️⃣  Explain Lazy Evaluation in PySpark :
df = rdd.toDF(schema=["col1", "col2"])
rdd = df.rdd
o Tracks metadata using checkpointing.
o Processes new files automatically.
Example:
.option("cloudFiles.format", "json") \
df = spark.readStream.format("cloudFiles") \
.load("path")
 
Definition : Transformations are not executed immediately but only
when an action (e.g., count , collect ) is triggered.
 
Benefits :
4️⃣ 2️⃣  What is DAG in Spark?

DAG (Directed Acyclic Graph) :

Significance :
4️⃣ 3️⃣  Significance of Catalyst Optimizer in PySpark?

What It Is : A query optimization engine in Spark SQL.

Functions :

Benefits : Better performance with optimized execution plans.
4️⃣ 4️⃣  Query to Find the 4th Highest Salary of an Employee :
SELECT DISTINCT salary
o Optimizes execution by combining transformations into a single
stage.
o Reduces unnecessary computations.
o A sequence of computations where each node represents a
transformation and edges represent dependencies.
o Spark breaks the execution into stages using DAG, ensuring fault
tolerance and optimized execution.
o Tracks lineage for fault recovery.
o Optimizes execution by combining transformations.
o Converts logical plans into optimized physical plans.
o Pushes predicates (filter operations) early to minimize I/O.
4️⃣ 5️⃣  PySpark Command to Read Data from a File into a DataFrame :
 
Other Formats :
o JSON:
spark.read.json("path")
o Parquet:
spark.read.parquet("path")
4️⃣
Handling Nulls and Duplicates in PySpark :

Drop Nulls :

Fill Nulls :

Remove Duplicates :
Alternatively, using ROW_NUMBER:
) ranked
FROM employee
SELECT salary, ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank
FROM (
SELECT salary
FROM employee
LIMIT 4 OFFSET 3;
ORDER BY salary DESC
df = spark.read.csv("path/to/file.csv", header=True, inferSchema=True)
WHERE rank = 4;
df = df.dropna()
df = df.fillna({'col1': 'default_value', 'col2': 0})
4️⃣ 7️⃣  Changing the Date Format for a Date Column :
4️⃣ 8️⃣  What is the Explode Function in PySpark?

Explode : Converts an array or map into multiple rows.

Example :
 from pyspark.sql.functions import explode
4️⃣
Code to Read a Parquet File :
5️⃣
Code to Add a Column to a Parquet File :
5️⃣ 1️⃣  Different Approaches to Creating RDD in PySpark :
 
From a Collection :
df = df.dropDuplicates(['col1', 'col2'])
df = df.withColumn("new_date", date_format("date_column", "yyyy-MM-dd"))
from pyspark.sql.functions import date_format
df = spark.read.parquet("path/to/file.parquet")
df.write.parquet("path/to/updated_file.parquet")
df = df.withColumn("new_column", lit("value"))
df = spark.read.parquet("path/to/file.parquet")
from pyspark.sql.functions import lit
df = df.withColumn("exploded_col", explode("array_col"))
 
From a File :
5️⃣ 2️⃣  Different Approaches to Creating DataFrame in PySpark :
 
From RDD :
 from pyspark.sql import Row
 rdd = spark.sparkContext.parallelize([Row(name="Alice", age=25),
Row(name="Bob", age=30)])
 
From a File :
 
From a List/Dictionary :
 data = [("Alice", 25), ("Bob", 30)]
rdd = spark.sparkContext.parallelize([1, 2, 3, 4])
rdd = spark.sparkContext.textFile("path/to/file.txt")
df = rdd.toDF()
df = spark.read.csv("path/to/file.csv", header=True, inferSchema=True)
df = spark.createDataFrame(data, schema=["name", "age"])
Let me know if you need code expansions or further clarifications!