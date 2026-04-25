# 06 Optimizations


**Cells:** [50, 51, 52, 53, 54, 55]

---

<!-- Cell 50 -->

#second highest salary using pyspark code using window functions.




<!-- Cell 51 -->

#we have processed the data and we need to put the files into csv. the file size is huge (5GB). this will cause issues as the file size is too big for csv.

#reparition before write and maxrecordsperfile this will write multiple files into s3.



<!-- Cell 52 -->

#how will you execute scd type 2 in spark

using withcolumn: startdate, enddate and flag



<!-- Cell 53 -->

#what are the different data validation you do in your project and where did you write this code?
#dupe check
#row count validation
#schema validation
#data type validation
#data completeness validation.

#pre tranformation validation

#post tranformation validation: is to check if we have carried all the tranformations as per requirements.

#Athena : adhoc requirements on raw data on glue data catalog we only use when we need like a adhoc check


<!-- Cell 54 -->

#we ahve a folder and the customer is dumping both csv and json files in my folder how do i process them together?

#folder structure.
#use unionByName() after confirming the format of the file.

<!-- Cell 55 -->

# we have large data 500gb 2 files coming into your s3 bucket.
#how do we optimise this ?

# sortmergejoin
# bucketing pre distribute the data based on join key.

d1.write.bucketby(1000, customerid).sortby(custgomerid).saveasTable('factsales')

---

## Cheat Sheet

### Key Commands
[Quick reference commands for this topic]

