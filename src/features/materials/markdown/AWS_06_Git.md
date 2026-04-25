# 06 Git


**Cells:** [15, 16, 17]

---

<!-- Cell 15 -->

#data distribution:
#when we push the data the data is distributed based on 3 primary methods

#1) key based distribution : data is distributed to nodes and slices based on a specific column. easy to perform joins .
#When we are frequently joining data or frequently used data.

#2) even distribution : data is distributed evenly accross all slices. when we dont hve a key column to distribute on.

#3) all distribution: i will copy the entire table in to eery slice. when the data is small enough to fit into slices. (joins happen within in the slice which mean no shuffling)



<!-- Cell 16 -->

#sort keys:
#it define the order in which data is stored on the disk within each compute node.

#types:

#compound sort key:
#consists of one or more columns with the data sorted in teh order the columns are listed.

#Orders table: orderid | orderdate | productid | region| amount
#sortkey(orderdate, productid, region)

#effective when queries often filter or sort on the leading columns of sort key.


#interleaved sort key: sort the data when we dont want to prioritse a specific column but sorts the data in balanced order.
#best used multipole columns filtering

#sales table : frequently query: region, orderdate, productid

#mixed data with no priority of sorting then i will use interleaved otherwise we ll use compound.




<!-- Cell 17 -->

#optmisation  techiques in redshift:

#1) using the right distribution style
#2) proper use of sort keys.
#3) avoid select *
#4) predication pushdown (applying where)
#5) vaccum and analysing : analyze command to update the statistics to help the query planner optimise the query orders. vaccum to claim back all unused space
#6) avoid unecessay join
#7) inner join instead of left join
#8) column pruning (same as avoiding select * , which is selecting columns that is needed)
#9) paritioning data

---

## Cheat Sheet

### Key Commands
[Quick reference commands for this topic]
