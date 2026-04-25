# 05 Joins UDFs


**Cells:** [40, 41, 42, 43, 44, 45, 46, 47, 48, 49]

---

<!-- Cell 40 -->

#there are implications of cost.

# lets make it faster
# increase my cores to 4
# num of executors to 5
# total parallel tasks  = 20

#Start applying optimisation techiques
#broadcast join (for joins)(small df)
#cache (large dataframe)
#repartition > increase the number of parititions (but it shuffles the data)
#coalesce > after tranformation we ll reduce the number of parititions.

#Activate AQE : adaptive query execution : adapt to run time conditions and partition pruning , join selection.
#catalyst optimiser : predicate pushdown (where clause), column pruning (select only the columns that we need), join reordering.



<!-- Cell 41 -->

#driver: maintains metadata nd scheduling tasks
#executor: worker proces that run task and holds dat in memory
#cores per executor: number of tasks each executor can run in parallel
#memory per executor: ram avaiable for tasks and caching.
#overhead memory: 20-30%

#executor memory: (jvmheap + spark storage + shuffle + execution)

#75-80% of you memory is going to heap, the rest is overhead.

#rule of thumb:

default memory partition size: 128mb
total partitions needed = datasize / parition size

5gb data
5*1024 = 5120
paritions = 5120 / 128 = 40 paritions

1 parition = 1 task = 1 core

4 cores in 1 executor
for 40 paritions > 10 executors

#for 1gb
number of partitions: 1*1024/128: 8

4 cores per executor : 2 executors.


we need atleast 40 tasks to process the data efficiently
if you have under 5 paritions tasks become heavy.
if you over paritions 1000 for eg. scheduling process will take alot time.


executor memroy sizing (memory + cores)

executor cores: 4 (good balance)
executor memory: 1core = approx : 2-3gb
so 4 cores : 4*2 = 8gb - 12gb per executor


we need 40 partitions each core can run 1 partition at a time.

with 4 cores per executor : each executor can handle 4 partitions in parallel
so 40/4 = 10 executors

driver memory:
driver doesnt do any heavy jobs its primarily coordination

metadata
shuffles
DAG
for 5gb input data we need approximately  4-8 gb (sufficient)



#final config:

data = 5g
paritions =  40 partitions
with 10 executors * 4 cores = 40 tasks at once.
each executor has around 8-12 gg per executor


#adjustments:
if we are doing alot of joins, wide tranformations we need to increase partitions (2-3x): 100-150partitions
if we are doing only filters and narrow transformations then 40-50 is good engough

check spark ui and make changers accordingly.

if there is one paritions that is taking too long to process what do we do ?

1) reparitions
2) salting (Data skewness)

spark-submit

-- num-executors 10\
--executors-cores 4\
--executor-memory 10g\
--driver-memory 6gb

myfile.py






<!-- Cell 42 -->

#20 node spark cluster
#each node is of size - 16 cpu cores/ approx 4gb per core/ 64gb ram

#each node has 3 executors : 3*4 : 12 cores per node/ 48gb ram

20nodes * 3 executors : 60 executors

total cpu power: 60*4: 240 cpu cores
total memory: 60executors *4cores*4gb percore: 960 GB

how many parallel tasks can we run

240 cpu cores : 240 parallel tasks

#10gb data from s3 buck, filtering data and how many task to run ?

if we create a df for 10gb file : 80 paritions

we only 20 cores
10 secs to process 128mb data.
first 20 tasks  run in parallel
once these 20 tasks are done then next 20 are executed.

how many cycle does it need to run
it needs 4 cycles.

#is there an possibilty of out of memory issues?

each executor has 4 cores and 16gb

300mb is reserved
40% is used to store variable and data
60 % is uised by spark memory. storage and execution memory : 50:50

30% as execution memory in the memory allocated

6gb memoryis what we have for execution.

6gb/4: 1.25gb we actualy have to process the data.

parition size  = 128mb

so we have sufficient memory to run 128 mb for each parition.







<!-- Cell 43 -->

#architecture (Spark) , optimisation techniques, what is reparition, what is coalesce , when do we use them , why do we use them, same with cache, persist with examples
#broadcast join, sortmerge join, when to use them, how does it work. Explain data skewness and what causes this and how can it resolved. what are udf's and how does it work ?
#how to write sql statement in pyspark. how to create manual schema in spark. what was the config for mmeory allocatino for 5gb in spark.

#code: extract data from one source, s3 bucket. do some simple tranformations and move data into another bucket in parquet format.
#second highest salary using window functions in pyspark.



<!-- Cell 44 -->

#1) one key(partition) in a join operation has million of records while others have few, causing stage failure or long running tasks. how do we identify and handle this in pyspark?
df.groupbykey('key').count().orderBy(desc('count')) > this will give me the count by key.

1 : 1000000
2 : 15000
3 : 20000

Solution:
repartition
salting


<!-- Cell 45 -->

#2) you are reading 100k small files (10kb each) from s3 and the job runs very slow , how to fix this issue.

#merge the files into a single and then partition the data: repartition.
# read it into dynamicframes in glue.



<!-- Cell 46 -->

#3) we have a dataset thyat is growing slowly everyday, but only need to process the data when it arrvies.
#what is this and how to solve it.

#incremental Load:
#job bookmarks
#DMS CDC
#timestamping
#versioning
#folder structure


<!-- Cell 47 -->

#4 we are joining a large fact table with a small dimension table. what is the best way to join these?

#solution: Broadcast join.



<!-- Cell 48 -->

#5)  we are getting alot of data from the client into s3 and in these
#files the client is dropping duplicate files as well by mistake how can we make sure we are not considering the duplicates files.

#having appropriate folder structure.
#verisioning: creates a new version
boto3.list_objects_v2(bucket=sourcebucket)
only pick the latest version files using timestamp
#Activate job bookmarks

#Avoid it at source
#maintain a hashtable deduplication table (mysql/ postgressql)
Create table in mysql
fileid | filename | arrivaldate| hashcode

mydata_01012025.csv

list_objects_v2(bucket=sourcebucket)
for i in reponse:



#track the files that have arrived and move the duplicates into a duplicate folder using s3event and lambda.
#boto3(s3).copyobject(duplicatefolder)





<!-- Cell 49 -->

#i have a spark job running and it keeps coming with outofmemory issues. how to solve this problem.

#solution
#reparition
#cache and persist
#allocate more memory
#increase the executor memory

---

## Cheat Sheet

### Key Commands
[Quick reference commands for this topic]

