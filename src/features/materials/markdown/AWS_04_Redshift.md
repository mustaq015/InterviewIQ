# 04 Redshift


**Cells:** [9, 10, 11]

---

<!-- Cell 9 -->

#how to invoke lambda using boto3.

#boto3: the python library used to interact with aws components.

import boto3

lambda_client = boto3.client('lambda', region_name = 'us-east-1')

payload_json = json.dumps({'key':'value'})

response = lambda_client.invoke(
    FunctionName = 'my_lambda_function',
    Payload = payload_json,
    InvocationType = 'RequestResponse'
)

reponse_payload = json.loads(response['Payload'].read().decode('utf-8'))
print(response_payload)




<!-- Cell 10 -->

#invoke a glue job using lambda function



#event and context : gie yous incformation about the trigger and the environment it is running in.
#it has all the information about the trigger for eg
#data from an s3 file upload

'''
{
  "Records": [
    {
      "s3": {
        "bucket": {
          "name": "my-bucket"
        },
        "object": {
          "key": "data/file.csv"
        }
      }
    }
  ]
}



bucketname = event['records'][0]['s3']['bucket']['name']
key = event['records'][0]['s3']['object']['key']
'''
#context : it is passed to the function automatically by aws during runtime.
#function name
#memory limit
#remaining execution time
#aws request id

import boto3
import json

def lamda_handler(event, context):
  glue_client = boto3.client('glue', region_name = 'us-east-1')

  job_name = 'my_glue_job'

  jobarguments = {
      '--arg1': 'value1',
      '--arg2': 'value2'
  }

  response = glue_client.start_job_run(
      JobName = job_name,
      Arguments = jobarguments
  )

  return {
      'statuscode': 200,
      'body': json.dumps('Glue job started successfully')
  }


<!-- Cell 11 -->

##statucode
#100: informational
#200: success
#300: redirection
#400: client error
#500: server error

---

## Cheat Sheet

### Key Commands
[Quick reference commands for this topic]
