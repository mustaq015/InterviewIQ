# AWS Cheat Sheet

Quick reference for common AWS operations.

### S3 Operations
```python
import boto3
s3 = boto3.client('s3')
s3.upload_file('local', 'bucket', 'key')
s3.download_file('bucket', 'key', 'local')
```

### Glue Crawler
```python
glue = boto3.client('glue')
glue.start_crawler(Name='crawler_name')
```

### Lambda
```python
lambda_client.invoke(FunctionName='func', Payload=json)
```

### Redshift
```python
df.write.format('jdbc').option('url', url).option('dbtable', table).save()
```