# 05 Merging


**Cells:** [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122]

---

<!-- Cell 100 -->

#pivot examples


import pandas as pd

data = {
    'Date': ['2023-01-01', '2023-01-01', '2023-01-02', '2023-01-02'],
    'City': ['New York', 'Los Angeles', 'New York', 'Los Angeles'],
    'Temperature': [32, 75, 34, 77],
    'Humidity': [80, 60, 70, 65],
    'Wind Speed': [10, 15, 12, 14]
}

df = pd.DataFrame(data)
print(df)



<!-- Cell 101 -->


newdf = df.pivot(index = 'Date', columns = 'City', values = ['Temperature','Humidity','Wind Speed'])
print(newdf)


<!-- Cell 102 -->


'''
date      losangeles newyork
2023-01-01 75     32
2023-01-02 77     34
'''

<!-- Cell 103 -->

#normalize

import pandas as pd
import json

data1 = {
    'id':123,
    'name':'krish',
    'address':{
        'street':'123 main st',
        'city':'bangalore',
        'state':'karnataka'
    }
}

df = pd.json_normalize(data1)
print(df)


<!-- Cell 104 -->

df

<!-- Cell 105 -->

data2 = [
    {
    'id':'456',
    'name':'ajay',
    'phone':'1234567890',
    'postcode':'560001',
    'orders':[
        {'order_id': 'A1','item':'laptop','price':1000},
        {'order_id': 'A2','item':'mobile','price':500}
    ]},
    {
    'id':'789',
    'name':'krish',
    'phone':'1234567890',
    'postcode':'560001',
    'orders':[
        {'order_id': 'B1','item':'laptop','price':1000},
        {'order_id': 'B2','item':'mobile','price':500}
    ]}

]


<!-- Cell 106 -->

df= pd.json_normalize(data2,record_path='orders', meta=['id','name'])

<!-- Cell 107 -->

df

<!-- Cell 108 -->

#file formats

#csv (comma seperated value)(structured) | excel (xlsx,xlsb,xlsm) (structured) | word (unstructured) |
#pdf (unstructured) | json (semi structured) | parquet(columnar storage) | avro(row based)  | orc(columnar based)


#worked file formats:
#csv | json | parquet | excel


#database: email ingestion
#file format will be in csv or json.

#download and move the file into a centralised foleder (SFTP folder)

#jdbc connection: url | username | password| port number | database name | table name : csv | json

#api connections: (application programming interface): request library : url| autentication details | query string (filter)

<!-- Cell 109 -->

#parquet : file format which is very commonly used in big data environment.
#Column storage: It is faster to search data in columnar storage.
#Faster queries: very fast to determine location of data.
#mainly in big data, we have lot Read and write operations. optimised in parquet format
#data is compressed, it consuming less space.
#parallelism : support parallel processing

#schema evolution: add one or more columns or remove columns it handles the evolved schema automatically.
#Includes metadata , (data about data) (column names, types, schema information)
# mostly used for  ETL | big data processing.
#binary format, so humans cannot read it.



<!-- Cell 110 -->

import pandas as pd

df = pd.DataFrame ({
    'name':['alice','bob','charlie'],
    'age':[25,30,35],
    'city':['newyork','sanfrancisco','losangeles']
})

df.to_parquet('/content/data.parquet')



<!-- Cell 111 -->

newdf = pd.read_parquet('/content/data.parquet')

<!-- Cell 112 -->

newdf

<!-- Cell 113 -->

df = pd.read_csv(/content/financedata.csv)

<!-- Cell 114 -->

#large file : 1000000/100000 = 10
import pandas as pd

chunk = 100000


first_chunk = True

for i in pd.read_csv('path',chunksize = chunk):
  i['uppercity'] = i['city'].str.upper()
  i.to_csv('path', mode=  'a', index = False, header = first_chunk)
  first_chunk = False



<!-- Cell 115 -->

for i in range(10):
  print(i)

<!-- Cell 116 -->

#merge 10 files into a single file using pandas

import pandas as pd
import glob

#glob is used to list all files in a specific folder.

files = glob.glob('path/*.csv')

#use pd.concat which will merge all dataframes into one. I used a list comprehension which will read csvfiles in the fileslist and pd.concat will merge them one by one.
#ignore_index = True : reset the index based on the newdataframe

mergedf = pd.concat([pd.read_csv(file) for file in files], ignore_index=True)

#to_csv: write the new mergeddf to a new csv file

mergedf.to_csv('path', index= False)



<!-- Cell 117 -->

#for different columns in the files.


import pandas as pd
import glob

#glob is used to list all files in a specific folder.

files = glob.glob('path/*.csv')

dfs = []

for file in files:
  df =pd.read_csv(file)
  dfs.append(df)

mergedf = pd.concat(dfs, ignore_index=True, sort=True)

mergedf.to_csv('path', index= False)



<!-- Cell 118 -->

df[df['age']>30]&(df['city'] = 'bangalore')]

<!-- Cell 119 -->

#json normalize
import pandas as pd
import json

<!-- Cell 120 -->

data = [
    {
        "id": 1,
        "name": "Alice",
        "location": {
            "city": "New York",
            "state": "NY"
        },
        "skills": ["Python", "SQL"]
    },
    {
        "id": 2,
        "name": "Bob",
        "location": {
            "city": "San Francisco",
            "state": "CA"
        },
        "skills": ["Java", "AWS"]
    }
]


<!-- Cell 121 -->

from pandas import json_normalize

df = json_normalize(data)

---

## Cheat Sheet

### Key Commands
[Quick reference commands for this topic]

<!-- Cell 122 -->

df
