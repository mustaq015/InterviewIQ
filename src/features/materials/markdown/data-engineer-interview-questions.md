# Data Engineer Interview Questions

**Topic:** General
**Pages:** 5
**Source:** C:\Users\User\InterviewIQ\pdf-materials\Data Engineer Interview Questions.pdf

---

Data Engineer Interview Questions

1. Data Modeling & Warehousing
What they asked me:
- How do you design a schema for a Data Warehouse?
- Can you explain Slowly Changing Dimensions (SCD Type 2) with an
example?
What I said:
For schema design, I explained Star vs Snowflake schema with a Sales
Analytics example:
- Fact table: Sales (SalesID, CustomerID, ProductID, Amount, DateID)
- Dimension tables: Customer, Product, Date
For SCD Type 2, I gave a Customer Address Change scenario:
- Old Address row marked as inactive (EndDate + IsCurrent=0)
- New Address row inserted with StartDate & IsCurrent=1
Tips:
Always connect theory to real-world business cases.
Banking (loan applications), Retail (customer orders), or Healthcare (patient
records) make strong examples.

2. SQL & Query Optimization
What they asked me:
- Write a SQL query to fetch the top 5 customers by revenue in the last year.
- How do you handle duplicate records?
What I said:
SQL query for top 5 customers:
SELECT CustomerId, SUM(Revenue) AS TotalRevenue
FROM Orders
WHERE OrderDate >= '2024-01-01'
GROUP BY CustomerId
ORDER BY TotalRevenue DESC
LIMIT 5;
For duplicates, I used ROW_NUMBER() over partition to keep the latest
record:
WITH Ranked AS (
SELECT *, ROW_NUMBER() OVER(PARTITION BY CustomerId
ORDER BY LastUpdated DESC) AS rn
FROM Customer
)
SELECT * FROM Ranked WHERE rn = 1;
Tips:
Prepare window functions, joins, aggregate queries, and CTEs.
Expect optimization topics: indexes, partitions, and query plans.

3. Big Data (Spark / PySpark)
What they asked me:
- How do you handle skewed data in Spark joins?
- Can you explain the difference between cache, persist, and checkpoint?
What I said:
For skew, I used a 2B row Sales Fact + small Product Dim case:
- Applied salting technique (adding random keys)
- Used broadcast join for small tables
Cache/Persist/Checkpoint:
- Cache: Memory-only
- Persist: Memory + Disk with levels
- Checkpoint: Breaks lineage, saves to HDFS for recovery
Tips:
Show you’ve faced real Spark issues (e.g., OOM, shuffle failures).
Mention Spark UI for debugging.

4. ETL & Pipelines (ADF / Airflow / Glue)
What they asked me:
- How do you design incremental data loads from SQL Server to Data Lake?
- What’s the difference between event-driven vs schedule-driven pipelines?
What I said:
For incremental loads: Use a watermark column (LastModifiedDate), store
max value processed, and load only new rows.
Event-driven vs Schedule-driven:
- Event-driven → IoT sensor data triggers pipeline on new file arrival.
- Schedule-driven → Daily batch job at 2 AM.
Tips:
Mention error handling, retries, alerts, monitoring dashboards.
Recruiters value production reliability experience.

5. Cloud & Storage Optimization
What they asked me:
- Compare Delta Lake vs traditional Data Lake.
- How do you optimize queries in Azure Synapse / BigQuery?
What I said:
Delta Lake: ACID transactions, schema enforcement, time travel, merge
support.
Data Lake: raw storage, no transaction support.
Synapse/BigQuery tuning:
- Partitioning & Clustering for large datasets
- Materialized Views for pre-aggregations
- Columnstore Indexing for OLAP performance
Tips:
Balance cost efficiency with query speed.
Always add examples: “We saved $200/month by partition pruning.”

6. Streaming & Real-Time Systems
What they asked me:
- How do you process late arriving Kafka events?
- How would you design a real-time fraud detection system?
What I said:
Kafka late events: Used watermarks + windowing in Spark Structured
Streaming.
Fraud detection pipeline:
- Ingest transactions from Kafka
- Apply rule-based filters (transaction > $10,000 at midnight)
- Feed into ML Model for scoring
- Write suspicious alerts into real-time dashboard (e.g., Power BI, Grafana)
Tips:
Focus on scalability, fault tolerance, and latency.
Recruiters love real-world cases like payments, IoT, or e-commerce.

7. Behavioral & Problem-Solving
What they asked me:
- Tell me about a time when a pipeline failed in production. How did you fix
it?
- How do you prioritize performance vs cost in a cloud pipeline?
What I said:
Scenario: Spark job failed due to shuffle OOM.
- Debugged in Spark UI, tuned partitions, enabled adaptive execution.
Performance vs Cost:
- For batch pipelines → optimize cost
- For real-time alerts → prioritize speed, even if costlier
Tips:
Always use STAR method (Situation, Task, Action, Result).
Show decision-making + collaboration skills.