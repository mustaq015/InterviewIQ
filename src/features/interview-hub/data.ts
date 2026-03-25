import type { Difficulty } from '../../types';

export type DataEngineeringTopic =
  | 'python'
  | 'pandas'
  | 'sql'
  | 'pyspark'
  | 'aws'
  | 'azure'
  | 'airflow'
  | 'scenarios'
  | 'self-introduction'
  | 'my-resume';

export interface InterviewQuestion {
  id: string;
  question: string;
  answer?: string;
  tips?: string[];
  difficulty: Difficulty;
  company?: string;
}

export interface TopicData {
  id: DataEngineeringTopic;
  name: string;
  icon: string;
  color: string;
  description: string;
  questions: InterviewQuestion[];
}

export const dataEngineeringTopics: Record<DataEngineeringTopic, TopicData> = {
  'my-resume': {
    id: 'my-resume',
    name: 'My Resume',
    icon: 'file-text',
    color: 'bg-indigo-500',
    description: 'Interview questions based on your resume - Mustaqahmed Attar',
    questions: [
      {
        id: 'mr-1',
        question: 'Introduce yourself as a Data Engineer with 4+ years of experience',
        answer: `Hello, I'm Mustaqahmed Attar, a Data Engineer with over 4 years of experience designing and implementing data solutions.

I specialize in Python, PySpark, SQL, AWS, Pandas, and Apache Spark. Throughout my career, I've developed scalable data pipelines, optimized data processing workflows, and ensured data quality.

Currently, I'm working as a Consultant at Capgemini Technologies since April 2023, based in Bangalore, Karnataka. Before this, I was associated with another role from March 2022 to March 2023 in Hyderabad.

My core expertise includes building automated data pipelines using Python and AWS services, implementing ETL scripts and workflows, handling data transformation and cleansing, and ensuring data quality and integrity.

I'm passionate about solving complex data challenges and continuously learning new technologies in the big data ecosystem.`,
        tips: ['Practice this intro', 'Know your tech stack', 'Be ready to elaborate on projects'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'mr-2',
        question: 'What are your key technical skills as mentioned in your resume?',
        answer: `Based on my resume, my technical skills include:

**Programming Languages:**
- Python

**Big Data Technologies:**
- PySpark, Apache Spark

**Databases:**
- SQL

**Cloud Platforms:**
- AWS

**Data Processing:**
- Pandas

**ETL & Orchestration:**
- Apache Airflow

**Version Control:**
- Git

**IDEs:**
- Jupyter Notebook, PyCharm

**Soft Skills:**
- Time Management: Prioritizes essential tasks, sets deadlines to ensure reaching milestones on time
- Adaptability: Can quickly adjust to changing requirements and environments`,
        tips: ['Be ready to explain proficiency level', 'Give examples of each skill usage'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'mr-3',
        question: 'Tell me about your Data Pipeline Automation project',
        answer: `**Project: Data Pipeline Automation**
**Duration:** January 2024 - Present
**Technologies:** Python, SQL, AWS, Pandas

**Description:**
I developed an automated data pipeline using Python and AWS services to extract, transform, and load data from various sources into a centralized data repository.

**Roles & Responsibilities:**
- Design and implement the data pipeline architecture
- Develop ETL scripts and workflows
- Handle data transformation and cleansing
- Automate data ingestion processes
- Monitor and troubleshoot pipeline issues
- Collaborate with stakeholders to understand data requirements

**Key Achievements:**
- Built scalable automated pipelines reducing manual effort
- Implemented robust error handling and monitoring
- Improved data quality through automated validation`,
        tips: ['Use STAR method', 'Emphasize automation', 'Mention scalability'],
        difficulty: 'medium',
        company: 'Capgemini'
      },
      {
        id: 'mr-4',
        question: 'Explain your Data Lake Orchestration project',
        answer: `**Project: Automated Data Lake Orchestration**
**Technologies:** Python, SQL, AWS, Pandas

**Description:**
I implemented a Python-driven AWS Solution for Effortless Data Ingestion, Processing, and Querying.

**Key Responsibilities:**
- Architect and Configure Data Lake Architecture on AWS
- Develop ETL Workflows utilizing AWS Glue for Data Ingestion and Transformation
- Optimize Data Querying with Amazon Athena
- Ensure Data Quality and Integrity throughout the pipeline

**AWS Services Used:**
- AWS Glue for ETL
- Amazon Athena for querying
- S3 for data lake storage
- Python for orchestration and automation`,
        tips: ['Know AWS Glue well', 'Understand Data Lake concepts', 'Mention cost optimization'],
        difficulty: 'medium',
        company: 'Capgemini'
      },
      {
        id: 'mr-5',
        question: 'What is your experience with Python for data engineering?',
        answer: `I have extensive experience with Python for data engineering tasks:

**Data Processing:**
- Used Pandas for data manipulation, transformation, and analysis
- Performed data cleansing and preprocessing with Python

**ETL Development:**
- Built ETL scripts using Python
- Automated data workflows with Python

**AWS Integration:**
- Used boto3 for AWS resource management
- Integrated Python with AWS Glue, Lambda, and other services

**Libraries Used:**
- pandas, numpy for data processing
- boto3 for AWS SDK
- pyarrow, fastparquet for Parquet file handling
- SQLAlchemy for database connections

**Example Use Case:**
In my Data Pipeline Automation project, I used Python to orchestrate data extraction from multiple sources, perform transformations using Pandas, and load data into AWS S3 data lake.`,
        tips: ['Give specific examples', 'Mention libraries used', 'Show automation skills'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'mr-6',
        question: 'How have you used AWS for data engineering?',
        answer: `My AWS experience for data engineering includes:

**Core AWS Services:**
- **AWS Glue:** Used for ETL workflows, data ingestion, and transformation
- **Amazon Athena:** Querying data stored in S3 using SQL
- **Amazon S3:** Data lake storage, partitioned data storage
- **AWS Lambda:** Serverless functions for event-driven processing

**Data Pipeline:**
- Built automated pipelines using Python and AWS services
- Implemented data ingestion from various sources to centralized repository
- Created scalable data processing workflows

**Data Lake Architecture:**
- Architected and configured Data Lake on AWS
- Implemented proper partitioning and file formats (Parquet)
- Set up data quality checks and monitoring

**Cost Optimization:**
- Used Athena partitioning for cost-efficient queries
- Implemented efficient data storage strategies`,
        tips: ['Know Glue and Athena well', 'Understand S3 data lake concepts', 'Mention security best practices'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'mr-7',
        question: 'What is your experience with SQL as a Data Engineer?',
        answer: `SQL is a core skill in my data engineering toolkit:

**Experience:**
- Writing complex queries for data extraction and analysis
- Creating and optimizing SQL queries for data pipelines
- Using SQL for data transformation and aggregation
- Working with various SQL databases

**Key Capabilities:**
- JOIN operations (INNER, LEFT, RIGHT, FULL OUTER)
- Window functions for analytical queries
- Subqueries and CTEs
- Creating views and materialized views
- Database optimization and indexing
- Stored procedures for ETL logic

**In AWS Context:**
- Used Amazon Athena (Presto-based SQL) for S3 data querying
- Written SQL queries in Glue jobs for data transformation
- Optimized queries for performance in Athena

**Example:**
In my Data Lake project, I used SQL extensively in AWS Athena to perform ad-hoc analysis on S3 data, and in Glue jobs for data transformation logic.`,
        tips: ['Be ready for SQL coding questions', 'Know window functions', 'Understand query optimization'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'mr-8',
        question: 'How do you handle data quality in your pipelines?',
        answer: `Data quality is a critical aspect of my data engineering work:

**Validation Approaches:**
- Schema validation at ingestion
- Data type checking
- Null value handling
- Duplicate detection and removal
- Range and format validation

**In My Projects:**
1. **Data Pipeline Automation:**
   - Implemented automated validation at each stage
   - Created alerts for data quality issues
   - Monitored and troubleshot pipeline issues

2. **Data Lake Orchestration:**
   - Ensured data quality and integrity throughout the pipeline
   - Implemented data profiling to identify issues
   - Used Athena to validate data quality through queries

**Best Practices I Follow:**
- Implement data quality checks early in the pipeline
- Log all validation failures with detailed error messages
- Create data quality dashboards
- Set up alerting for threshold breaches
- Document data quality metrics`,
        tips: ['Mention specific tools', 'Give examples from projects', 'Show proactive approach'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'mr-9',
        question: 'Tell me about your experience with Apache Airflow',
        answer: `Based on my resume, Apache Airflow is one of my key skills:

**Experience Level:**
- Proficient in ETL & Orchestration using Apache Airflow
- Used for orchestrating complex data workflows

**Capabilities:**
- Creating and managing DAGs (Directed Acyclic Graphs)
- Defining tasks and dependencies
- Scheduling and monitoring workflows
- Handling task retries and error handling
- Using Airflow operators (PythonOperator, BashOperator, etc.)

**Integration:**
- Integrated Airflow with AWS services
- Used for scheduling and monitoring data pipelines
- Automated data ingestion and processing workflows

**Best Practices:**
- Proper DAG structure and organization
- Error handling and alerting
- Monitoring task execution
- Managing task dependencies`,
        tips: ['Be ready for DAG design questions', 'Know operators well', 'Understand scheduling'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'mr-10',
        question: 'How do you collaborate with stakeholders to understand data requirements?',
        answer: `Based on my project experience, here's how I approach stakeholder collaboration:

**Understanding Requirements:**
- Meet with business users and analysts to understand data needs
- Gather requirements for data sources, transformations, and outputs
- Document data requirements clearly

**Communication:**
- Translate technical concepts for non-technical stakeholders
- Provide regular updates on pipeline status
- Share data quality reports and metrics

**In My Projects:**

**Data Pipeline Automation:**
- Collaborated with stakeholders to understand data requirements
- Designed pipelines based on business needs
- Ensured requirements were met through validation

**Data Lake Orchestration:**
- Worked with data analysts to understand querying needs
- Optimized data structure based on user feedback
- Ensured data accessibility for end users

**Key Skills:**
- Active listening
- Clear documentation
- Regular communication
- Flexibility to adapt to changing requirements`,
        tips: ['Emphasize communication skills', 'Show requirement documentation', 'Mention feedback loops'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'mr-11',
        question: 'Describe your experience at Capgemini',
        answer: `**Capgemini Technologies**

**Current Role:** Consultant
**Location:** Bangalore, Karnataka
**Duration:** April 2023 - Present

At Capgemini, I've been working on data engineering projects involving:

**Project 1: Data Pipeline Automation**
- Develop automated data pipelines using Python and AWS
- Extract, transform, and load data from various sources
- Design and implement data pipeline architecture
- Monitor and troubleshoot pipeline issues

**Project 2: Automated Data Lake Orchestration**
- Architect and configure Data Lake on AWS
- Develop ETL workflows using AWS Glue
- Optimize querying with Athena
- Ensure data quality and integrity

**Skills Applied:**
- Python, SQL, AWS, Pandas
- AWS Glue, Athena, S3
- Apache Airflow
- Git version control

**Key Achievements:**
- Built scalable automated pipelines
- Improved data processing efficiency
- Ensured high data quality standards`,
        tips: ['Know project details well', 'Be ready to discuss tech stack', 'Show progression'],
        difficulty: 'medium',
        company: 'Capgemini'
      },
      {
        id: 'mr-12',
        question: 'What is your experience with PySpark and Apache Spark?',
        answer: `Based on my resume, I have experience with PySpark and Apache Spark:

**Skills Listed:**
- Big Data Technologies: PySpark, Apache Spark

**Experience:**
- Used PySpark for processing large datasets
- Worked with distributed data processing
- Implemented transformations using Spark DataFrames

**Common Operations:**
- Reading/writing data from various sources (S3, HDFS)
- DataFrame operations and transformations
- Using Spark SQL for querying
- Optimizing Spark jobs for performance

**In AWS Context:**
- Often used with AWS EMR for cluster processing
- Integrated with AWS Glue for ETL

**Best Practices:**
- Partitioning data for parallel processing
- Using appropriate data formats (Parquet)
- Avoiding actions that collect data to driver
- Monitoring Spark UI for optimization opportunities`,
        tips: ['Be ready for Spark coding questions', 'Know DataFrame API', 'Understand distributed computing'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'mr-13',
        question: 'How do you monitor and troubleshoot pipeline issues?',
        answer: `Monitoring and troubleshooting is a key part of my role:

**Monitoring Approach:**
- Set up automated monitoring for pipeline execution
- Create alerts for failures and anomalies
- Track data quality metrics
- Monitor data processing times

**In My Projects:**

**Data Pipeline Automation:**
- Monitored pipeline execution in real-time
- Tracked data quality metrics
- Set up alerts for pipeline failures
- Troubleshot issues quickly to minimize downtime

**Tools Used:**
- AWS CloudWatch for AWS service monitoring
- Airflow UI for workflow monitoring
- Custom logging in Python scripts
- Athena queries for data validation

**Troubleshooting Steps:**
1. Check logs for error messages
2. Identify the failing stage/component
3. Analyze data quality at each stage
4. Fix and re-run the pipeline
5. Document the issue and resolution

**Prevention:**
- Implement robust error handling
- Add retry logic for transient failures
- Create data quality checks`,
        tips: ['Show systematic approach', 'Emphasize quick resolution', 'Mention monitoring tools'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'mr-14',
        question: 'Why should we hire you as a Data Engineer?',
        answer: `Here are the reasons why I'm a strong candidate:

**Experience:**
- 4+ years of experience in data engineering
- Proven track record with Python, PySpark, SQL, AWS, and Pandas

**Technical Skills:**
- Built scalable data pipelines
- Implemented data lakes on AWS
- Automated ETL workflows
- Strong in both batch and streaming processing

**Project Experience:**
- Data Pipeline Automation: End-to-end pipeline development
- Data Lake Orchestration: AWS Glue, Athena, S3 expertise

**Soft Skills:**
- Time Management: Deliver projects on schedule
- Adaptability: Quick to learn and adapt to new technologies
- Good communication and collaboration skills

**Commitment:**
- Passionate about data engineering
- Continuously learning new technologies
- Focused on data quality and reliability

**Value I Bring:**
- Can start contributing immediately
- Understands cloud-native data solutions
- Brings both technical and analytical skills`,
        tips: ['Be confident', 'Match requirements', 'Show enthusiasm'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'mr-15',
        question: 'Where do you see yourself in 3 years as a Data Engineer?',
        answer: `In 3 years, I see myself:

**Short-term (1 year):**
- Deepen expertise in cloud data platforms (AWS)
- Master advanced data engineering patterns
- Take ownership of complex projects

**Medium-term (2-3 years):**
- Transition to Senior Data Engineer role
- Lead technical design decisions
- Mentor junior team members
- Expand into data architecture

**Areas of Focus:**
- Real-time data processing (Kafka, Flink)
- Advanced analytics and ML pipelines
- Data mesh and modern data platforms
- Cloud certifications (AWS Solutions Architect)

**Contributions:**
- Build robust, scalable data solutions
- Contribute to team growth
- Drive best practices and standards

**Alignment:**
- Growing with the company
- Taking on increasing responsibilities
- Staying updated with industry trends`,
        tips: ['Show ambition', 'Align with company growth', 'Be realistic'],
        difficulty: 'easy',
        company: 'Common'
      }
    ]
  },
  python: {
    id: 'python',
    name: 'Python',
    icon: 'code',
    color: 'bg-yellow-500',
    description: 'Python programming concepts, libraries, and best practices',
    questions: [
      {
        id: 'py-1',
        question: 'What is __init__ in Python?',
        answer: `__init__ is the constructor method called automatically when a new object is created from a class. It initializes the object's attributes.`,
        tips: ['Called automatically on object creation', 'Sets initial state of object', 'Similar to constructors in other OOP languages'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'py-2',
        question: 'What are Decorators in Python?',
        answer: `Decorators wrap a function to extend its behavior without modifying it. Example: @log_time wraps a function to measure its execution time.

  def log_time(func):
      def wrapper(*args, **kwargs):
         import time
         start = time.time()
         result = func(*args, **kwargs)
         print(time.time() - start)
         return result
      return wrapper`,
        tips: ['Use @decorator_name syntax', 'Wraps function with additional functionality', 'Common uses: logging, timing, authentication'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'py-3',
        question: 'What is Inheritance and its types?',
        answer: `Inheritance lets a class reuse another class's attributes/methods. Types: Single (one parent), Multiple (many parents), Multilevel (chain), Hierarchical (many children from one parent), Hybrid (combination).`,
        tips: ['Promotes code reusability', 'Use super() to call parent methods', 'Python supports all inheritance types'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'py-4',
        question: 'What is a Lambda function?',
        answer: `An anonymous, one-line function. Used with map(), filter(), reduce().
Example: map(lambda x: x*2, [1,2,3]) → [2,4,6].`,
        tips: ['Lambda for simple operations', 'map/filter return iterators in Python 3', 'reduce requires functools module'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'py-5',
        question: 'List Comprehension vs Dictionary Comprehension',
        answer: `List: [x**2 for x in range(5)]. Dict: {k: v for k, v in items}. Both offer concise, readable alternatives to loops.`,
        tips: ['More concise than loops', 'Dict comp uses key:value syntax', 'Can include conditional logic'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'py-6',
        question: 'Python Libraries Used',
        answer: `NumPy → arrays; Pandas → DataFrames; Scikit-learn → ML; TensorFlow → deep learning; Flask/Django → APIs; Boto3 → AWS SDK; PySpark → distributed processing.`,
        tips: ['NumPy for numerical computing', 'Pandas for data manipulation', 'Boto3 for AWS integration'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'py-7',
        question: 'List vs Tuple vs Set vs Dictionary',
        answer: `List: ordered, mutable. Tuple: ordered, immutable, faster. Set: unordered, unique values. Dict: key-value pairs, fast lookup. Use tuple for fixed data, set for deduplication.`,
        tips: ['Use tuple for fixed data', 'Sets for unique collections', 'Dicts for key-based lookup'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'py-8',
        question: 'Shallow Copy vs Deep Copy',
        answer: `Shallow copy copies the object but references nested objects. Deep copy copies everything recursively. Use copy.deepcopy() to avoid shared references.`,
        tips: ['Shallow: copies top-level only', 'Deep: copies all nested objects', 'copy.deepcopy() avoids shared references'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'py-9',
        question: '*args and **kwargs',
        answer: `*args captures positional arguments as a tuple. **kwargs captures keyword arguments as a dictionary. Used for flexible function signatures.`,
        tips: ['*args for variable positional args', '**kwargs for variable keyword args', 'Combined: def func(*args, **kwargs)'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'py-10',
        question: 'Error/Exception Handling',
        answer: `Use try/except/finally blocks. Catch specific exceptions (ValueError, KeyError). Use finally for cleanup. Raise custom exceptions with raise.`,
        tips: ['Catch specific exceptions', 'Use finally for cleanup', 'raise for custom exceptions'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'py-11',
        question: 'Threading in Python',
        answer: `Threading allows concurrent execution of tasks using the threading module. Ideal for I/O-bound tasks (API calls, file reads) where waiting time can be overlapped.`,
        tips: ['Good for I/O-bound tasks', 'Limited by GIL for CPU tasks', 'Use multiprocessing for CPU-bound'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'py-12',
        question: 'Multi-threading vs Multi-processing',
        answer: `Multi-threading: shares memory, limited by GIL, good for I/O-bound. Multi-processing: separate memory spaces, bypasses GIL, good for CPU-bound tasks.`,
        tips: ['Threading for I/O tasks', 'Multiprocessing for CPU tasks', 'GIL limits true parallelism in threads'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'py-13',
        question: 'Garbage Collection in Python',
        answer: `Python uses reference counting → objects are deleted when their count hits zero. The gc module handles cyclic references using a generational garbage collector.`,
        tips: ['Reference counting is automatic', 'gc module handles circular refs', 'Generational approach for efficiency'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'py-14',
        question: 'GIL (Global Interpreter Lock)',
        answer: `GIL is a mutex that allows only one thread to execute Python bytecode at a time. It prevents true parallelism in threads but doesn't affect multi-processing or I/O-bound concurrency.`,
        tips: ['Affects threads, not processes', 'GIL released during I/O', 'Use multiprocessing for CPU parallelism'],
        difficulty: 'medium',
        company: 'Google'
      },
      {
        id: 'py-15',
        question: 'Magic Methods in Python',
        answer: `Special Magic methods like __str__, __len__, __eq__, __add__ that define how objects behave with built-in operations and functions.`,
        tips: ['Dunder methods (double underscore)', 'Define object behavior', '__str__ for string representation'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'py-16',
        question: 'OOP Concepts',
        answer: `Encapsulation: hide internal state. Abstraction: hide implementation. Polymorphism: same interface, different behavior. Inheritance: reuse parent class logic.`,
        tips: ['Encapsulation for data protection', 'Abstraction for simplicity', 'Polymorphism for flexibility'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'py-17',
        question: 'Batch Processing',
        answer: `Processing data in chunks rather than all at once. Use chunksize in Pandas or loop over file batches. Reduces memory usage for large datasets.`,
        tips: ['Use chunksize parameter', 'Loop over batches', 'Reduces memory footprint'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'py-18',
        question: 'REST APIs – Build or Consume',
        answer: `Build with Flask/FastAPI. Consume with requests library. Use GET/POST/PUT/DELETE methods, handle JSON responses, and manage auth tokens/headers.`,
        tips: ['Flask/FastAPI for building APIs', 'requests for consuming APIs', 'Handle authentication properly'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'py-19',
        question: 'Security for Python Code',
        answer: `Use environment variables for secrets, never hardcode credentials. Use hashlib for hashing, HTTPS for APIs, input validation to prevent injection, and bandit for static analysis.`,
        tips: ['Environment variables for secrets', 'Hashlib for hashing', 'Input validation'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'py-20',
        question: 'Method Overriding vs Overloading',
        answer: `Overriding: child class redefines parent method. Overloading: same method name with different parameters → Python doesn't natively support it but uses *args or @singledispatch.`,
        tips: ['Override replaces parent method', 'Overload same name, different params', 'Python uses *args for overloading'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'py-21',
        question: 'Constructors in Python',
        answer: `__init__ is the instance constructor. __new__ creates the object before __init__ initializes it. Default constructor takes only self; parameterized takes additional args.`,
        tips: ['__new__ before __init__', 'Default vs parameterized', '__init__ most commonly used'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'py-22',
        question: 'Handle Errors in REST APIs',
        answer: `Check HTTP status codes (4xx = client error, 5xx = server error). Use try/except with requests.exceptions. Implement retries with exponential backoff.`,
        tips: ['Check status codes', 'requests.exceptions', 'Exponential backoff'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'py-23',
        question: 'Handle Missing Data in Pipeline',
        answer: `Detect with df.isnull(). Fill with defaults (fillna), forward fill, or drop rows. For critical fields, raise errors. Log missing records for audit.`,
        tips: ['df.isnull() for detection', 'fillna() for replacement', 'Log for audit'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'py-24',
        question: 'JDBC Connections in Python',
        answer: `Use jaydebeapi or pyodbc to connect via JDBC. Pass connection string, driver, credentials. Fetch results into Pandas DataFrames. Common for connecting to Oracle, SQL Server.`,
        tips: ['jaydebeapi or pyodbc', 'Connection string needed', 'Pandas integration'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'py-25',
        question: 'Ingest Data from External API',
        answer: `Use requests.get(url, headers=headers), parse JSON response, convert to DataFrame, validate schema, and write to target (S3, DB). Handle pagination and rate limits.`,
        tips: ['requests library', 'Pagination handling', 'Rate limit management'],
        difficulty: 'medium',
        company: 'Common'
      }
    ]
  },
  pandas: {
    id: 'pandas',
    name: 'Pandas',
    icon: 'table',
    color: 'bg-blue-500',
    description: 'Data manipulation and analysis with Pandas library',
    questions: [
      {
        id: 'pd-1',
        question: 'DataFrame vs Series',
        answer: `Series: 1D labeled array. DataFrame: 2D table with rows and columns. DataFrame is a collection of Series sharing the same index.`,
        tips: ['Series is 1D', 'DataFrame is 2D', 'DataFrame contains Series'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-2',
        question: 'Create a DataFrame from Python Data',
        answer: `pd.DataFrame({'col1': [1,2], 'col2': [3,4]}) → from dict. Also from list of dicts, NumPy arrays, or CSV/JSON files.`,
        tips: ['From dict: pd.DataFrame()', 'From list of dicts', 'From CSV/JSON files'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-3',
        question: 'Read Different File Formats',
        answer: `pd.read_csv(), pd.read_json(), pd.read_parquet(), pd.read_excel(). Parquet is most efficient for large datasets due to columnar storage.`,
        tips: ['pd.read_csv() for CSV', 'pd.read_parquet() for Parquet', 'Parquet is most efficient'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-4',
        question: 'Handle Null/Missing Values',
        answer: `df.fillna(0) fills with a value. df.dropna() removes rows with nulls. df.fillna(method='ffill') forward fills. Use df.isnull().sum() to detect nulls.`,
        tips: ['fillna() to fill', 'dropna() to remove', 'isnull().sum() to detect'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-5',
        question: 'Remove Duplicate Rows',
        answer: `df.drop_duplicates() removes all duplicate rows. Use subset=['col'] to check specific columns. keep='first' or keep=False to control which to drop.`,
        tips: ['drop_duplicates()', 'subset parameter', 'keep parameter'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-6',
        question: 'Join/Merge Multiple DataFrames',
        answer: `Use pd.merge(df1, df2, on='key', how='inner'). Chain multiple merges. For same-structure DataFrames, use pd.concat([df1, df2]).`,
        tips: ['pd.merge() for joins', 'pd.concat() for stacking', 'how parameter for join type'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-7',
        question: 'Merge vs Join vs Concat',
        answer: `Merge: SQL-style join on columns. Join: index-based merge shortcut. Concat: stacks DataFrames vertically or horizontally without key alignment.`,
        tips: ['Merge for column joins', 'Join for index joins', 'Concat for stacking'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-8',
        question: 'Rename a Column',
        answer: `df.rename(columns={'old': 'new'}, inplace=True). Or reassign: df.columns = ['a','b','c']. Use inplace=True to modify in place.`,
        tips: ['rename() method', 'Direct column assignment', 'inplace parameter'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-9',
        question: 'Group Data with groupby()',
        answer: `df.groupby('dept')['salary'].mean(). Supports aggregations: sum, count, max, agg({'col': 'sum'}). Returns a GroupBy object until aggregated.`,
        tips: ['groupby() creates GroupBy object', 'Aggregation functions follow', 'agg() for multiple aggregations'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-10',
        question: 'apply() on Columns',
        answer: `df['col'].apply(lambda x: x*2) applies a function element-wise. df.apply(func, axis=1) applies row-wise. Slower than vectorized ops but flexible.`,
        tips: ['apply() for custom functions', 'axis=1 for row-wise', 'Vectorized is faster'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-11',
        question: 'Create New Columns',
        answer: `df['new_col'] = df['a'] + df['b']. Use assign() for chaining: df.assign(total=df['a']+df['b']). Apply functions with apply() for complex logic.`,
        tips: ['Direct assignment', 'assign() for chaining', 'apply() for complex logic'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-12',
        question: 'Pivot a DataFrame',
        answer: `pivot() reshapes without aggregation (requires unique index). pivot_table() allows aggregation for duplicate values. Use aggfunc='sum' for rollups.`,
        tips: ['pivot() without aggregation', 'pivot_table() with aggregation', 'aggfunc for rollups'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-13',
        question: 'Handle Large Datasets',
        answer: `Use chunksize in read_csv(), Dask for parallel processing on multi-core, or Modin as a drop-in Pandas replacement for speed. Move to PySpark for truly large data.`,
        tips: ['chunksize for reading', 'Dask for parallel', 'PySpark for large data'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'pd-14',
        question: 'Date-Time Data in Pandas',
        answer: `Parse with pd.to_datetime(). Extract components: df['date'].dt.year, .dt.month. Resample time-series: df.resample('M').sum().`,
        tips: ['pd.to_datetime()', 'dt accessor for components', 'resample() for time series'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-15',
        question: 'Combine Multiple CSVs',
        answer: `pd.concat([pd.read_csv(f) for f in glob.glob('*.csv')]). Use ignore_index=True to reset index. Process in chunks if files are large.`,
        tips: ['pd.concat()', 'glob.glob() for file list', 'ignore_index for reset'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-16',
        question: 'Join Two Large Datasets Efficiently',
        answer: `Set join keys as index before merging. Reduce memory by downcasting dtypes. Use merge with on key. For very large data, use chunked merges or switch to PySpark/Dask.`,
        tips: ['Set index for joins', 'Downcast dtypes', 'PySpark/Dask for large data'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'pd-17',
        question: 'Explode Nested JSON with Pandas',
        answer: `import pandas as pd, json
df = pd.json_normalize(data, record_path=['items'],
    meta=['id','name'])`,
        tips: ['json_normalize()', 'record_path for nested', 'meta for parent fields'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'pd-18',
        question: 'Handle Errors in Pandas',
        answer: `Use try/except around I/O operations. Use errors='coerce' in pd.to_numeric() to turn invalid values to NaN. Validate schema before processing.`,
        tips: ['try/except for I/O', "errors='coerce'", 'Schema validation'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-19',
        question: 'Read Excel and Convert to CSV',
        answer: `df = pd.read_excel('file.xlsx')
df.to_csv('output.csv', index=False)`,
        tips: ['pd.read_excel()', 'to_csv()', 'index=False to skip index'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-20',
        question: 'Create DataFrame with 2 Columns',
        answer: `df = pd.DataFrame({
    'file_name': ['a.txt','b.csv'],
    'size': [1024, 2048]
})`,
        tips: ['pd.DataFrame()', 'Dict of lists', 'Column names and values'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-21',
        question: "Join DataFrames and Fill NaN in 'age'",
        answer: `merged = pd.merge(df1, df2,
    on='user_id', how='left')
merged['age'].fillna(30, inplace=True)`,
        tips: ['pd.merge()', 'fillna()', 'inplace=True'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-22',
        question: 'Write DataFrame to CSV',
        answer: `Pandas: df.to_csv('output.csv', index=False). PySpark: df.write.csv('s3://bucket/path', header=True). For S3, use Boto3 or Spark's S3 connector.`,
        tips: ['to_csv() for Pandas', 'write.csv() for PySpark', 'Boto3 for S3'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-23',
        question: 'Data Structures in Pandas',
        answer: `Series: 1D labeled array. DataFrame: 2D table. Index: row/column labels. MultiIndex: hierarchical indexing for complex groupings. Panel was removed in newer versions.`,
        tips: ['Series 1D', 'DataFrame 2D', 'MultiIndex for hierarchy'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'pd-24',
        question: 'map() vs apply() in Pandas',
        answer: `map() works element-wise on a Series only, ideal for simple value substitutions. apply() works on both Series and DataFrames, supports complex functions, and can operate row-wise (axis=1) or column-wise.`,
        tips: ['map() for Series only', 'apply() for Series and DataFrame', 'axis=1 for row-wise'],
        difficulty: 'easy',
        company: 'Common'
      }
    ]
  },
  sql: {
    id: 'sql',
    name: 'SQL',
    icon: 'database',
    color: 'bg-green-500',
    description: 'SQL queries, joins, aggregations and database concepts',
    questions: [
      {
        id: 'sql-1',
        question: 'Relational vs Non-Relational Databases',
        answer: `Relational: structured, SQL, schema-enforced (MySQL, PostgreSQL, Redshift). Non-Relational: flexible schema, NoSQL (MongoDB, DynamoDB, Cassandra). Use NoSQL for unstructured or high-scale data.`,
        tips: ['Relational: SQL and schema', 'NoSQL: flexible schema', 'Choose based on data type'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sql-2',
        question: 'OLAP vs OLTP',
        answer: `OLTP: transactional, row-based, real-time updates (MySQL). OLAP: analytical, columnar, aggregations on large datasets (Redshift). OLAP reads wide; OLTP writes frequently.`,
        tips: ['OLTP for transactions', 'OLAP for analytics', 'Different storage orientations'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sql-3',
        question: 'Normalization and Its Types',
        answer: `1NF: atomic values. 2NF: no partial dependencies. 3NF: no transitive dependencies. Advantage: reduces redundancy. Disadvantage: more joins, slower queries.`,
        tips: ['1NF: atomic values', '2NF: no partial dependencies', '3NF: no transitive dependencies'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sql-4',
        question: 'De-normalization',
        answer: `Combining tables to reduce joins. Used in OLAP/data warehouses for query performance. Trade-off: data redundancy increases but read speed improves significantly.`,
        tips: ['Reduces joins', 'Improves read performance', 'Increases redundancy'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sql-5',
        question: 'Views in SQL',
        answer: `A virtual table defined by a SELECT query. Benefits: simplify complex queries, add security layer, hide implementation. Data is not stored → computed at query time.`,
        tips: ['Virtual table', 'Computed at query time', 'Security layer'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sql-6',
        question: 'Materialized View',
        answer: `Stores query results physically. Faster reads than regular views. Must be refreshed manually or on schedule. Used for pre-aggregated reporting tables in data warehouses.`,
        tips: ['Stored physically', 'Faster reads', 'Refresh on schedule'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sql-7',
        question: 'Window Functions',
        answer: `ROW_NUMBER(): unique rank. RANK(): gaps on ties. DENSE_RANK(): no gaps. LAG/LEAD: access previous/next row. SUM OVER(PARTITION BY): running totals. All use the OVER() clause.`,
        tips: ['OVER() clause', 'ROW_NUMBER, RANK, DENSE_RANK', 'LAG/LEAD for navigation'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sql-8',
        question: 'Types of JOINs',
        answer: `INNER: matching rows only. LEFT: all left + matching right. RIGHT: all right + matching left. FULL OUTER: all rows from both. CROSS: cartesian product. INNER and LEFT are most common.`,
        tips: ['INNER: matching only', 'LEFT: all left', 'FULL OUTER: all rows'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sql-9',
        question: 'ROW_NUMBER vs RANK vs DENSE_RANK',
        answer: `For values 10, 10, 20: ROW_NUMBER: 1,2,3. RANK: 1,1,3 (skips 2). DENSE_RANK: 1,1,2 (no gap). Use DENSE_RANK when gaps in ranking are undesirable.`,
        tips: ['ROW_NUMBER: unique', 'RANK: with gaps', 'DENSE_RANK: no gaps'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sql-10',
        question: 'Left Join vs Left Outer Join',
        answer: `They are identical. LEFT JOIN is shorthand for LEFT OUTER JOIN. Both return all rows from the left table plus matching rows from the right.`,
        tips: ['Identical syntax', 'LEFT JOIN shorthand', 'All left rows'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sql-11',
        question: 'Self Join vs Left Join',
        answer: `Self Join: joins a table to itself (e.g., employee-manager hierarchy). Left Join: joins two different tables. Self join uses table aliases to distinguish the two references.`,
        tips: ['Self join on same table', 'Left join on different tables', 'Table aliases required'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sql-12',
        question: 'Cross Join (Cartesian Product)',
        answer: `Returns every combination of rows from both tables. N × M rows. Used for generating combinations. No ON clause needed. Dangerous on large tables → can produce millions of rows.`,
        tips: ['All combinations', 'N × M rows', 'No ON clause'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sql-13',
        question: 'Find Users Above Average Transaction',
        answer: `SELECT user_id, SUM(amount) AS total
FROM transactions
GROUP BY user_id
HAVING SUM(amount) > (
    SELECT AVG(total) FROM (
       SELECT user_id, SUM(amount) AS total
       FROM transactions GROUP BY user_id
    )t
);`,
        tips: ['Subquery pattern', 'HAVING with aggregate', 'Correlated subquery'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sql-14',
        question: 'What are the types of constraints in SQL?',
        answer: `SQL constraints are rules applied on columns to maintain data integrity. Main constraints are NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK and DEFAULT.`,
        tips: ['NOT NULL', 'UNIQUE', 'PRIMARY KEY', 'FOREIGN KEY', 'CHECK', 'DEFAULT'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sql-15',
        question: 'Left Join vs Left Anti Join',
        answer: `Left Join: returns all left rows + matched right. Left Anti Join: returns only left rows with NO match in right (i.e., WHERE right.id IS NULL). Used to find orphan records.`,
        tips: ['Left Anti for orphans', 'WHERE right.id IS NULL', 'Non-matching left rows'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sql-16',
        question: 'CTE – Common Table Expression',
        answer: `A named temporary result set defined with WITH. Improves readability, allows recursion, and can be referenced multiple times. CTEs are not stored → recomputed each reference unless materialized.`,
        tips: ['WITH clause', 'Readable', 'Recursion support'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sql-17',
        question: 'CTE vs Subquery',
        answer: `CTE: readable, reusable within query, supports recursion. Subquery: inline, can't be reused. CTEs are generally preferred for complex queries; subqueries for simple one-off filters.`,
        tips: ['CTE reusable', 'Subquery inline', 'CTE for complex'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sql-18',
        question: 'CTE vs View',
        answer: `CTE: temporary, exists only for the query duration. View: persisted in database, reusable across sessions. Use CTEs for one-time complex logic; Views for frequently reused query definitions.`,
        tips: ['CTE temporary', 'View persisted', 'Different use cases'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sql-19',
        question: 'Indexing in SQL',
        answer: `An index speeds up data retrieval. Types: Clustered (physical sort), Non-Clustered (pointer-based), Composite (multi-column), Unique, Full-Text, Bitmap. Avoid over-indexing → slows writes.`,
        tips: ['Speeds up reads', 'Slows down writes', 'Clustered vs Non-Clustered'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sql-20',
        question: 'Stored Procedure',
        answer: `A precompiled SQL block stored in the DB. Advantages: reusability, reduced network traffic, security (execute without seeing code), better performance through execution plan caching.`,
        tips: ['Precompiled', 'Reduced network traffic', 'Better performance'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sql-21',
        question: 'Clustered vs Non-Clustered Index',
        answer: `Clustered: physically reorders table data, one per table, faster for range queries. Non-Clustered: separate structure with pointers, multiple per table, faster for specific lookups.`,
        tips: ['Clustered: one per table', 'Non-Clustered: multiple', 'Range vs specific lookups'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sql-22',
        question: 'Alias in SQL',
        answer: `Temporary name for a table or column: SELECT salary AS pay FROM emp e. Aliases improve readability and are required for self joins and subquery references.`,
        tips: ['AS keyword', 'Required for self join', 'Improves readability'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sql-23',
        question: 'COUNT(*) vs COUNT(id)',
        answer: `COUNT(*) counts all rows including NULLs. COUNT(id) counts only non-NULL values in the id column. Use COUNT(*) for total row count.`,
        tips: ['COUNT(*) includes NULLs', 'COUNT(col) excludes NULLs', 'COUNT(*) for total'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sql-24',
        question: 'Primary Key vs Composite Key',
        answer: `Primary Key: single column uniquely identifying rows. Composite Key: combination of two or more columns forming a unique identifier. Use composite keys when no single column is unique.`,
        tips: ['Primary: single column', 'Composite: multiple columns', 'When single not unique'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sql-25',
        question: 'Surrogate Key vs Primary Key',
        answer: `Surrogate keys are system-generated (auto-increment IDs) with no business meaning. Used when natural/composite primary keys are complex, long, or subject to change. Improves join performance.`,
        tips: ['System-generated', 'No business meaning', 'Better join performance'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sql-26',
        question: 'WHERE vs HAVING',
        answer: `WHERE: filters rows before aggregation. HAVING: filters groups after GROUP BY. You cannot use aggregate functions in WHERE → use HAVING for those conditions.`,
        tips: ['WHERE before GROUP BY', 'HAVING after GROUP BY', 'Aggregate in HAVING only'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sql-27',
        question: 'GROUP BY vs ORDER BY vs HAVING',
        answer: `GROUP BY: groups rows for aggregation. ORDER BY: sorts result set. HAVING: filters groups post-aggregation. They can be combined: GROUP BY → HAVING → ORDER BY.`,
        tips: ['GROUP BY for aggregation', 'ORDER BY for sorting', 'HAVING for group filtering'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sql-28',
        question: 'SQL Order of Execution',
        answer: `FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT. Understanding this order helps debug queries and write correct conditions.`,
        tips: ['FROM first', 'LIMIT last', 'WHERE before GROUP BY'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sql-29',
        question: 'UNION vs UNION ALL',
        answer: `UNION: combines results and removes duplicates (slower). UNION ALL: combines all results including duplicates (faster). Use UNION ALL unless deduplication is needed.`,
        tips: ['UNION removes duplicates', 'UNION ALL faster', 'Deduplication when needed'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sql-30',
        question: 'CASE Without ELSE',
        answer: `Yes → if no ELSE is specified, the result defaults to NULL when no WHEN condition matches. Always add ELSE for safety in production queries.`,
        tips: ['Defaults to NULL', 'Always add ELSE', 'Safety in production'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sql-31',
        question: 'IN vs BETWEEN',
        answer: `IN: matches specific discrete values (WHERE id IN (1,2,3)). BETWEEN: range of values inclusive on both ends (WHERE age BETWEEN 18 AND 30). BETWEEN is cleaner for ranges.`,
        tips: ['IN for discrete values', 'BETWEEN for ranges', 'Inclusive on both ends'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sql-32',
        question: 'Subquery vs Correlated Subquery',
        answer: `Subquery: independent, runs once. Correlated Subquery: references outer query, runs per row (slower). Use CTEs or joins instead of correlated subqueries for performance.`,
        tips: ['Subquery independent', 'Correlated runs per row', 'Use joins for performance'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sql-34',
        question: 'DELETE vs DROP vs TRUNCATE',
        answer: `DELETE: DML, removes rows with condition, can rollback. TRUNCATE: DDL, removes all rows fast, no rollback in most DBs. DROP: DDL, removes the entire table structure and data.`,
        tips: ['DELETE: DML with rollback', 'TRUNCATE: DDL fast', 'DROP: removes everything'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sql-35',
        question: 'SQL Optimization Techniques',
        answer: `Use indexes, avoid SELECT *, use EXISTS instead of IN for large sets, avoid functions on indexed columns in WHERE, use partitioning, analyze query execution plans, avoid nested loops.`,
        tips: ['Use indexes', 'Avoid SELECT *', 'EXISTS over IN'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sql-36',
        question: 'DELETE Without Condition',
        answer: `Yes, DELETE FROM table; removes all rows but logs each deletion → slower and more resource-intensive than TRUNCATE. TRUNCATE is preferred for clearing tables due to speed and efficiency.`,
        tips: ['Logs each deletion', 'Slower than TRUNCATE', 'TRUNCATE preferred'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sql-37',
        question: 'Window Function vs Aggregate Function',
        answer: `Aggregate collapses rows into one result (GROUP BY). Window Function computes across a window of rows without collapsing them → each row retains its identity. Use window functions for rankings, running totals, and lead/lag comparisons.`,
        tips: ['Window keeps row identity', 'Aggregate collapses', 'Window for rankings'],
        difficulty: 'medium',
        company: 'Common'
      }
    ]
  },
  pyspark: {
    id: 'pyspark',
    name: 'PySpark',
    icon: 'flame',
    color: 'bg-orange-500',
    description: 'Apache Spark distributed computing with PySpark',
    questions: [
      {
        id: 'sp-1',
        question: 'Spark Architecture',
        answer: `Driver: orchestrates execution, creates DAG. Cluster Manager: allocates resources (YARN, Mesos, K8s). Executors: run tasks on worker nodes. DAG Scheduler: breaks DAG into stages and tasks.`,
        tips: ['Driver orchestrates', 'Cluster Manager allocates', 'Executors run tasks'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sp-2',
        question: 'Components of Spark',
        answer: `Spark Core, Spark SQL, Spark Streaming, MLlib (machine learning), GraphX (graph processing). Spark SQL and DataFrames are most commonly used in data engineering.`,
        tips: ['Spark Core', 'Spark SQL', 'MLlib', 'GraphX'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sp-3',
        question: 'SparkSession vs SparkContext',
        answer: `SparkContext: original entry point for RDD-based Spark. SparkSession: unified entry point (Spark 2.0+) that includes SparkContext, SQLContext, and HiveContext. Always use SparkSession in modern code.`,
        tips: ['SparkSession is unified', 'SparkContext for RDDs', 'Use SparkSession'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-4',
        question: 'RDD – Resilient Distributed Dataset',
        answer: `RDD is Spark's core abstraction: immutable, distributed collection of objects. Features: fault-tolerant (via lineage), lazy evaluation, partitioned across nodes. Lower-level than DataFrames.`,
        tips: ['Immutable', 'Distributed', 'Fault-tolerant via lineage'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sp-5',
        question: 'RDD vs DataFrame vs Dataset',
        answer: `RDD: untyped, no optimization. DataFrame: tabular, Catalyst-optimized, Python/Scala/R. Dataset: typed DataFrame, Scala/Java only. DataFrames are preferred for data engineering.`,
        tips: ['RDD untyped', 'DataFrame optimized', 'Dataset typed (Scala/Java)'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sp-6',
        question: 'DataFrame in Spark',
        answer: `A distributed table with named columns and schema. Backed by Catalyst optimizer for query optimization. Created from files (CSV, Parquet, JSON), databases, or RDDs via spark.read.`,
        tips: ['Named columns', 'Catalyst optimized', 'Created via spark.read'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sp-7',
        question: 'Lazy Evaluation',
        answer: `Spark doesn't execute transformations immediately → it builds an execution plan (DAG). Execution only happens at an action (count, collect, write). This enables optimization before execution.`,
        tips: ['Transformations lazy', 'Actions trigger', 'Enables optimization'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sp-8',
        question: 'Catalyst Optimizer',
        answer: `Spark's built-in query optimizer. It analyzes the logical plan, applies rules (predicate pushdown, column pruning), and generates an optimized physical execution plan using cost-based optimization.`,
        tips: ['Query optimizer', 'Predicate pushdown', 'Cost-based optimization'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sp-9',
        question: 'Predicate Pushdown',
        answer: `Pushing filter conditions as close to the data source as possible (e.g., into Parquet files or databases), reducing the amount of data read into memory before processing.`,
        tips: ['Filter close to source', 'Reduces data read', 'Parquet optimization'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-10',
        question: 'Column Pruning',
        answer: `Catalyst drops unnecessary columns early in the execution plan so only required columns are read from storage. Especially effective with columnar formats like Parquet.`,
        tips: ['Drops unused columns', 'Early in plan', 'Columnar formats'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-11',
        question: 'Fault Tolerance in Spark',
        answer: `Spark uses lineage → it records the sequence of transformations to recreate lost partitions. If an executor fails, Spark recomputes only the lost partition from its lineage graph, not the entire job.`,
        tips: ['Lineage for fault tolerance', 'Recomputes lost only', 'Not full job'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-12',
        question: 'DAG in Spark',
        answer: `A Directed Acyclic Graph represents the execution plan → nodes are RDDs/DataFrames, edges are transformations. Spark creates the DAG at action trigger, then optimizes and submits it to the scheduler.`,
        tips: ['Directed Acyclic Graph', 'Nodes: RDDs/DataFrames', 'Edges: transformations'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-13',
        question: 'Stages and Tasks',
        answer: `Stage: a set of transformations that don't require shuffling. Task: a unit of work sent to one executor for one partition. Wide transformations (shuffle) create stage boundaries.`,
        tips: ['Stage: no shuffle', 'Task: unit of work', 'Wide creates boundaries'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sp-14',
        question: 'Narrow vs Wide Transformations',
        answer: `Narrow: each input partition maps to one output partition, no shuffle (map, filter, select). Wide: requires data shuffling across partitions (groupBy, join, distinct). Wide transformations are expensive.`,
        tips: ['Narrow: no shuffle', 'Wide: shuffle required', 'Wide is expensive'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-15',
        question: 'Types of Joins in Spark',
        answer: `Inner, Left, Right, Full Outer, Cross, Left Anti, Left Semi. Spark chooses join strategy (broadcast, sort-merge, shuffle-hash) based on data size and configuration.`,
        tips: ['Multiple join types', 'Auto-selects strategy', 'Broadcast for small'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-16',
        question: 'Broadcast Join',
        answer: `Small table is broadcast (copied) to all executors, avoiding shuffle. Use when one table is small (< 10MB default). Enable: spark.conf.set("spark.sql.autoBroadcastJoinThreshold", 10MB) or use broadcast(df) hint.`,
        tips: ['Copies to all executors', 'Avoids shuffle', 'For small tables'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-17',
        question: 'Sort-Merge Join vs Shuffle-Hash Join',
        answer: `Sort-Merge: both datasets sorted and merged → scalable for large datasets. Shuffle-Hash: builds hash map in memory → faster but requires one side to fit in memory. Spark auto-selects.`,
        tips: ['Sort-Merge scalable', 'Shuffle-Hash memory-intensive', 'Spark auto-selects'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sp-18',
        question: 'Cache vs Persist',
        answer: `cache(): stores in memory (MEMORY_AND_DISK by default). persist(): allows specifying storage level (MEMORY_ONLY, DISK_ONLY, OFF_HEAP, etc.). Use for reused DataFrames to avoid recomputation.`,
        tips: ['cache() is simpler', 'persist() for control', 'For reused DataFrames'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-19',
        question: 'Storage Levels in Spark',
        answer: `MEMORY_ONLY, MEMORY_AND_DISK, DISK_ONLY, MEMORY_ONLY_SER (serialized), MEMORY_AND_DISK_SER, OFF_HEAP. Choose based on data size and available memory.`,
        tips: ['Multiple storage options', 'SER for memory', 'OFF_HEAP for large'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-20',
        question: 'Repartition vs Coalesce',
        answer: `Repartition: full shuffle, increases or decreases partitions. Coalesce: no full shuffle, only decreases partitions by merging. Use Coalesce to reduce partitions efficiently; Repartition when increasing.`,
        tips: ['Repartition: full shuffle', 'Coalesce: merge only', 'Coalesce for reduction'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-21',
        question: 'Repartition – Wide or Narrow?',
        answer: `Repartition: wide transformation (involves full shuffle). Coalesce: narrow transformation (merges existing partitions without full shuffle).`,
        tips: ['Repartition: wide', 'Coalesce: narrow', 'Full shuffle'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-22',
        question: 'Decrease Partitions: Repartition vs Coalesce',
        answer: `Both decrease partition count. Repartition shuffles all data equally. Coalesce merges partitions on the same node with no shuffle → much cheaper. Prefer Coalesce for reduction.`,
        tips: ['Coalesce cheaper', 'Same node merge', 'Prefer for reduction'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-23',
        question: 'AQE – Adaptive Query Execution',
        answer: `AQE dynamically optimizes query execution at runtime based on actual statistics (partition sizes, skew). Enable: spark.sql.adaptive.enabled=true. Handles skew, dynamic partition coalescing automatically.`,
        tips: ['Runtime optimization', 'spark.sql.adaptive.enabled', 'Handles skew'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sp-24',
        question: 'Optimization Techniques in Spark',
        answer: `Use Parquet/columnar formats, broadcast joins, partition pruning, predicate pushdown, AQE, cache reused DataFrames, avoid UDFs (use built-in functions), tune executor memory/cores, address skew with salting.`,
        tips: ['Columnar formats', 'Broadcast joins', 'Cache reused'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sp-25',
        question: 'Apache Spark vs Hadoop MapReduce',
        answer: `Spark: in-memory, 100x faster, supports streaming, SQL, ML. MapReduce: disk-based, write intermediate to HDFS, simpler but slow. Spark is the modern replacement for most MapReduce use cases.`,
        tips: ['Spark in-memory', 'MapReduce disk-based', 'Spark 100x faster'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sp-26',
        question: 'Data Skewness',
        answer: `Skew occurs when some partitions have far more data than others (e.g., one key = 90% of rows). Causes: hot keys, non-uniform distribution. Effects: slow tasks, OOM. Handle with salting, AQE, or repartitioning.`,
        tips: ['Hot keys cause skew', 'Slow tasks, OOM', 'Salting, AQE'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sp-27',
        question: 'Salting in Spark',
        answer: `Add a random salt prefix to skewed keys to distribute data evenly. Join on salted key after broadcasting small table with same salted copies. Remove salt post-join.

  df = df.withColumn("salt_key",
      concat(col("key"),
      lit("_"),
      (rand()*10).cast("int")))`,
        tips: ['Random salt prefix', 'Broadcast with salt', 'Remove salt after join'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sp-28',
        question: 'Does More Executors Solve Skew?',
        answer: `No → skew means one partition is overloaded. More executors don't help if one task handles 90% of the data. You must redistribute data with salting, AQE, or repartitioning on a better key.`,
        tips: ['More executors not solution', 'Redistribute data', 'Salting, AQE'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sp-29',
        question: 'Dynamic Number of Executors',
        answer: `Enable Dynamic Resource Allocation: spark.dynamicAllocation.enabled=true. Spark scales executors based on pending tasks. Set min/max: spark.dynamicAllocation.minExecutors / maxExecutors.`,
        tips: ['spark.dynamicAllocation.enabled', 'Scales based on tasks', 'Set min/max'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-30',
        question: 'Partitions for 5 GB Data',
        answer: `Default partition size is 128MB. For 5GB: ~40 partitions. Workers/nodes depend on cluster config. Rule of thumb: 2-4 partitions per CPU core. More partitions = better parallelism but more overhead.`,
        tips: ['128MB per partition', '~40 partitions for 5GB', '2-4 per core'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-31',
        question: 'Default Partitions in Spark',
        answer: `spark.default.parallelism: for RDD operations (default 200 or 2× cores).
spark.sql.shuffle.partitions: for DataFrame shuffle operations (default 200). Tune based on data size.`,
        tips: ['spark.default.parallelism', 'spark.sql.shuffle.partitions', 'Default 200'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-32',
        question: 'Partition Strategy',
        answer: `Partition on high-cardinality columns used in filters/joins. Avoid skewed partition keys. For time-series data, partition by date. Target 128MB–256MB per partition. Use repartition(n, col).`,
        tips: ['High-cardinality columns', 'Avoid skewed keys', '128-256MB target'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-33',
        question: 'Schema Evolution in Spark',
        answer: `Use mergeSchema=true option when reading Delta/Parquet. Handle new columns with PERMISSIVE mode. Use Glue Dynamic Frames for flexible schema. Add default values for missing columns.`,
        tips: ['mergeSchema=true', 'PERMISSIVE mode', 'Default values'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-34',
        question: 'Read Different File Formats in PySpark',
        answer: `spark.read.csv(), .json(), .parquet(), .orc(), .avro(), .jdbc(), .format("delta").load(). Specify schema and options as needed.`,
        tips: ['Multiple formats', 'format().load()', 'Specify schema'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sp-35',
        question: 'df.read Options',
        answer: `Key options: header=True, inferSchema=True, delimiter=',', mode='PERMISSIVE' (for corrupt records), mergeSchema=True, multiLine=True for JSON.`,
        tips: ['header=True', 'inferSchema=True', 'mode=PERMISSIVE'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sp-36',
        question: 'Write Data to Different Targets',
        answer: `S3: df.write.parquet("s3://bucket/path"). Redshift: use JDBC or spark-redshift connector with temp S3. Delta: df.write.format("delta").save(path). Use mode("overwrite"/"append").`,
        tips: ['write.parquet() for S3', 'JDBC for Redshift', 'format("delta") for Delta'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sp-37',
        question: 'Incremental Loads in Spark',
        answer: `Filter by max watermark: df.filter(col("updated_at") > last_run_date). Use Delta Lake MERGE for upserts. Use Glue Job Bookmarks or Airflow execution dates as watermarks.`,
        tips: ['Watermark pattern', 'Delta MERGE', 'Airflow execution dates'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-38',
        question: 'Handle Skewed Data in Spark',
        answer: `Techniques: Salting hot keys, AQE auto-skew handling, repartition on a better column, broadcast join for small tables, filter separately then union skewed and non-skewed partitions.`,
        tips: ['Salting', 'AQE', 'Broadcast small tables'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sp-39',
        question: 'Monitor Spark Jobs',
        answer: `Spark UI (port 4040): view DAGs, stages, tasks, storage. CloudWatch for Glue/EMR. Ganglia/Prometheus for cluster metrics. Check executor logs for OOM errors. Use df.explain() for plan analysis.`,
        tips: ['Spark UI port 4040', 'df.explain()', 'CloudWatch'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-40',
        question: 'Checkpointing in Spark',
        answer: `Saves RDD/DataFrame to stable storage (HDFS/S3) to break long lineage chains. Prevents recomputation from scratch on failure. Essential for long iterative ML algorithms and streaming.`,
        tips: ['Break lineage chains', 'Stable storage', 'For ML and streaming'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-41',
        question: 'Small File Problem',
        answer: `Many tiny files hurt performance (NameNode pressure, slow reads). Solutions: use coalesce() before writing, compact with Delta OPTIMIZE, configure Glue to produce fewer output files.`,
        tips: ['coalesce() before write', 'Delta OPTIMIZE', 'Fewer output files'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-42',
        question: 'Handle OOM Errors in Spark',
        answer: `Increase executor memory (spark.executor.memory). Reduce data loaded (filter, select). Use persist(DISK_ONLY). Increase partitions to reduce per-partition size. Avoid collect() on large datasets.`,
        tips: ['Increase memory', 'Filter early', 'More partitions'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sp-43',
        question: 'Reduce Runtime for Long Jobs',
        answer: `Cache reused DataFrames. Enable AQE. Use broadcast joins. Increase parallelism. Use columnar formats (Parquet). Avoid UDFs. Partition smartly. Check for skew and shuffle bottlenecks.`,
        tips: ['Cache DataFrames', 'Enable AQE', 'Columnar formats'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sp-44',
        question: 'What Happens After spark-submit?',
        answer: `Driver starts → requests resources from Cluster Manager → executors launched on worker nodes → DAG created → stages/tasks distributed to executors → results returned to driver or written to storage.`,
        tips: ['Driver starts', 'Resources requested', 'DAG created'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-45',
        question: 'Handle Data Inside PySpark',
        answer: `Read with spark.read, transform with DataFrame API (select, filter, join, groupBy), validate schema, handle nulls, and write with df.write. Cache intermediate results if reused.`,
        tips: ['spark.read', 'DataFrame API', 'Cache reused'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sp-46',
        question: 'Handle Bottlenecks in Spark',
        answer: `Identify via Spark UI (long stages, skewed tasks). Common fixes: increase partitions, add executor memory, fix data skew, use broadcast joins, cache hot DataFrames, tune shuffle partitions.`,
        tips: ['Spark UI analysis', 'Increase partitions', 'Fix skew'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sp-47',
        question: 'Monitor and Optimize Nodes',
        answer: `Use Spark UI to identify idle executors or overloaded nodes. Balance workload via repartition. Use dynamic allocation. Monitor GC time → high GC means memory pressure. Right-size executor cores and memory.`,
        tips: ['Spark UI monitoring', 'Dynamic allocation', 'GC time'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-48',
        question: 'df.explain()',
        answer: `Shows the physical and logical execution plan. Use df.explain(True) for full plan including parsed, analyzed, optimized logical and physical. Helps identify missing predicate pushdown or inefficient joins.`,
        tips: ['df.explain()', 'df.explain(True)', 'Plan analysis'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-49',
        question: 'GroupByKey vs ReduceByKey',
        answer: `GroupByKey: shuffles all data to reducers, then groups → memory-heavy. ReduceByKey: pre-aggregates on each partition before shuffle → far more efficient. Always prefer ReduceByKey for aggregations.`,
        tips: ['ReduceByKey more efficient', 'GroupByKey shuffles more', 'Pre-aggregate'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-50',
        question: 'Create Explicit Partition in PySpark',
        answer: `df.write.partitionBy("year","month")\
    .parquet("s3://bucket/path")

At read time, Spark uses partition pruning to read only matching directories.`,
        tips: ['partitionBy()', 'Partition pruning', 'Matching directories'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-51',
        question: 'Add New Column with withColumn',
        answer: `df = df.withColumn("new_col",
    col("price") * col("qty"))

df = df.withColumn("flag",
    lit(1))`,
        tips: ['withColumn()', 'Expression', 'lit() for constant'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sp-52',
        question: 'Define Schema Explicitly',
        answer: `from pyspark.sql.types import *
schema = StructType([
    StructField("id", IntegerType(), True),
    StructField("name", StringType(), True)
])
df = spark.read.schema(schema).csv("path")`,
        tips: ['StructType', 'StructField', 'schema()'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-53',
        question: 'Window Functions in PySpark',
        answer: `from pyspark.sql.window import Window
from pyspark.sql.functions import rank
w = Window.partitionBy("dept")\
    .orderBy("salary")
df.withColumn("rank", rank().over(w))`,
        tips: ['Window.partitionBy()', 'Window.orderBy()', 'rank().over()'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-54',
        question: 'SQL in PySpark',
        answer: `df.createOrReplaceTempView("sales")
result = spark.sql("""
    SELECT region, SUM(amount)
    FROM sales GROUP BY region
""")`,
        tips: ['createOrReplaceTempView()', 'spark.sql()', 'SQL queries'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sp-55',
        question: 'Write a UDF in PySpark',
        answer: `from pyspark.sql.functions import udf
from pyspark.sql.types import StringType

@udf(StringType())
def clean(s): return s.strip().upper()

df = df.withColumn("col",clean("col"))

Prefer built-in functions over UDFs → UDFs can't be optimized by Catalyst.`,
        tips: ['@udf decorator', 'Return type', 'Built-in preferred'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-56',
        question: 'Accumulators in Spark',
        answer: `Shared variables updated only by executors (additive only). Driver reads the final value. Used for counting errors, events, or skipped records across tasks without returning full data to driver.`,
        tips: ['Shared variables', 'Additive only', 'Driver reads final'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-57',
        question: "Yesterday's vs Today's Data",
        answer: `Filter by date column: filter(col("date") == current_date()) or date_sub(current_date(), 1). In Airflow, use execution_date and prev_execution_date as parameters.`,
        tips: ['current_date()', 'date_sub()', 'Airflow parameters'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sp-58',
        question: 'Broadcast Variables',
        answer: `Read-only shared variables cached on each executor to avoid repeated data transfer. Use for lookup tables: bc = sc.broadcast(lookup_dict). Accessed in tasks via bc.value.`,
        tips: ['Read-only shared', 'Cached on executors', 'bc.value'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-59',
        question: 'Is distinct() Wide or Narrow?',
        answer: `Wide transformation → it requires shuffling data across partitions to identify and remove duplicates globally. This creates a stage boundary in the DAG.`,
        tips: ['Wide transformation', 'Shuffle required', 'Stage boundary'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-60',
        question: 'Unpersist Cached Data',
        answer: `Yes: df.unpersist() removes the DataFrame from cache. Call this after the DataFrame is no longer needed to free executor memory for other tasks.`,
        tips: ['unpersist()', 'Free memory', 'After use'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'sp-61',
        question: 'Delete/Drop Physical Partition',
        answer: `spark.sql("""
    ALTER TABLE db.table
    DROP IF EXISTS
    PARTITION (year='2024',month='01')
""")

This removes both the metadata and the underlying data files.`,
        tips: ['ALTER TABLE DROP', 'Metadata and data', 'Partition specification'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-62',
        question: 'Can you Delete Data from Partitions 16320 in a 5GB read? Explain.',
        answer: `You cannot selectively delete internal Spark partitions by index → partitions are internal implementation details. Instead, filter your data and overwrite: df.filter(condition).write.mode("overwrite").`,
        tips: ['No selective delete', 'Filter and overwrite', 'Internal details'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-63',
        question: 'Serialization vs Deserialization in PySpark',
        answer: `Serialization: converting objects to byte stream for network transfer or storage. Deserialization: reconstructing objects. Spark uses Java or Kryo serializer → Kryo is faster and more compact.`,
        tips: ['Kryo faster', 'Java serializer', 'Network transfer'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sp-64',
        question: 'df.groupBy()',
        answer: `Groups rows by one or more columns for aggregation. Returns a GroupedData object. Must be followed by an aggregation (count(), sum(), agg()). Example:
df.groupBy("dept").agg(sum("salary")).`,
        tips: ['Returns GroupedData', 'Follow with aggregation', 'Multiple columns'],
        difficulty: 'easy',
        company: 'Common'
      }
    ]
  },
  aws: {
    id: 'aws',
    name: 'AWS',
    icon: 'cloud',
    color: 'bg-orange-600',
    description: 'Amazon Web Services for data engineering',
    questions: [
      {
        id: 'aws-1',
        question: 'Amazon S3',
        answer: `Simple Storage Service → object storage for any data type. Key features: virtually unlimited storage, 99.999999999% durability, event triggers, lifecycle policies, versioning, and cross-region replication.`,
        tips: ['Object storage', '11 9s durability', 'Event triggers'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-2',
        question: 'S3 Storage Classes',
        answer: `Standard: frequent access. Standard-IA: infrequent access, cheaper. One Zone-IA: one AZ, lower cost. Glacier: archival, minutes to hours retrieval. Glacier Deep Archive: cheapest, 12-hour retrieval.`,
        tips: ['Standard for hot', 'Standard-IA for warm', 'Glacier for cold'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-3',
        question: 'S3 Standard vs Standard-IA vs One Zone-IA',
        answer: `Standard: highest availability, 3+ AZs. Standard-IA: 3+ AZs, lower cost, retrieval fee. One Zone-IA: 1 AZ only, cheapest but lower resilience. Use One Zone-IA for re-creatable data.`,
        tips: ['Standard highest availability', 'One Zone cheapest', 'Retrieval fee'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-4',
        question: 'S3 Security',
        answer: `IAM Roles: service-level access. Bucket Policies: resource-based JSON policies. ACLs: legacy object-level access. KMS: encryption key management. Use bucket policies + IAM roles as primary controls.`,
        tips: ['IAM Roles', 'Bucket Policies', 'KMS encryption'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-5',
        question: 'S3 Encryption Types',
        answer: `SSE-S3: AWS-managed keys. SSE-KMS: customer-controlled keys in KMS. SSE-C: customer-provided keys. Client-side: encrypt before uploading. SSE-KMS is most common for data engineering.`,
        tips: ['SSE-S3 AWS managed', 'SSE-KMS customer controlled', 'SSE-C customer keys'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-6',
        question: 'Versioning and Encryption in S3',
        answer: `Enable versioning in bucket settings → all versions of objects are kept. Combine with lifecycle rules to expire old versions. Enable default encryption so all objects are automatically encrypted on upload.`,
        tips: ['Versioning keeps all versions', 'Lifecycle rules', 'Default encryption'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-7',
        question: 'S3 Limitations',
        answer: `Max object size: 5TB (multipart upload required for > 5GB). Max PUT request: 5GB. Request rate: 3,500 PUT/5,500 GET per prefix per second. S3 offers strong read-after-write consistency since 2021.`,
        tips: ['5TB max object', 'Multipart for large', '3,500/5,500 per prefix'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-8',
        question: 'Bucket Policies',
        answer: `JSON-based resource policies attached to S3 buckets. Control who can access what actions on which resources. Example: allow cross-account access or restrict to specific VPC endpoints only.`,
        tips: ['JSON policies', 'Cross-account access', 'VPC restriction'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-9',
        question: 'Data After Landing in S3',
        answer: `Trigger Lambda or Glue job via S3 event notification. Validate/transform data, convert to Parquet, move to processed prefix. Update Glue Catalog via Crawler. Load to Redshift or query with Athena.`,
        tips: ['Event notification', 'Convert to Parquet', 'Glue Catalog'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-10',
        question: 'Optimize S3 Storage Costs',
        answer: `Use Intelligent-Tiering for unknown access patterns. Apply lifecycle policies to transition to Glacier after N days. Delete expired versions. Compress files. Use Parquet instead of CSV to reduce size.`,
        tips: ['Intelligent-Tiering', 'Lifecycle to Glacier', 'Parquet over CSV'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-11',
        question: 'Trigger Transformation on File Arrival',
        answer: `Use S3 Event Notification → trigger Lambda (for small files) or SNS/SQS → Glue job (for large files). EventBridge can also route S3 events to Step Functions for complex orchestration.`,
        tips: ['S3 Event Notification', 'Lambda for small', 'Glue for large'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-12',
        question: 'Copy Files Between Buckets via CLI',
        answer: `aws s3 cp s3://source-bucket/ \\
  s3://target-bucket/ \\
  --recursive

Use --exclude / --include patterns to filter files. Add --sse aws:kms to encrypt in transit.`,
        tips: ['aws s3 cp', '--recursive', '--exclude/--include'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-13',
        question: 'Automate CSV/Parquet Ingestion from SharePoint to S3',
        answer: `Use Microsoft Graph API to authenticate and download files. Schedule with Lambda or Glue Python shell. Upload to S3 using Boto3 s3.put_object(). Trigger downstream pipeline on success.`,
        tips: ['Microsoft Graph API', 'Boto3 s3.put_object()', 'Downstream trigger'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-14',
        question: 'Handle Duplicate Files in S3 with Boto3',
        answer: `Generate MD5 hash of incoming file. Compare against stored hashes in DynamoDB or S3 metadata. Skip or archive duplicates. Use s3.head_object() to check if file already exists.`,
        tips: ['MD5 hash', 'DynamoDB for tracking', 's3.head_object()'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-15',
        question: "Read Today's File and Archive Rest",
        answer: `Use Boto3 to list objects filtered by date prefix. Download today's file. Move older files: s3.copy_object() to archive bucket, then s3.delete_object() from source.`,
        tips: ['List with prefix', 'copy_object()', 'delete_object()'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-16',
        question: 'S3 in Data Pipeline',
        answer: `S3 is the landing zone, staging, and data lake storage layer. Raw files land → Lambda triggers Glue ETL → Parquet stored in processed prefix → Athena/Redshift Spectrum queries directly from S3.`,
        tips: ['Landing zone', 'Processing layer', 'Query directly'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-17',
        question: 'S3 vs Hadoop File System (HDFS)',
        answer: `S3: object storage, decoupled from compute, pay per use, durable. HDFS: block storage, co-located with compute, requires running cluster. S3 is preferred for cloud-native pipelines; HDFS for on-prem Hadoop.`,
        tips: ['S3 decoupled', 'HDFS co-located', 'Cloud-native S3'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-18',
        question: 'Access Data Across Two AWS Accounts',
        answer: `Use Cross-Account IAM Roles: account B assumes a role from account A. Set bucket policy in account A to allow account B's role. Use sts.assume_role() in code to get temporary credentials.`,
        tips: ['Cross-Account IAM Roles', 'Bucket policy', 'sts.assume_role()'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-19',
        question: 'Why Use S3 Before Glue?',
        answer: `S3 acts as a decoupled staging layer → decouples ingestion from processing. Glue can read directly from any S3 path without locking the source. Also provides durability, easy reprocessing, and audit trails.`,
        tips: ['Decoupled staging', 'Direct read', 'Durability'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-20',
        question: 'Extract-Transform-Move to S3 Pipeline',
        answer: `Extract from source → Glue or Lambda transforms → write Parquet to target S3. File size consideration: aim for 128MB–256MB Parquet files to avoid small file problem in downstream queries.`,
        tips: ['ETL pipeline', '128-256MB target', 'Parquet format'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-21',
        question: 'Check Data 7 Days Back with Lifecycle Policy',
        answer: `If files were transitioned to Glacier, restore them using restore-object API (takes hours). If S3 Versioning was enabled, access previous versions. Always test lifecycle policies in non-prod first.`,
        tips: ['restore-object API', 'Versioning', 'Test first'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-22',
        question: 'AWS Glue',
        answer: `Serverless ETL service. Features: Glue Catalog, Crawlers, ETL jobs (Spark/Python shell), Workflows, Studio (visual ETL), Job Bookmarks for incremental loads, support for G.1X/G.2X workers.`,
        tips: ['Serverless ETL', 'Crawlers', 'Job Bookmarks'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-23',
        question: 'Glue Crawler',
        answer: `Automatically scans data stores (S3, RDS, JDBC) and infers schema. Populates the Glue Data Catalog with table definitions. Can be scheduled or triggered by events. Detects schema changes.`,
        tips: ['Auto schema inference', 'Glue Catalog', 'Schedule or event'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-24',
        question: 'Glue Data Catalog',
        answer: `Central metadata repository → stores table definitions, schema, partition info, and data location. Works with Athena, Redshift Spectrum, and EMR. Acts like a Hive Metastore for AWS services.`,
        tips: ['Central metadata', 'Hive Metastore equivalent', 'Integration point'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-25',
        question: 'Glue Database',
        answer: `A logical container in the Glue Catalog that groups related tables. Each Glue Database corresponds to a schema or domain (e.g., raw_db, curated_db). Queried using Athena or Spark SQL.`,
        tips: ['Logical container', 'Groups tables', 'Schema/domain'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-26',
        question: 'Schema Evolution in Glue',
        answer: `Use Glue Dynamic Frames with choose_one_schema or resolve_choice() to handle conflicting types. Enable updateBehavior="UPDATE_IN_DATABASE" in Crawler. Use Parquet with mergeSchema=True.`,
        tips: ['Dynamic Frames', 'resolve_choice()', 'mergeSchema=True'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-27',
        question: 'Glue Dynamic Frames vs Spark DataFrames',
        answer: `Dynamic Frame: schema-flexible, handles mismatched types, supports Glue-specific transforms (resolveChoice, relationalize). DataFrame: schema-strict, Catalyst-optimized, faster for clean data.`,
        tips: ['Dynamic Frame flexible', 'DataFrame optimized', 'Schema handling'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-28',
        question: 'Data Lakehouse with S3 + Glue + Athena',
        answer: `Store raw/processed data in S3 (Parquet/Delta). Glue Crawler updates Catalog. Athena queries directly via SQL. Glue ETL handles transformation. Add Redshift Spectrum for BI tool integration.`,
        tips: ['S3 storage', 'Athena queries', 'BI integration'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-29',
        question: 'Parallel Processing in Glue',
        answer: `Glue jobs run distributed Spark under the hood. Use concurrent runs for independent datasets. Set --enable-job-insights and tune DPUs. Each Glue job spawns multiple Spark executors across DPU workers.`,
        tips: ['Distributed Spark', 'Concurrent runs', 'DPU tuning'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-30',
        question: 'DPU in Glue / Worker Types',
        answer: `DPU: Data Processing Unit → 4 vCPU, 16GB RAM. G.1X: 1 DPU per worker, standard workloads. G.2X: 2 DPU per worker, memory-intensive. G.025X: Python shell jobs, lightweight tasks.`,
        tips: ['4 vCPU, 16GB per DPU', 'G.1X standard', 'G.2X memory-intensive'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-31',
        question: 'Where Glue Jobs Run',
        answer: `Glue jobs run on AWS-managed infrastructure (not your VPC by default). You can configure Glue to run inside your VPC by providing VPC, subnet, and security group settings → required for accessing RDS or private endpoints.`,
        tips: ['AWS-managed by default', 'VPC configuration', 'Private endpoints'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-32',
        question: 'Glue Job Bookmarks',
        answer: `Track which data has been processed so only new/changed data is reprocessed on the next run. Enable with --job-bookmark-option job-bookmark-enable. Works with S3, JDBC sources.`,
        tips: ['Track processed data', 'Incremental loads', 'S3/JDBC'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-33',
        question: 'Types of Glue Jobs',
        answer: `Spark ETL: distributed PySpark jobs. Python Shell: lightweight Python scripts (G.025X). Streaming: continuous Spark Streaming jobs. Ray: distributed Python for ML workloads (newer).`,
        tips: ['Spark ETL', 'Python Shell', 'Streaming', 'Ray'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-34',
        question: 'Glue Studio',
        answer: `Visual drag-and-drop ETL authoring tool in Glue. Build pipelines without writing code → generates Glue script underneath. Good for simple transformations; prefer code for complex logic and version control.`,
        tips: ['Visual ETL', 'Generates script', 'Code for complex'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-35',
        question: 'Glue vs EMR',
        answer: `Glue: serverless, no cluster management, higher cost per DPU, easier setup. EMR: managed Hadoop/Spark clusters, more control, cheaper for long-running workloads, requires cluster management expertise.`,
        tips: ['Glue serverless', 'EMR more control', 'Long-running EMR'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-36',
        question: 'Glue vs Lambda',
        answer: `Lambda: <15 min, small files, event-driven, stateless. Glue: long-running ETL, large datasets, distributed Spark. Use Lambda for lightweight triggers and Glue for heavy transformations.`,
        tips: ['Lambda for small', 'Glue for large', 'Different use cases'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-37',
        question: 'Micro-ETL in Glue',
        answer: `Small, focused Glue Python shell jobs that handle specific, lightweight tasks (e.g., copy a single file, update metadata). Cost-efficient using G.025X workers. Good for modular pipeline design.`,
        tips: ['G.025X workers', 'Modular design', 'Lightweight tasks'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-38',
        question: 'Deploy Glue Code via CI/CD',
        answer: `Store Glue scripts in GitHub/CodeCommit. Use CodePipeline or GitHub Actions to validate, test, and deploy scripts to S3. Update Glue job to point to new script version. Use CloudFormation/Terraform for infra.`,
        tips: ['Git-based', 'CodePipeline', 'Script versioning'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-39',
        question: 'External Packages in Glue',
        answer: `Upload libraries as .whl or .zip to S3. Reference in job parameters: --additional-python-modules for PyPI packages or --extra-py-files for custom packages from S3.`,
        tips: ['.whl or .zip', '--additional-python-modules', '--extra-py-files'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-40',
        question: 'Glue Workflows',
        answer: `Orchestrate multiple Glue jobs and crawlers with triggers (time, event, or dependency). Create sequential or parallel pipelines. Use triggers to chain: Crawler → Glue ETL Job → next Job.`,
        tips: ['Orchestration', 'Sequential/parallel', 'Trigger chaining'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-41',
        question: 'Glue Job Duration and Optimizations',
        answer: `Target: <30 min for most jobs. Optimizations: increase DPUs, use Parquet, enable job bookmarks, partition data, use pushdown predicates, avoid small files, cache reused DynamicFrames.`,
        tips: ['<30 min target', 'Increase DPUs', 'Parquet format'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-42',
        question: 'Worker Types Used in Glue',
        answer: `G.1X for standard workloads. G.2X for memory-intensive joins/aggregations. G.025X for Python shell jobs. Choose based on data volume → monitor SparkUI to right-size.`,
        tips: ['G.1X standard', 'G.2X memory-intensive', 'G.025X shell'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-43',
        question: 'Glue Context',
        answer: `GlueContext extends SparkContext → it's the entry point for Glue-specific APIs (reading Dynamic Frames, writing to Glue Catalog, using Glue transforms). Created alongside SparkSession in Glue scripts.`,
        tips: ['GlueContext', 'Entry point', 'SparkContext extension'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-44',
        question: 'Why Crawler Runs Every Ingestion?',
        answer: `To detect new partitions or schema changes in S3. Without re-crawling, new partitions aren't registered in the Catalog and Athena can't query them. Use MSCK REPAIR TABLE as a lighter alternative.`,
        tips: ['New partitions', 'MSCK REPAIR TABLE', 'Catalog registration'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-45',
        question: 'How Glue Detects New Files in S3',
        answer: `Glue Crawler scans S3 paths on schedule or trigger. Alternatively, S3 Event Notifications → EventBridge → Lambda or Step Functions → trigger Glue job directly when new files arrive.`,
        tips: ['Crawler schedule', 'EventBridge', 'Direct trigger'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-46',
        question: 'Missing Columns in Dynamic Frames',
        answer: `Dynamic Frames handle missing columns natively → missing columns are null. Use resolveChoice() to cast ambiguous types. Use applyMapping() to explicitly define expected schema and fill defaults.`,
        tips: ['Native null handling', 'resolveChoice()', 'applyMapping()'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-47',
        question: 'Glue Pipeline Best Practices',
        answer: `Partition input data, use job bookmarks, enable Spark UI, write outputs as Parquet, handle errors with retries, use Glue Catalog for schema management, separate raw/processed S3 prefixes, monitor job metrics.`,
        tips: ['Partition data', 'Job bookmarks', 'Parquet output'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-48',
        question: '1 G.1X vs 2 G.2X Workers',
        answer: `2 G.2X workers (4 DPU total) is better than 1 G.1X (1 DPU) for memory-intensive work. G.2X gives more memory per worker and better parallelism. However, 2 G.2X costs more → profile before scaling.`,
        tips: ['2 G.2X better for memory', '4 DPU total', 'Profile first'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-49',
        question: 'Time-Based Triggers – Glue vs Lambda',
        answer: `Glue: built-in schedule triggers using cron expressions in Workflows. Lambda: use EventBridge (CloudWatch Events) with cron expression to invoke Lambda on schedule. Both support cron syntax.`,
        tips: ['Glue Workflows', 'EventBridge', 'Cron syntax'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-50',
        question: 'Minimum Nodes in Glue',
        answer: `Minimum is 2 workers (1 driver + 1 executor) for Spark ETL jobs. For G.025X Python Shell jobs, 1 node is sufficient. You cannot go below 2 workers for distributed Spark Glue jobs.`,
        tips: ['2 workers minimum', '1 for Python Shell', 'Spark needs 2+'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-51',
        question: 'AWS Lambda',
        answer: `Serverless compute service → run code without provisioning servers. Event-driven, auto-scales, pay per invocation. Supports Python, Node.js, Java, etc. Ideal for lightweight event processing.`,
        tips: ['Serverless', 'Event-driven', 'Pay per invocation'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-52',
        question: 'Lambda Limitations',
        answer: `Max timeout: 15 minutes. Deployment package: 50MB (zipped), 250MB (unzipped). Concurrent executions: 1,000 (default, can increase). Memory: 128MB to 10GB. Ephemeral storage: up to 10GB in /tmp.`,
        tips: ['15 min max', '50MB zipped', '1000 concurrent'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-53',
        question: 'Max Execution Time and Package Size',
        answer: `Timeout: 15 minutes max. Package size: 50MB compressed ZIP (250MB uncompressed). For larger dependencies, use Lambda Layers or container images (up to 10GB).`,
        tips: ['15 min timeout', 'Layers for deps', 'Container images'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-54',
        question: 'Is 15-Minute Timeout Standard?',
        answer: `Yes → 15 minutes is the hard maximum and cannot be extended. It's configurable from 1 second to 15 minutes. For longer processing, use Step Functions, Glue, or Fargate instead.`,
        tips: ['Hard maximum', 'Configurable', 'Step Functions alternative'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-55',
        question: 'Max Concurrent Connections in Lambda',
        answer: `Default: 1,000 concurrent executions per account per region. Can be increased by submitting a service quota request. Reserve concurrency per function to isolate critical functions from quota exhaustion.`,
        tips: ['1000 default', 'Service quota increase', 'Reserve concurrency'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-56',
        question: 'Load Custom Layers to Lambda',
        answer: `Via UI: Layers → Create Layer → upload ZIP. Without UI: aws lambda publish-layer-version --zip-file. Attach to function via --layers ARN. Max 5 layers per function.`,
        tips: ['UI or CLI', '--layers ARN', 'Max 5 layers'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-57',
        question: 'Pandas Layers in Lambda',
        answer: `Pandas isn't included in Lambda runtime by default. Add it as a Lambda Layer (pre-built AWS-managed layer or custom ZIP). Required for DataFrame operations in Lambda without bundling in deployment package.`,
        tips: ['Lambda Layer', 'AWS-managed layer', 'Deployment package'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-58',
        question: 'Lambda Triggers',
        answer: `S3 events, API Gateway, EventBridge (scheduled/event), SQS, SNS, DynamoDB Streams, Kinesis, Cognito, CloudFront (Lambda@Edge). Each trigger type has different payload formats and concurrency behavior.`,
        tips: ['S3 events', 'EventBridge', 'SQS/SNS'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-59',
        question: 'Create Event Trigger in Lambda',
        answer: `In console: Lambda → Add Trigger → select S3/EventBridge/SQS. Via CLI: aws lambda create-event-source-mapping for SQS/Kinesis. For S3: configure bucket event notification to point to Lambda ARN.`,
        tips: ['Console UI', 'CLI mapping', 'S3 notification'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-60',
        question: 'Load 1000 Files from S3 to Redshift via Lambda',
        answer: `Use SQS queue → each S3 event sends a message. Lambda processes messages in batches. Each Lambda invocation loads one batch using COPY command or JDBC. Use DLQ for failed messages.`,
        tips: ['SQS queue', 'Batch processing', 'DLQ'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-61',
        question: 'Lambda Calling Another Lambda',
        answer: `Yes → use boto3.client('lambda').invoke(). Use InvocationType='Event' for async or 'RequestResponse' for sync. For complex chaining, prefer Step Functions over Lambda-to-Lambda calls.`,
        tips: ['boto3.invoke()', 'InvocationType', 'Step Functions'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-62',
        question: 'Methods to Deploy Lambda',
        answer: `Console ZIP upload, AWS CLI, SAM (Serverless Application Model), CloudFormation, CDK, Terraform, container image via ECR. CI/CD: CodePipeline + CodeDeploy or GitHub Actions.`,
        tips: ['SAM', 'CloudFormation', 'CDK', 'Terraform'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-63',
        question: 'Lambda vs Glue for 1MB File',
        answer: `Use Lambda → 1MB is tiny. Lambda starts in milliseconds, no cluster spin-up time. Glue takes 1–2 min to start. Lambda is cheaper, faster, and more appropriate for small event-driven processing.`,
        tips: ['Lambda for small', 'Fast start', 'Cheaper'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-64',
        question: 'Glue Direct vs Lambda Chunking',
        answer: `For large files: Glue is better → distributed processing handles volume efficiently. For medium files needing chunking: Lambda with SQS chunking can be more cost-efficient if data fits within timeout limits.`,
        tips: ['Glue for large', 'Lambda for medium', 'SQS chunking'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-65',
        question: 'Build a Data Lake in AWS',
        answer: `Landing (S3 raw) → Glue ETL transforms → Processed S3 (Parquet, partitioned) → Glue Catalog metadata → Athena for ad-hoc queries → Redshift Spectrum for BI → IAM + KMS for governance.`,
        tips: ['Landing zone', 'Glue ETL', 'Athena/Redshift'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-66',
        question: 'Is Athena a Database?',
        answer: `No → Athena is a serverless interactive query service. It queries data in S3 using standard SQL. Creates external tables (data stays in S3, only metadata in Glue Catalog). No storage layer.`,
        tips: ['Serverless query', 'S3 data', 'External tables'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-67',
        question: 'Advantages of Athena',
        answer: `Serverless → no infrastructure. Pay per query (per TB scanned). Works directly on S3. Uses Glue Catalog. Supports Parquet, ORC, CSV, JSON. Good for ad-hoc analysis without loading data into a database.`,
        tips: ['Serverless', 'Pay per query', 'Glue Catalog'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-68',
        question: 'Athena vs Redshift',
        answer: `Athena: serverless, pay-per-query, S3-native, good for ad-hoc. Redshift: fully managed data warehouse, persistent cluster (or serverless), better for complex analytics and BI tools. Use both together.`,
        tips: ['Athena ad-hoc', 'Redshift BI', 'Use both'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-69',
        question: 'Redshift Spectrum vs Athena',
        answer: `Both query S3 using Glue Catalog. Spectrum: runs from inside Redshift cluster, can join S3 data with Redshift tables. Athena: fully independent, no Redshift cluster needed. Athena is simpler for pure S3 queries.`,
        tips: ['Spectrum in Redshift', 'Athena independent', 'Join capability'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-70',
        question: 'Optimize Athena Performance',
        answer: `Use Parquet/ORC columnar formats. Partition data by date/region. Use compression (Snappy, GZIP). Limit SELECT columns. Use partition pruning in WHERE. Avoid SELECT *. Use larger files (128MB+).`,
        tips: ['Columnar formats', 'Partition pruning', 'Larger files'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-71',
        question: 'Create External Table in Athena from Parquet',
        answer: `CREATE EXTERNAL TABLE db.sales (
  id INT, amount DOUBLE
)
STORED AS PARQUET
LOCATION 's3://bucket/sales/'
TBLPROPERTIES ('parquet.compression'='SNAPPY');`,
        tips: ['CREATE EXTERNAL TABLE', 'STORED AS PARQUET', 'TBLPROPERTIES'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-72',
        question: 'Amazon Redshift Architecture',
        answer: `Leader Node: receives queries, creates execution plan, distributes to compute nodes. Compute Nodes: execute queries in parallel on slices. Slices: partitions within each compute node. Uses columnar storage + MPP.`,
        tips: ['Leader node', 'Compute nodes', 'MPP'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-73',
        question: 'MPP in Redshift',
        answer: `Massively Parallel Processing → query work is distributed across all compute nodes simultaneously. Each node processes its slice of data in parallel, dramatically improving performance for large analytical queries.`,
        tips: ['Distributed processing', 'Parallel execution', 'Large queries'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-74',
        question: 'Columnar Storage in Redshift',
        answer: `Data stored column-by-column instead of row-by-row. Benefits: only reads needed columns (column pruning), better compression (same-type values compress better), faster aggregation for analytical queries.`,
        tips: ['Column-by-column', 'Column pruning', 'Better compression'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-75',
        question: 'Single Load into Redshift – COPY Command',
        answer: `COPY schema.table
FROM 's3://bucket/path/'
IAM_ROLE 'arn:aws:iam::ID:role/role'
FORMAT AS PARQUET;

COPY is the most efficient way to bulk-load data → uses parallel loading from S3.`,
        tips: ['COPY command', 'Parallel loading', 'IAM_ROLE'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-76',
        question: 'Incremental Data in Redshift',
        answer: `Use watermark (max updated_at) to extract only new records. Stage new data in S3 → COPY to staging table → MERGE/UPDATE/INSERT into main table. Use Delta tables or transaction IDs for CDC.`,
        tips: ['Watermark pattern', 'Staging table', 'MERGE'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-77',
        question: 'Redshift Spectrum',
        answer: `Extends Redshift to query data directly in S3 without loading it. Uses external tables in Glue Catalog. Benefits: query both Redshift and S3 data in one SQL, no ETL needed for cold data, cost-effective.`,
        tips: ['Query S3 from Redshift', 'External tables', 'No ETL'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-78',
        question: 'Optimize Redshift Query Performance',
        answer: `Define Sort Keys (range scans). Choose Distribution Keys (avoid data movement). Use compression encodings. Run VACUUM and ANALYZE regularly. Use materialized views. Enable result caching. Check WLM queues.`,
        tips: ['Sort Keys', 'Distribution Keys', 'VACUUM/ANALYZE'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'aws-79',
        question: 'Data Lake vs Data Warehouse vs Data Lakehouse',
        answer: `Data Lake: raw, unstructured, cheap (S3). Data Warehouse: structured, curated, fast queries (Redshift). Lakehouse: combines both → open formats (Delta/Iceberg) on cloud storage with warehouse-like performance.`,
        tips: ['Data Lake raw', 'Warehouse curated', 'Lakehouse combines'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-80',
        question: 'Redshift Serverless',
        answer: `No cluster to manage → Redshift auto-scales capacity based on workload. Pay per RPU (Redshift Processing Unit) per second. Ideal for variable or unpredictable query patterns. Automatically pauses when idle.`,
        tips: ['Auto-scaling', 'Pay per RPU', 'Auto pause'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-81',
        question: 'Redshift vs Querying S3 with Athena',
        answer: `Redshift: persistent cluster, better for complex joins, BI tools, consistent performance. Athena: serverless, ad-hoc, pay-per-query. Use Athena for exploration; Redshift for production dashboards and SLA-bound queries.`,
        tips: ['Athena exploration', 'Redshift production', 'Different use cases'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-82',
        question: 'Types of Views in Redshift',
        answer: `Standard View: virtual, recomputed at query time. Materialized View: stored result, faster. Late Binding View: references external (Spectrum) tables without strict schema binding → useful for schema evolution.`,
        tips: ['Standard View', 'Materialized View', 'Late Binding View'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-83',
        question: 'Distribution Styles in Redshift',
        answer: `EVEN: round-robin, balanced. KEY: same key values on same node. ALL: entire table on every node (small tables). AUTO: Redshift decides. Syntax: DISTSTYLE KEY DISTKEY(col).`,
        tips: ['EVEN round-robin', 'KEY distribution', 'ALL small tables'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-84',
        question: 'Dist Key vs Sort Key',
        answer: `Distribution Key: determines which node stores each row (reduces data movement in joins). Sort Key: determines physical sort order on disk (speeds up range filters). Use both strategically for performance.`,
        tips: ['Dist Key for joins', 'Sort Key for range', 'Strategic use'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-85',
        question: 'EC2 Instance Types',
        answer: `General: t3/m5. Compute: c5/c6g. Memory: r5/x1. Storage: i3/d2. GPU: p3/g4. Micro: t2. Choose based on workload → memory-optimized for Spark, compute-optimized for ML inference.`,
        tips: ['t3/m5 general', 'r5 memory', 'p3 GPU'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-86',
        question: 'Connect to EC2 from VS Code via SSH',
        answer: `Install Remote-SSH extension. Configure ~/.ssh/config with EC2 public IP and key file path. In VS Code: Remote Explorer → connect to host. Ensure EC2 security group allows port 22.`,
        tips: ['Remote-SSH extension', 'SSH config', 'Security group'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-87',
        question: 'Amazon CloudWatch',
        answer: `Monitoring and observability service. Collects metrics, logs, events. Set alarms on thresholds. Create dashboards. Monitor Glue jobs, Lambda, EC2, Redshift. Use Log Groups for centralized log storage.`,
        tips: ['Metrics and logs', 'Alarms', 'Dashboards'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-88',
        question: 'Debug Logs and Metrics in CloudWatch',
        answer: `Use CloudWatch Logs Insights for querying log data. Filter by error level. Set metric filters to extract patterns from logs. Use CloudWatch Alarms to notify on anomalies. Correlate with X-Ray for tracing.`,
        tips: ['Logs Insights', 'Metric filters', 'X-Ray tracing'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-89',
        question: 'When a Pipeline Fails',
        answer: `Check CloudWatch logs for error details. Identify root cause (data issue, infra, code). Fix and rerun. If partial completion, use idempotent design → reprocess only failed partitions. Notify stakeholders via SNS.`,
        tips: ['CloudWatch logs', 'Idempotent design', 'SNS notification'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-90',
        question: 'Common Pipeline Failure Causes',
        answer: `Bad source data (schema change, null values), OOM errors, timeout, network issues, missing files, permission errors (IAM), dependency failures, wrong configuration, environment-specific bugs.`,
        tips: ['Schema changes', 'OOM errors', 'Permission errors'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-91',
        question: 'Send Notifications on Pipeline Failure',
        answer: `CloudWatch Alarm on Glue/Lambda error metric → SNS topic → email/Slack via Lambda. Or Airflow email/Slack operator on failure callbacks. Use on_failure_callback in Airflow tasks.`,
        tips: ['CloudWatch Alarm', 'SNS topic', 'on_failure_callback'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-92',
        question: 'IAM Users, Groups, Roles, Policies',
        answer: `User: individual with long-term credentials. Group: collection of users. Role: temporary credentials, assumed by services/accounts. Policy: JSON document defining permissions. Use roles for services, not users.`,
        tips: ['User for people', 'Role for services', 'Policy JSON'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-93',
        question: 'AWS KMS',
        answer: `Key Management Service → create, manage, and rotate encryption keys. Used to encrypt S3, RDS, Redshift, Glue data. Customer Managed Keys (CMK) give full control. Enable via resource encryption settings.`,
        tips: ['Encryption keys', 'CMK control', 'Resource encryption'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-94',
        question: 'AWS DMS and CDC',
        answer: `Database Migration Service migrates data between sources and targets. CDC (Change Data Capture) uses database transaction logs to capture inserts/updates/deletes in near real-time. Supports ongoing replication.`,
        tips: ['DMS migration', 'CDC transaction logs', 'Ongoing replication'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-95',
        question: 'File Formats Worked With',
        answer: `CSV, JSON, Parquet, Avro, ORC, Delta, XML. Parquet is preferred for analytical workloads. Avro for streaming (Kafka). Delta for ACID transactional data lakes. ORC for Hive/EMR workloads.`,
        tips: ['Parquet for analytics', 'Avro for streaming', 'Delta ACID'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-96',
        question: 'AWS CloudFormation',
        answer: `Infrastructure as Code (IaC) service. Define AWS resources in YAML/JSON templates. CloudFormation provisions and manages the stack. Enables repeatable, version-controlled infrastructure deployments across environments.`,
        tips: ['IaC', 'YAML/JSON templates', 'Repeatable deployments'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-97',
        question: 'AWS Step Functions',
        answer: `Orchestration service using state machines. Define workflows with JSON (Amazon States Language). Chain AWS services (Lambda, Glue, ECS). Supports branching, retries, parallel execution. Better than Lambda chaining for complex flows.`,
        tips: ['State machines', 'Amazon States Language', 'Branching retries'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-98',
        question: 'AWS Secrets Manager',
        answer: `Stores and rotates credentials (DB passwords, API keys) securely. Access via API or SDK. Supports automatic rotation for RDS/Redshift. Integrates with Lambda, Glue. Eliminates hardcoded secrets in code.`,
        tips: ['Credential storage', 'Auto rotation', 'SDK integration'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-99',
        question: 'Parquet vs CSV Advantages',
        answer: `Columnar (reads only needed columns), compressed (Snappy/GZIP), schema embedded, 2–10× smaller, 10–100× faster for analytical queries. Supports predicate pushdown and partition pruning. Ideal for Athena and Redshift Spectrum.`,
        tips: ['Columnar storage', 'Compressed', 'Predicate pushdown'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-100',
        question: 'SCD Types',
        answer: `Type 1: overwrite old value. Type 2: add new row with effective dates, keep history. Type 3: add previous value column. Type 4: history in separate table. Type 2 is most common in data warehouses.`,
        tips: ['Type 1 overwrite', 'Type 2 history', 'Type 3 previous'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-101',
        question: 'Incremental Loads Without DMS',
        answer: `Use watermarks (updated_at column). Extract records where updated_at > last_run_time. Store last run time in DynamoDB or S3 metadata file. Update watermark after successful load.`,
        tips: ['Watermark pattern', 'DynamoDB storage', 'Update after load'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-102',
        question: 'Fault Tolerance and High Availability in AWS',
        answer: `Multi-AZ deployments, S3 multi-region replication, Redshift Multi-AZ, Lambda auto-scaling, SQS for decoupling, CloudWatch alarms, retry logic, dead letter queues, cross-region failover with Route 53.`,
        tips: ['Multi-AZ', 'S3 replication', 'Route 53 failover'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-103',
        question: 'Design a Scalable Data Pipeline on AWS',
        answer: `Source → S3 landing → EventBridge triggers → Glue ETL → S3 processed (Parquet, partitioned) → Glue Catalog → Athena/Redshift → CloudWatch monitoring → SNS alerts. Use Step Functions for orchestration.`,
        tips: ['Event-driven', 'Partitioned storage', 'Monitoring'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-104',
        question: 'Deploy Code from Git to AWS',
        answer: `Use CodePipeline: Git push → CodeBuild (build/test) → CodeDeploy/CloudFormation (deploy). For Glue: copy scripts to S3. For Lambda: package and deploy via SAM/CDK. Use branches for environment separation.`,
        tips: ['CodePipeline', 'CodeBuild', 'Branches'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-105',
        question: 'Trigger Glue Job When Data Arrives in S3',
        answer: `S3 Event Notification → EventBridge rule → trigger Glue job directly or via Lambda. Or use CloudTrail + EventBridge pattern matching on PutObject events. Glue Workflows can use S3-based triggers too.`,
        tips: ['EventBridge', 'CloudTrail', 'Glue Workflows'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-106',
        question: 'Move Data from S3 to Redshift',
        answer: `COPY command (most efficient → parallel load). Glue ETL with Redshift connector. Lambda + psycopg2 for small files. Redshift Data API for serverless. Always use IAM role, not credentials, in COPY.`,
        tips: ['COPY command', 'Glue ETL', 'IAM role'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'aws-107',
        question: 'AWS Kinesis / Streaming Data',
        answer: `Kinesis Data Streams: real-time data ingestion (like Kafka). Kinesis Firehose: managed delivery to S3/Redshift. Kinesis Analytics: SQL on streaming data. Used for IoT, clickstream, fraud detection use cases.`,
        tips: ['Data Streams', 'Firehose', 'Analytics'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-108',
        question: 'Very High Data Volume via JDBC',
        answer: `Partition JDBC reads: set partitionColumn, lowerBound, upperBound, numPartitions in Spark JDBC options. This enables parallel reads from database into multiple Spark partitions simultaneously.`,
        tips: ['partitionColumn', 'lowerBound/upperBound', 'numPartitions'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'aws-109',
        question: 'Internal DB to S3 via JDBC in Python Operator',
        answer: `Use cx_Oracle or pyodbc to connect, execute query, fetch data to DataFrame, write to S3 using Boto3 or df.to_parquet(s3_path) via s3fs. Schedule with Airflow PythonOperator.`,
        tips: ['cx_Oracle/pyodbc', 'Boto3', 'PythonOperator'],
        difficulty: 'medium',
        company: 'Common'
      }
    ]
  },
  azure: {
    id: 'azure',
    name: 'Azure',
    icon: 'cloud',
    color: 'bg-blue-600',
    description: 'Microsoft Azure cloud services',
    questions: [
      {
        id: 'az-1',
        question: 'Why Use Azure Data Factory?',
        answer: `ADF is a cloud ETL/ELT orchestration service. Used to ingest data from diverse sources (SQL, APIs, files), schedule pipelines, transform data using Data Flows or Databricks, and monitor pipeline health.`,
        tips: ['Cloud ETL', 'Multiple sources', 'Scheduling'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'az-2',
        question: 'Data Sources Connected Using ADF',
        answer: `Azure SQL, On-prem SQL Server (via Self-hosted IR), SharePoint, REST APIs, Azure Blob/ADLS, Salesforce, Oracle, SAP. ADF supports 90+ connectors via Linked Services.`,
        tips: ['90+ connectors', 'Linked Services', 'On-prem support'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'az-3',
        question: 'Incremental Loading in ADF',
        answer: `Use watermark pattern: store max LastModifiedDate in a lookup table. Each run reads records newer than the watermark. Update watermark on success. Alternatively, use ADF's built-in incremental copy with Change Tracking.`,
        tips: ['Watermark pattern', 'Change Tracking', 'Lookup table'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-4',
        question: 'ADF Activities Used',
        answer: `Copy Activity, Lookup Activity, ForEach, If Condition, Execute Pipeline, Web Activity (REST calls), Databricks Notebook Activity, Stored Procedure Activity, Get Metadata, Delete Activity.`,
        tips: ['Copy Activity', 'ForEach', 'Databricks Activity'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'az-5',
        question: 'Handle Pipeline Failures in ADF',
        answer: `Set retry count/interval on activities. Use failure dependency arrows to trigger cleanup/alert pipelines. Monitor via ADF Monitor tab. Send alerts via Logic Apps or Azure Monitor. Log errors to a database or ADLS.`,
        tips: ['Retry settings', 'Failure dependencies', 'Monitor tab'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-6',
        question: 'ADF Triggering Databricks Notebooks',
        answer: `Use Databricks Notebook Activity in ADF. Configure Linked Service with Databricks workspace URL and PAT token (or managed identity). Pass parameters via Base Parameters. Monitor notebook run status in ADF.`,
        tips: ['Notebook Activity', 'Base Parameters', 'Linked Service'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-7',
        question: 'Credentials Secured in ADF',
        answer: `Store secrets in Azure Key Vault. Reference in Linked Services using Key Vault Linked Service → ADF retrieves secrets at runtime. Never hardcode credentials. Use Managed Identity for Azure service authentication.`,
        tips: ['Key Vault', 'Managed Identity', 'Linked Service'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-8',
        question: 'Why Use Azure Databricks?',
        answer: `Managed Apache Spark environment on Azure. Used for large-scale data transformations, ML model training, Delta Lake operations, and collaborative notebook-based development. Integrates natively with ADLS and ADF.`,
        tips: ['Managed Spark', 'Delta Lake', 'Notebooks'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'az-9',
        question: 'Transformations in Databricks',
        answer: `Deduplication, null handling, type casting, joins, aggregations, window functions, SCD Type 2 logic, feature engineering, JSON parsing, and data quality checks → all using PySpark or Spark SQL.`,
        tips: ['PySpark', 'Spark SQL', 'Data quality'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-10',
        question: 'Databricks Read/Write from ADLS Gen2',
        answer: `Mount ADLS using dbutils.fs.mount() or use abfss:// path directly. Authenticate with Service Principal (OAuth) or Managed Identity. Read: spark.read.parquet("abfss://..."). Write similarly.`,
        tips: ['abfss:// path', 'Service Principal', 'Managed Identity'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-11',
        question: 'Databricks for ML Workflows',
        answer: `Use MLflow for experiment tracking, model registry, and deployment. Databricks Feature Store for feature tables. AutoML for baseline models. Delta tables for training datasets versioning. MLflow integrates natively.`,
        tips: ['MLflow', 'Feature Store', 'AutoML'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-12',
        question: 'Pass Parameters from ADF to Databricks',
        answer: `In ADF Databricks Notebook Activity → Base Parameters: add key-value pairs. In notebook, access via dbutils.widgets.get("param_name"). Supports dynamic expressions using ADF system variables.`,
        tips: ['Base Parameters', 'dbutils.widgets.get()', 'System variables'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-13',
        question: 'Manage Databricks Clusters',
        answer: `Use Job Clusters (auto-created per job, cheaper) vs All-Purpose Clusters (interactive, always on). Enable auto-scaling and auto-termination to control costs. Right-size node types (memory vs compute optimized).`,
        tips: ['Job vs All-Purpose', 'Auto-scaling', 'Auto-termination'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-14',
        question: 'Log Errors in Databricks',
        answer: `Use Python logging module or print() → all output goes to notebook stdout. Use try/except and log errors to Delta tables or ADLS for audit. Integrate with Azure Monitor for centralized alerting.`,
        tips: ['Python logging', 'Delta tables', 'Azure Monitor'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-15',
        question: 'Why ADF + Databricks Together?',
        answer: `ADF handles orchestration, scheduling, and data movement. Databricks handles heavy transformations. Each does what it's best at → ADF is the workflow engine; Databricks is the processing engine. Separation of concerns.`,
        tips: ['ADF orchestration', 'Databricks processing', 'Separation of concerns'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'az-16',
        question: 'Ensure Data Quality',
        answer: `Validate schema at ingestion. Check null counts, row counts, and value ranges. Use Delta constraints or custom PySpark checks. Log quality metrics. Fail pipeline on critical violations. Use Great Expectations or Databricks DQ.`,
        tips: ['Schema validation', 'Row counts', 'Great Expectations'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-17',
        question: 'End-to-End Churn Prediction Pipeline',
        answer: `Ingest raw events via ADF → Bronze ADLS. Databricks cleans/transforms → Silver. Feature engineering → Gold feature tables. ML model trained in Databricks MLflow. Predictions written back to Delta. ADF schedules daily.`,
        tips: ['Bronze/Silver/Gold', 'MLflow', 'Daily schedule'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-18',
        question: 'Incremental Loads in ADF',
        answer: `Watermark-based: Lookup activity reads last watermark → Copy Activity with filter → stored procedure updates watermark. Or use ADF's native incremental copy with Change Tracking on Azure SQL source.`,
        tips: ['Watermark lookup', 'Copy Activity', 'Change Tracking'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-19',
        question: 'Build Reusable ADF Pipelines',
        answer: `Use parameters and variables. Create template/master pipelines that call sub-pipelines with Execute Pipeline activity. Use ForEach for iteration. Store config in a metadata table read via Lookup Activity.`,
        tips: ['Parameters', 'Sub-pipelines', 'Metadata table'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-20',
        question: 'Ingest Large-Scale Clickstream Data in Databricks',
        answer: `Use Event Hubs/Kafka → Databricks Structured Streaming. Process micro-batches. Write to Delta Bronze table with appendOnly=True. Use Auto Loader for efficient incremental file ingestion from ADLS.`,
        tips: ['Structured Streaming', 'Delta Bronze', 'Auto Loader'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-21',
        question: 'Why Delta Lake in Churn Projects?',
        answer: `ACID transactions prevent corrupt data. Time travel for reproducible ML training. MERGE for upserts (update customer features). Schema evolution for new behavioral signals. Better performance than plain Parquet.`,
        tips: ['ACID transactions', 'Time travel', 'MERGE'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-22',
        question: 'Optimize Slow Databricks Jobs',
        answer: `Check Spark UI for bottlenecks. Enable AQE. Use Delta table OPTIMIZE + ZORDER. Cache reused DataFrames. Broadcast small lookup tables. Fix data skew. Use Photon engine. Right-size cluster.`,
        tips: ['Spark UI', 'AQE', 'OPTIMIZE ZORDER'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'az-23',
        question: 'Data Quality Checks',
        answer: `Row count validation (source vs target). Null percentage on critical columns. Value range checks. Duplicate detection. Schema validation. Log results to a DQ metrics table. Alert on failures before proceeding downstream.`,
        tips: ['Row counts', 'Null checks', 'Schema validation'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-24',
        question: 'Secure PII Data',
        answer: `Mask PII at ingestion (hash, tokenize, redact). Encrypt ADLS with CMK. Use Unity Catalog for column-level security. Restrict access via IAM/RBAC. Audit with Databricks audit logs. Apply Delta column masking policies.`,
        tips: ['PII masking', 'CMK encryption', 'Unity Catalog'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-25',
        question: 'Design Churn Feature Tables',
        answer: `Use Databricks Feature Store. Tables include: user activity (sessions, clicks), product engagement (views, purchases), recency/frequency/monetary (RFM) metrics. Partition by date. Register features with metadata for reuse.`,
        tips: ['Feature Store', 'RFM metrics', 'Partition by date'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-26',
        question: 'Production Failures and Monitoring',
        answer: `Set Azure Monitor alerts on ADF pipeline failures. Use Databricks job alerts. Implement idempotent pipelines for safe reruns. Log all job runs with status. Use on-call rotation and runbook for common failure types.`,
        tips: ['Azure Monitor', 'Idempotent pipelines', 'Runbook'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-27',
        question: 'Optimize Cost in Azure Databricks',
        answer: `Use Spot/Preemptible instances. Enable auto-termination. Use Job Clusters instead of All-Purpose. Right-size nodes. Use Delta OPTIMIZE to reduce storage. Enable Photon for faster compute per DBU. Monitor DBU usage.`,
        tips: ['Spot instances', 'Job Clusters', 'Photon'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-28',
        question: 'On-Prem SQL Server to Databricks via ADF',
        answer: `Install Self-Hosted Integration Runtime on on-prem server. Create Linked Service for SQL Server. ADF Copy Activity → source: SQL query, sink: ADLS Gen2 (Parquet). Databricks reads from ADLS. Schedule in ADF trigger.`,
        tips: ['Self-hosted IR', 'Linked Service', 'ADLS Gen2'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-29',
        question: 'Load PySpark DataFrame into Delta Table',
        answer: `df.write.format("delta")\\
    .mode("overwrite")\\
    .saveAsTable("catalog.schema.table")

# Or append:
df.write.format("delta")\\
    .mode("append").save("/path/delta")`,
        tips: ['write.format("delta")', 'mode()', 'saveAsTable()'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'az-30',
        question: 'Backend Files in Delta Table',
        answer: `Delta creates: Parquet data files (actual data), _delta_log/ directory (transaction log JSON files). Log files record all operations (add, remove, metadata). This log enables ACID transactions and time travel.`,
        tips: ['Parquet data files', '_delta_log/', 'Transaction log'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-31',
        question: 'Hive Metastore vs Unity Catalog',
        answer: `Hive Metastore: workspace-scoped, no cross-workspace sharing, limited governance. Unity Catalog: account-level, multi-workspace, fine-grained access (column, row), lineage tracking, centralized governance.`,
        tips: ['Workspace vs account', 'Fine-grained access', 'Lineage tracking'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-32',
        question: 'Managed vs External Tables',
        answer: `Managed: Databricks controls data and metadata → drop table deletes data. External: only metadata managed, data stays in ADLS → drop table leaves data intact. Use external for shared/persistent datasets.`,
        tips: ['Managed deletes data', 'External preserves', 'Shared datasets'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'az-33',
        question: 'Parameterize a Databricks Notebook',
        answer: `dbutils.widgets.text("start_date","2024-01-01")
start = dbutils.widgets.get("start_date")

Pass values from ADF Databricks Activity → Base Parameters. Use widgets for interactive parameter input.`,
        tips: ['dbutils.widgets', 'Base Parameters', 'Interactive input'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'az-34',
        question: 'Can Notebooks Have Input and Output Parameters?',
        answer: `Yes → input via dbutils.widgets. Output via dbutils.notebook.exit("value"). ADF reads the exit value as output parameter and can use it in downstream activities.`,
        tips: ['dbutils.widgets.get()', 'dbutils.notebook.exit()', 'Output parameters'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'az-35',
        question: 'Output Parameters in Real-World Pipelines',
        answer: `A Databricks notebook returns a count of processed records via dbutils.notebook.exit(str(count)). ADF reads this and decides via If Condition: if count > 0, proceed; else, skip downstream steps.`,
        tips: ['dbutils.notebook.exit()', 'If Condition', 'Count-based logic'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-36',
        question: 'Do We Need All Three Medallion Layers?',
        answer: `Not always. For simple pipelines, Bronze→Gold may suffice. Silver adds value when complex cleansing is needed before aggregation. Always have Bronze (raw) as a safety net. Gold serves the business use case directly.`,
        tips: ['Bronze always', 'Silver for cleansing', 'Gold for business'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-37',
        question: 'What is Databricks?',
        answer: `A unified data analytics platform built on Apache Spark. Provides collaborative notebooks, managed Spark clusters, Delta Lake, MLflow, and Unity Catalog. Available on Azure, AWS, and GCP as a managed service.`,
        tips: ['Unified platform', 'Apache Spark', 'Multi-cloud'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'az-38',
        question: 'Architecture of Databricks',
        answer: `Control Plane: Databricks-managed (web app, cluster manager, job scheduler, notebooks). Data Plane: runs in your cloud account (Spark clusters, storage). Data never leaves your subscription.`,
        tips: ['Control Plane', 'Data Plane', 'Data sovereignty'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'az-39',
        question: 'Which Plane Has Compute and Data?',
        answer: `Data Plane → Spark clusters (compute) and ADLS/S3/GCS storage (data) both run within your cloud subscription. This ensures data sovereignty. Control Plane only manages metadata and orchestration.`,
        tips: ['Data Plane compute', 'Data sovereignty', 'Control Plane metadata'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'az-40',
        question: 'Databricks Secrets',
        answer: `Encrypted key-value store within Databricks. Backed by Azure Key Vault. Access via dbutils.secrets.get(scope, key). Secrets are never displayed in notebook output. Create scopes backed by Key Vault for enterprise use.`,
        tips: ['dbutils.secrets.get()', 'Key Vault', 'Scope'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-41',
        question: 'Incremental Load Using ADF',
        answer: `Lookup Activity reads last watermark → Copy Activity filters source (WHERE updated_at > @watermark) → sink to ADLS → Stored Procedure Activity updates watermark table with new max date on success.`,
        tips: ['Lookup Activity', 'Copy Activity', 'Stored Procedure'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-42',
        question: 'Move Data from Bronze to Silver',
        answer: `Databricks reads Bronze Delta table → applies transformations (dedup, null handling, type casting, schema validation) → writes to Silver Delta table using MERGE or overwrite. Log row counts for audit.`,
        tips: ['Bronze to Silver', 'MERGE', 'Row count audit'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-43',
        question: 'Tightly Coupled Architecture',
        answer: `Components are interdependent → changes in one break others. Example: ETL code hardcoded to specific schema. Hard to scale, test, or modify independently. Opposite of microservices or modular design.`,
        tips: ['Interdependent', 'Hard to scale', 'Modular design'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-44',
        question: 'Fully Decoupled Architecture',
        answer: `Components communicate via interfaces/events → no direct dependencies. Example: producers write to S3/Event Hub; consumers read independently. Enables independent scaling, deployment, and failure isolation.`,
        tips: ['Event-driven', 'Independent scaling', 'Failure isolation'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-45',
        question: 'Migrate On-Prem SQL to Databricks via ADF',
        answer: `Self-Hosted IR on on-prem → ADF Linked Service → Copy Activity (SQL source → ADLS Parquet sink) → Databricks converts to Delta in Silver layer → validate row counts match source.`,
        tips: ['Self-Hosted IR', 'Copy Activity', 'Row validation'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-46',
        question: 'Load PySpark DataFrame into Delta Table',
        answer: `See question 29 → same answer. Use df.write.format("delta").mode("overwrite"/"append").saveAsTable() or .save(path). Use MERGE for upserts via DeltaTable.forPath().`,
        tips: ['write.format("delta")', 'MERGE', 'DeltaTable'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'az-47',
        question: 'Backend Files When Writing to Delta',
        answer: `See question 30 → Parquet data files + _delta_log/ JSON transaction log files. The log contains commit history, schema, and file operations. Run VACUUM to clean old files and OPTIMIZE to compact.`,
        tips: ['Parquet + _delta_log/', 'VACUUM', 'OPTIMIZE'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-48',
        question: 'Hive Metastore vs Unity Catalog',
        answer: `See question 31 → Unity Catalog is the modern replacement offering account-level governance, lineage, column-level security, and multi-workspace sharing. Hive Metastore is workspace-scoped and lacks fine-grained controls.`,
        tips: ['Unity Catalog', 'Account-level', 'Fine-grained'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-49',
        question: 'Parameterize a Databricks Notebook',
        answer: `See question 33 → use dbutils.widgets. Best practice: define all widgets at the top of the notebook. Use text, dropdown, combobox, or multiselect widget types based on input requirements.`,
        tips: ['dbutils.widgets', 'Best practice', 'Widget types'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'az-50',
        question: 'Notebooks with Input and Output Parameters',
        answer: `See question 34 → input via dbutils.widgets.get(), output via dbutils.notebook.exit(). In ADF, the exit value is captured in the notebook activity output and accessible via dynamic content expressions.`,
        tips: ['dbutils.widgets', 'dbutils.notebook.exit()', 'ADF output'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'az-51',
        question: 'How ADF Uses Notebook Output Parameters',
        answer: `The Databricks Notebook Activity in ADF exposes an output.runOutput field containing the notebook exit value. Reference it as @activity('NotebookActivity').output.runOutput in downstream ADF activities.`,
        tips: ['output.runOutput', 'activity()', 'Downstream use'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-52',
        question: 'Daily File Writes in ADLS',
        answer: `Partition ADLS folders by date: container/entity/year=2024/month=01/day=15/. Use ADF dynamic expressions (@formatDateTime(utcnow(),'yyyy/MM/dd')) to route files to correct date partition daily.`,
        tips: ['Partition by date', 'Dynamic expressions', 'formatDateTime'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-53',
        question: 'Identify New Records',
        answer: `Use watermarks (updated_at or created_at columns). Compare source max date vs last successful run date. Alternatively, use hash-based comparison or CDC with Change Tracking / SQL Server CT feature.`,
        tips: ['Watermarks', 'Hash comparison', 'CDC'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-54',
        question: 'Azure Integration Runtime (IR)',
        answer: `The compute infrastructure ADF uses to execute activities. Azure IR: cloud-to-cloud data movement. Self-Hosted IR: connects to on-prem/private network resources. Azure-SSIS IR: runs SSIS packages in cloud.`,
        tips: ['Azure IR', 'Self-Hosted IR', 'Azure-SSIS IR'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-55',
        question: 'If Azure IR Is Not Present, Create Pipeline?',
        answer: `A default Azure IR is auto-created per region. You can create additional IRs for specific regions or networking requirements. Always configure Linked Services to use the appropriate IR for the data source location.`,
        tips: ['Default Azure IR', 'Additional IRs', 'Linked Services'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-56',
        question: 'Copy Data Without IR?',
        answer: `No → Integration Runtime is mandatory for any ADF data movement. It's the underlying compute. Without IR, Copy Activity cannot connect to source or sink. At minimum, the default Azure IR must exist.`,
        tips: ['IR mandatory', 'Underlying compute', 'Default Azure IR'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'az-57',
        question: 'Can ADF Call APIs?',
        answer: `Yes → use the Web Activity to make HTTP calls (GET/POST/PUT). Used to call REST APIs, trigger Azure Functions, or invoke Logic Apps. Pass authentication headers, body, and parse JSON responses.`,
        tips: ['Web Activity', 'HTTP calls', 'REST APIs'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'az-58',
        question: 'CI/CD in Azure Data Factory',
        answer: `Connect ADF to Azure DevOps Git. Develop in feature branches. Create Pull Requests to main. ADF export ARM template to DevOps. Pipeline deploys ARM template to Test → UAT → Production environments automatically.`,
        tips: ['Azure DevOps Git', 'ARM template', 'Environments'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-59',
        question: 'CI/CD Conflict Scenarios in ADF',
        answer: `Conflicts occur when multiple developers edit the same pipeline in different branches. Also when deploying ADF changes alongside dependent Databricks notebook changes that aren't in sync across environments.`,
        tips: ['Multiple developers', 'Branch conflicts', 'Databricks sync'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-60',
        question: 'Why Parquet in Bronze and Delta in Silver/Gold?',
        answer: `Bronze: raw storage with minimal transformation → Parquet is lightweight and open. Silver/Gold: need ACID transactions, time travel, MERGE capability → Delta Lake provides these. Delta is built on Parquet with the transaction log on top.`,
        tips: ['Bronze: Parquet', 'Silver/Gold: Delta', 'Transaction log'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-61',
        question: 'Incremental Loads from Azure SQL',
        answer: `Enable Change Tracking on Azure SQL. ADF Lookup reads last sync version. Copy Activity uses @{activity('Lookup').output.firstRow.SYS_CHANGE_VERSION} to extract only changed rows. Update version on success.`,
        tips: ['Change Tracking', 'SYS_CHANGE_VERSION', 'Lookup Activity'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-62',
        question: 'How Key Vault Helps',
        answer: `Centralized secret management → connection strings, passwords, SAS tokens. ADF, Databricks, and Azure services retrieve secrets at runtime via managed identity. Eliminates credentials in code or config files. Supports automatic rotation.`,
        tips: ['Centralized secrets', 'Managed identity', 'Auto rotation'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'az-63',
        question: 'Design Fact and Dimension Tables for AR',
        answer: `Fact: fact_invoice (invoice_id, customer_id, date_id, amount, status). Dims: dim_customer, dim_date, dim_aging_bucket. Use surrogate keys, SCD Type 2 for customer history.`,
        tips: ['Fact table', 'Dimension tables', 'Surrogate keys'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-64',
        question: 'AR Aging Buckets',
        answer: `Aging buckets classify outstanding invoices by overdue time: Current (0 days), 1–30 days, 31–60 days, 61–90 days, 90+ days. Calculated as DATEDIFF(today, due_date) categorized into bands.`,
        tips: ['Aging classification', 'DATEDIFF', 'Bucket bands'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-65',
        question: 'Why Delta Lake for Healthcare Analytics?',
        answer: `HIPAA compliance needs audit trails → Delta's transaction log provides full history. Time travel for reproducibility. ACID transactions prevent partial data corruption. MERGE for patient record upserts. Schema enforcement for data integrity.`,
        tips: ['Transaction log', 'Time travel', 'HIPAA compliance'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-66',
        question: 'Manage Reruns and Failures',
        answer: `Design idempotent pipelines (safe to rerun). Use overwrite mode or MERGE for Delta. Log each pipeline run with status and row counts. On failure, fix root cause and rerun → pipeline should produce same results.`,
        tips: ['Idempotent design', 'MERGE', 'Row count logging'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'az-67',
        question: 'Role of ADF vs Databricks',
        answer: `ADF: orchestration, scheduling, data movement, trigger management, monitoring. Databricks: heavy transformation, ML, feature engineering, Delta Lake operations. ADF coordinates when and what; Databricks executes the computation.`,
        tips: ['ADF orchestration', 'Databricks computation', 'When and what'],
        difficulty: 'easy',
        company: 'Common'
      }
    ]
  },
  airflow: {
    id: 'airflow',
    name: 'Airflow',
    icon: 'wind',
    color: 'bg-indigo-500',
    description: 'Apache Airflow workflow orchestration',
    questions: [
      {
        id: 'af-1',
        question: 'What is Apache Airflow?',
        answer: `An open-source workflow orchestration platform. Schedules, monitors, and manages data pipelines as code using DAGs (Python). Widely used for ETL, ML pipelines, and data engineering workflows.`,
        tips: ['Open-source', 'DAG-based', 'Airbnb origin'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'af-2',
        question: 'What is a DAG in Airflow?',
        answer: `Directed Acyclic Graph → a Python file defining a pipeline's tasks and their dependencies. "Directed": tasks have direction. "Acyclic": no loops. Airflow Scheduler reads DAG files and triggers them per schedule.`,
        tips: ['Directed Acyclic Graph', 'Python files', 'No loops'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'af-3',
        question: 'Task and Job in Airflow',
        answer: `Task: a single unit of work (one operator instance). DAG Run: one execution of the entire DAG. Task Instance: a specific run of a task within a DAG run. "Job" is informal → usually means a DAG run.`,
        tips: ['Task unit of work', 'DAG Run execution', 'Task Instance run'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'af-4',
        question: '20 Tasks in Parallel in Airflow',
        answer: `Set concurrency on DAG and tasks. Use LocalExecutor (multi-process) or CeleryExecutor (distributed). Set task dependencies to none between parallel tasks. Tune max_active_tasks per DAG.`,
        tips: ['Concurrency setting', 'LocalExecutor', 'max_active_tasks'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-5',
        question: 'Airflow Operators',
        answer: `PythonOperator: run Python. BashOperator: run shell. GlueJobOperator: trigger Glue. S3Operator: S3 operations. SQLOperator: run SQL. TriggerDagRunOperator: trigger another DAG. HttpOperator: REST calls. EmailOperator: send emails.`,
        tips: ['PythonOperator', 'BashOperator', 'GlueJobOperator'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'af-6',
        question: 'XCom in Airflow',
        answer: `Cross-Communication → pass small values between tasks. Push: ti.xcom_push(key='result', value=data). Pull: ti.xcom_pull(task_ids='task1', key='result'). Not for large data → use S3/database for big payloads.`,
        tips: ['xcom_push()', 'xcom_pull()', 'Small data only'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-7',
        question: 'Write a DAG for PySpark Job',
        answer: `with DAG('spark_pipeline',
    schedule_interval='@daily') as dag:

  glue = GlueJobOperator(
    task_id='run_glue',
    job_name='my_spark_job',
    script_args={'--date':
     '{{ ds }}'})

  glue`,
        tips: ['DAG()', 'GlueJobOperator', 'ds template'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-8',
        question: 'Trigger a DAG Manually',
        answer: `Via Airflow UI: DAGs → click play → button → Trigger DAG. Via CLI: airflow dags trigger dag_id. Via REST API: POST /api/v1/dags/{dag_id}/dagRuns with auth token and optional config JSON.`,
        tips: ['Airflow UI', 'CLI trigger', 'REST API'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'af-9',
        question: 'Ways to Trigger a DAG',
        answer: `Schedule (cron expression), manual trigger (UI/CLI/API), TriggerDagRunOperator (from another DAG), sensor-based (FileSensor, ExternalTaskSensor), REST API. MWAA/Cloud Composer also support EventBridge triggers.`,
        tips: ['Schedule', 'Manual trigger', 'Sensor trigger'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'af-10',
        question: 'Scheduler vs Executor in Airflow',
        answer: `Scheduler: reads DAG files, determines which tasks are ready to run, and queues them. Executor: runs the queued tasks. Scheduler decides what runs; Executor decides how it runs (local, Celery, Kubernetes).`,
        tips: ['Scheduler reads', 'Executor runs', 'Separation of concerns'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-11',
        question: 'Types of Executors in Airflow',
        answer: `SequentialExecutor: one task at a time (dev only). LocalExecutor: parallel on single machine. CeleryExecutor: distributed across workers. KubernetesExecutor: each task in a K8s pod. CeleryKubernetesExecutor: hybrid.`,
        tips: ['Sequential for dev', 'Local for single', 'Celery/K8s for scale'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-12',
        question: 'Store Connections in Airflow',
        answer: `Airflow Connections (UI/CLI): store host, login, password, extras. Encrypted in the metadata DB. Reference by conn_id in operators. Use Secrets Backend (HashiCorp Vault, AWS Secrets Manager) for production security.`,
        tips: ['Connections UI/CLI', 'Encrypted', 'Secrets Backend'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-13',
        question: 'Change DAG Configuration',
        answer: `Modify Python DAG file → change schedule_interval, default_args, catchup, max_active_runs, task params. Restart Scheduler to pick up changes. Use Airflow Variables for runtime config without code changes.`,
        tips: ['Modify DAG file', 'Restart Scheduler', 'Airflow Variables'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-14',
        question: 'Create a DAG in Airflow',
        answer: `from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime

with DAG('my_dag',
    start_date=datetime(2024,1,1),
    schedule_interval='@daily',
    catchup=False) as dag:

  t1 = PythonOperator(
    task_id='task1',
    python_callable=my_func)`,
        tips: ['DAG()', 'PythonOperator', 'python_callable'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'af-15',
        question: 'Task Retries in Airflow',
        answer: `Set in default_args: retries=3, retry_delay=timedelta(minutes=5). Also configurable per task. Failed tasks retry automatically after delay. Use exponential backoff: retry_exponential_backoff=True.`,
        tips: ['retries parameter', 'retry_delay', 'exponential_backoff'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-16',
        question: 'Pipeline Running Daily, Processing Only New Data',
        answer: `Use Airflow's execution_date (or data_interval_start). Pass as parameter to query: WHERE date = '{{ ds }}'. Only processes data for the specific execution date. Set catchup=False for current-only runs.`,
        tips: ['ds template', 'execution_date', 'catchup=False'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-17',
        question: 'DAG Types Used in Projects',
        answer: `Linear DAGs (sequential tasks), branching DAGs (BranchPythonOperator), parallel DAGs (multiple tasks no dependency), dynamic DAGs (generated programmatically from config). Most common: linear + parallel combination.`,
        tips: ['Linear', 'Branching', 'Parallel'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-18',
        question: 'Downstream Task Runs Even if Upstream Fails',
        answer: `Use trigger_rule='all_done' on the downstream task. Other options: 'all_success' (default), 'one_failed', 'none_failed', 'none_skipped'. Trigger rules give fine-grained control over dependency behavior.`,
        tips: ['trigger_rule', 'all_done', 'Fine-grained control'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-19',
        question: 'Handle Large Datasets in Airflow',
        answer: `Airflow is an orchestrator → don't process data inside Airflow tasks. Delegate to Glue, Spark, or Databricks. Use XCom only for metadata (file paths, counts). Avoid pulling large data into operator memory.`,
        tips: ['Orchestrator not processor', 'Delegate to Spark', 'XCom for metadata'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-20',
        question: 'Airflow vs AWS Glue for Orchestration',
        answer: `Glue Workflows only orchestrate Glue jobs and Crawlers. Airflow orchestrates anything → Glue, Lambda, Redshift, Databricks, HTTP calls, bash. Airflow gives more flexibility, DAG visualization, and cross-service coordination.`,
        tips: ['Glue Workflows limited', 'Airflow flexible', 'Cross-service'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-21',
        question: 'Airflow vs Step Functions',
        answer: `Airflow: code-based DAGs, rich UI, complex Python logic, scheduling built-in. Step Functions: JSON/visual state machine, better AWS service integration, no scheduler → triggered by events. Airflow for scheduled; Step Functions for event-driven.`,
        tips: ['Airflow for scheduled', 'Step Functions event-driven', 'Different use cases'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-22',
        question: 'Scheduler Not Picking Up New DAGs',
        answer: `Check DAG parsing errors in Scheduler logs. Ensure DAG file is in the dags folder. Verify no import errors. Restart Scheduler. Check dag_discovery_safe_mode. Ensure min_file_process_interval isn't too long.`,
        tips: ['Check logs', 'Dags folder', 'Restart Scheduler'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-23',
        question: 'DAG Concurrency Issues',
        answer: `max_active_runs: limits concurrent DAG runs. concurrency: max tasks running at once per DAG. depends_on_past=True: task won't run until previous run's same task succeeded. Tune these to prevent queue overload.`,
        tips: ['max_active_runs', 'concurrency', 'depends_on_past'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-24',
        question: 'Task Keeps Failing After Retries',
        answer: `Check logs for root cause (code error, connection issue, data issue). Fix the underlying problem. Mark task as success manually if safe to skip. Trigger DAG run from failed task forward. Add monitoring/alert for repeat failures.`,
        tips: ['Root cause analysis', 'Fix underlying', 'Manual mark'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-25',
        question: 'Dynamic Task Mapping in Airflow',
        answer: `Airflow 2.3+ feature → generate tasks dynamically at runtime based on data. Example: process.expand(item=get_items()) creates one task per item. Use for processing unknown number of files or partitions.`,
        tips: ['Airflow 2.3+', 'process.expand()', 'Dynamic tasks'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'af-26',
        question: 'Monitor Jobs in Airflow',
        answer: `Airflow UI: DAG grid view, Gantt chart, task logs. Monitor task duration trends. Set SLA misses for alerts. Integrate with CloudWatch (MWAA), Datadog, or Prometheus. Check failed/queued task counts regularly.`,
        tips: ['Airflow UI', 'Gantt chart', 'SLA misses'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-27',
        question: 'Send Status Notifications via Email',
        answer: `Set email_on_failure=True, email=['team@co.com'] in default_args. Or use EmailOperator explicitly. Configure SMTP in airflow.cfg. For Slack: use SlackWebhookOperator in on_failure_callback.`,
        tips: ['email_on_failure', 'EmailOperator', 'SlackWebhookOperator'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'af-28',
        question: 'Define Dependencies in Airflow DAGs',
        answer: `Bitshift operators: task1 >> task2 (task1 runs before task2). List: task1 >> [task2, task3] (parallel). set_downstream() / set_upstream() methods also work. Use chain() for complex sequences.`,
        tips: ['>> operator', 'List for parallel', 'chain()'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'af-29',
        question: 'DAG Run vs Task Instance',
        answer: `DAG Run: a single execution of an entire DAG for a given execution_date. Task Instance: one specific task within that DAG run. Each DAG run contains multiple task instances → one per task in the DAG.`,
        tips: ['DAG Run execution', 'Task Instance per task', 'Multiple instances'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'af-30',
        question: 'Monitor and Set Up Alerts in Airflow',
        answer: `SLA Misses: set sla parameter on tasks. Email alerts on failure/retry. Integrate Airflow metrics with Prometheus/Grafana. Use on_failure_callback to trigger custom alerting (PagerDuty, Slack, SNS).`,
        tips: ['SLA parameter', 'Prometheus/Grafana', 'on_failure_callback'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-31',
        question: 'DAG Fails Due to Missing Connection',
        answer: `Check Admin → Connections. Add the missing connection with correct credentials. Test it. If production, add to Secrets Backend. Rerun failed task from Airflow UI. Document all required connections in README.`,
        tips: ['Admin Connections', 'Secrets Backend', 'Documentation'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-32',
        question: 'Integrate Airflow with Glue / Deployment',
        answer: `Use GlueJobOperator from airflow.providers.amazon.aws.operators.glue. Provide job_name, script_args, aws_conn_id. Deploy Airflow on MWAA (managed), EC2, or Kubernetes (Helm chart). DAGs stored in S3 (MWAA) or local dags folder.`,
        tips: ['GlueJobOperator', 'MWAA', 'S3 dags folder'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-33',
        question: 'Airflow Webserver',
        answer: `The UI component of Airflow. Shows: DAG list, DAG runs, task instances, logs, connections, variables, XCom values, SLA misses, execution timeline, and Gantt chart. Access via browser on port 8080.`,
        tips: ['Web UI', 'Port 8080', 'Gantt chart'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'af-34',
        question: 'Incremental Loads in Airflow Pipeline',
        answer: `Pass {{ ds }} (execution date) as parameter to downstream jobs. Job processes only that day's data. Use catchup=True to backfill historical dates. Combine with idempotent processing to safely rerun any date.`,
        tips: ['ds parameter', 'catchup=True', 'Idempotent'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'af-35',
        question: 'Schedule a Glue Job Using Airflow',
        answer: `glue_task = GlueJobOperator(
 task_id='run_etl',
 job_name='my-glue-job',
 script_args={
 '--date': '{{ ds }}',
 '--env': 'prod'
 },
 aws_conn_id='aws_default',
 dag=dag
)`,
        tips: ['GlueJobOperator', 'script_args', 'aws_conn_id'],
        difficulty: 'medium',
        company: 'Common'
      }
    ]
  },
  scenarios: {
    id: 'scenarios',
    name: 'Scenarios & Projects',
    icon: 'briefcase',
    color: 'bg-purple-500',
    description: 'Scenario-based and project-based interview questions',
    questions: [
      {
        id: 'sc-1',
        question: 'You are ingesting daily sales data into S3. One day, the pipeline ingests duplicate records. How will you detect and handle this duplication?',
        answer: `Check Spark UI for skewed stages or straggler tasks. Check if source data volume increased. Look for data skew. Verify DPU count hasn't changed. Check for small file explosion. Review CloudWatch for resource constraints. Enable AQE.`,
        tips: ['Spark UI analysis', 'AQE', 'CloudWatch'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sc-2',
        question: 'Your Spark job is failing with an Out Of Memory (OOM) error on the executor nodes. What steps will you take to resolve it?',
        answer: `Increase executor memory (spark.executor.memory). Increase partitions to reduce per-partition size. Avoid collect(). Cache strategically. Use persist(DISK_ONLY). Check for data skew concentrating data on one executor.`,
        tips: ['Increase memory', 'More partitions', 'Avoid collect()'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sc-3',
        question: 'You are asked to implement schema evolution in your pipeline. Yesterday the source added a new column, breaking your ETL job. How will you handle it in Glue or Spark?',
        answer: `In Glue: use Dynamic Frames with resolveChoice(). In Spark: use mergeSchema=True for Parquet/Delta. Add schema validation at ingestion with alerts on change. Design pipelines to handle extra columns gracefully with default nulls.`,
        tips: ['Dynamic Frames', 'mergeSchema=True', 'Schema validation'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sc-4',
        question: 'Your Redshift query is running for hours without finishing. How do you debug and optimize it?',
        answer: `Run EXPLAIN → check for missing dist/sort keys or full table scans. Check WLM queue → query may be queued. Run VACUUM and ANALYZE. Look for table locks. Rewrite with better join order and predicate pushdown.`,
        tips: ['EXPLAIN', 'WLM queue', 'VACUUM ANALYZE'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sc-5',
        question: 'You are migrating a SQL-based on-prem data warehouse to AWS Redshift. What are the key factors you will consider to ensure performance and cost efficiency?',
        answer: `Assess: data volume, query patterns, dependencies. Use DMS for migration. Design dist/sort keys for top queries. Convert DDL. Test query performance. Set up COPY jobs for bulk load. Validate row counts and results before cutover.`,
        tips: ['DMS migration', 'Dist/Sort keys', 'COPY jobs'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sc-6',
        question: 'An Airflow DAG failed in production due to a missing connection configuration. How will you troubleshoot and fix the issue?',
        answer: `Check Admin → Connections. Add the missing connection with correct credentials. Test it. Review why connection was missing → environment promotion issue? Document all required connections. Add connection existence checks to pipeline startup.`,
        tips: ['Admin Connections', 'Documentation', 'Startup checks'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sc-7',
        question: 'Your data pipeline has upstream dependencies (3 sources). One source failed, but the pipeline still ingested incomplete data. How will you implement data quality checks?',
        answer: `Implement pre-load validation: check row counts from each source before proceeding. Use ADF/Airflow conditions → only proceed if all sources pass validation. Flag incomplete loads in a run log table. Alert on failure.`,
        tips: ['Row count validation', 'Conditional logic', 'Alerting'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sc-8',
        question: 'A client requests real-time dashboards, but your system only supports batch processing. How will you redesign the pipeline to support near real-time analytics?',
        answer: `Introduce Kinesis Data Streams or Kafka for event streaming. Use Kinesis Firehose → S3 (micro-batch every 1–5 min). Databricks Structured Streaming or Glue Streaming for processing. Athena or Redshift Materialized Views for dashboards.`,
        tips: ['Kinesis/Kafka', 'Micro-batch', 'Structured Streaming'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sc-9',
        question: 'In a PySpark job, you notice data skew where one key has 90% of the records. How would you handle this issue?',
        answer: `Apply salting: append random suffix (0–9) to hot key. Broadcast small side table with 10 copies of each key (one per salt). Join on salted key. Remove salt after join. Alternatively, enable AQE → it detects skew and splits partitions automatically.`,
        tips: ['Salting', 'AQE', 'Broadcast'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sc-10',
        question: 'Your data is landing in S3 as CSV files, but analysts are complaining about query performance in Athena. How would you improve performance without changing the source system?',
        answer: `Convert CSV to Parquet: df.write.parquet(s3_path). Partition by date or region. Update Glue Catalog. Run MSCK REPAIR TABLE. Queries now use partition pruning and column reads only → massive speed improvement without changing source.`,
        tips: ['CSV to Parquet', 'Partitioning', 'Glue Catalog'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sc-11',
        question: 'You are handling GDPR-compliant data. How will you ensure PII data masking and encryption in your ETL pipeline?',
        answer: `Mask at ingestion: hash (SHA-256), tokenize, or redact PII fields. Encrypt storage with KMS. Restrict column access via Unity Catalog or IAM. Implement right-to-erasure via Delta DELETE. Log all access. Never store PII in logs.`,
        tips: ['PII masking', 'KMS encryption', 'Right-to-erasure'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sc-12',
        question: 'You are asked to design a slowly changing dimension (SCD) Type 2 pipeline in Glue. How will you track history while keeping query performance acceptable?',
        answer: `Read new records → compare hash with existing. For changed records: set end_date = today, is_current = False on old rows. Insert new row with new values and is_current = True. Use MERGE in Delta or staging table + SQL in Redshift.`,
        tips: ['SCD Type 2', 'is_current flag', 'MERGE'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sc-13',
        question: 'Your batch ETL pipeline has strict SLAs (must finish before 8 AM daily). What steps will you take to ensure timely completion even when data volume doubles?',
        answer: `Profile job bottlenecks. Pre-warm clusters. Increase DPUs/executors for peak days. Partition and compact input data. Add SLA monitoring (CloudWatch alarm, Airflow SLA). Add 30-min buffer. Use parallel processing for independent steps.`,
        tips: ['Profile bottlenecks', 'Pre-warm', 'SLA monitoring'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sc-14',
        question: 'During a production release, your Spark job failed because of missing Python packages. How would you package and deploy external dependencies reliably in Glue/Lambda/Spark?',
        answer: `For Glue: use --additional-python-modules or upload .whl to S3. For Lambda: bundle in ZIP or Lambda Layer. For Spark: use --packages (Maven) or distribute via spark.submit.pyFiles. Store dependency versions in requirements.txt and pin them.`,
        tips: ['--additional-python-modules', 'Lambda Layer', '--packages'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sc-15',
        question: 'A downstream analytics team reports inconsistent results from the same dataset at different times of the day. How do you debug and ensure data consistency?',
        answer: `Check if upstream pipeline has multiple runs writing to same partition (overwrite race condition). Verify data is not modified mid-query. Use Delta snapshot isolation. Add row count and checksum comparison per pipeline run. Implement dataset versioning.`,
        tips: ['Delta snapshot', 'Checksum', 'Versioning'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sc-16',
        question: 'Your team wants to move from a monolithic ETL pipeline to modular micro-ETL jobs. What benefits will this provide, and how would you implement it?',
        answer: `Benefits: independent deployment, easier debugging, reusability, smaller blast radius on failure. Implement by splitting by domain/source. Each micro-ETL handles one source/transform. Orchestrate with Airflow. Share common libraries via Python packages.`,
        tips: ['Independent deployment', 'Airflow orchestration', 'Python packages'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sc-17',
        question: 'Your data pipeline is built on AWS services. A region-wide outage occurs. How will you design for fault tolerance and high availability?',
        answer: `Multi-region S3 replication. Redshift cross-region snapshots. Route 53 failover routing. Lambda deployed in multiple regions. Use AWS Global Accelerator. Design for async processing → SQS persists events if processing region is down.`,
        tips: ['Multi-region', 'SQS async', 'Route 53 failover'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sc-18',
        question: 'The business team requests near real-time alerts when fraud transactions are detected. How would you implement this on AWS?',
        answer: `Transaction → Kinesis Data Streams → Lambda (ML fraud detection model) → if fraud score high → SNS alert → email/SMS/Slack. Also write results to DynamoDB for real-time lookup. Use Kinesis Firehose for S3 archival.`,
        tips: ['Kinesis Streams', 'Lambda ML', 'SNS alerts'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sc-19',
        question: 'A data scientist asks you to provide training data from multiple sources (structured + unstructured). How do you design a pipeline to ensure clean, joined, and high-quality data?',
        answer: `Ingest structured (DB → Spark → Delta). Ingest unstructured (files/API → S3 → NLP preprocessing). Join on common entity ID. Run data quality checks. Write to feature table. Apply consistent schema and timestamps for reproducibility.`,
        tips: ['Multi-source', 'NLP preprocessing', 'Feature table'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sc-20',
        question: 'Everyday we load data and the job is scheduled, but today it failed. Data will not be loaded. What do you do?',
        answer: `Immediately check logs for root cause. Fix the issue. Manually trigger the pipeline for the missed date. Validate data loaded correctly. Notify downstream teams of the delay. Document the incident. Add preventive monitoring.`,
        tips: ['Root cause', 'Manual trigger', 'Documentation'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sc-21',
        question: 'You have TABLE1 and TABLE2. Give the output of Cross Join, Left Outer Join, Right Outer Join, Full Outer Join.',
        answer: `Cross Join: all combinations (N×M rows). Left Outer: all T1 rows + matched T2 (NULLs where no match). Right Outer: all T2 rows + matched T1 (NULLs where no match). Full Outer: all rows from both, NULLs where no match on either side.`,
        tips: ['Cross: N×M', 'Left: T1 all', 'Full: both all'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sc-22',
        question: 'If you have a pipeline that has completed 40% of the job but then fails, how do you ensure the rest 60% completes without re-executing the first 40%?',
        answer: `Design idempotent checkpoints → write completed segments to intermediate storage (S3 prefix or Delta). On restart, check which checkpoint exists and skip those. Use Airflow task-level reruns. Glue Job Bookmarks handle this for incremental sources.`,
        tips: ['Idempotent checkpoints', 'Intermediate storage', 'Glue Bookmarks'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sc-23',
        question: 'You have 100 stores connected via API and want data from all stores every 10 minutes with exception handling. How do you design this?',
        answer: `Use async Python (asyncio + aiohttp) or ThreadPoolExecutor for parallel API calls. Handle errors per store independently. Retry on failure. Store results in S3 partitioned by store + timestamp. Schedule with Airflow every 10 min.`,
        tips: ['Async Python', 'ThreadPoolExecutor', 'Partitioned storage'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sc-24',
        question: 'You are preserving large files without using Spark. How do you approach this?',
        answer: `Use Python generators + chunked reading (pd.read_csv(chunksize=10000)). Process chunk by chunk → transform and write to output. Use Dask for parallel processing. For very large files, consider splitting into smaller files first.`,
        tips: ['Chunked reading', 'Generators', 'Dask'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sc-25',
        question: 'Keeping a KPI in mind, explain how you are extracting, cleaning and loading data.',
        answer: `Extract: pull from source (API, DB, S3) filtered to relevant KPI timeframe. Clean: remove nulls, duplicates, outliers; standardize formats. Load: write to data warehouse partitioned by KPI dimension (date, region). Validate KPI metric matches expected range.`,
        tips: ['KPI filtering', 'Clean transforms', 'Validate'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sc-26',
        question: 'How do you restrict duplicate records from passing downstream in your pipeline?',
        answer: `Add deduplication step before writing to target: df.dropDuplicates(['primary_key']). In Redshift: use staging table + MERGE with ON conflict key. In Delta: use MERGE INTO with match on primary key. Log and alert on high duplicate rates.`,
        tips: ['dropDuplicates()', 'MERGE', 'Alert on duplicates'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sc-27',
        question: 'Design a pipeline for ecommerce – what tables and columns do you need?',
        answer: `Tables: fact_orders (order_id, customer_id, product_id, date_id, qty, amount), dim_customer (customer_id, name, segment, region), dim_product (product_id, category, price), dim_date. KPIs: revenue, AOV, conversion rate, churn by segment.`,
        tips: ['Fact table', 'Dimension tables', 'KPIs'],
        difficulty: 'medium',
        company: 'Common'
      },
      {
        id: 'sc-28',
        question: 'It takes 36 hours in Elastic Search for Oracle data to be ingested and processed. How do you optimize this?',
        answer: `Parallelize Oracle extraction using partitioned JDBC reads (partition by ID range). Use Spark for transformation instead of single-threaded ETL. Batch-index into Elasticsearch using elasticsearch-hadoop connector. Use index aliases for zero-downtime reindexing. Target: <4 hours.`,
        tips: ['Partitioned JDBC', 'Spark ETL', 'elasticsearch-hadoop'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sc-29',
        question: 'You have a new client with different data vendors and 15 key metrics that change weekly or monthly. How would you set up an ETL pipeline?',
        answer: `Build metadata-driven ETL: store KPI definitions in a config table (metric name, formula, source column, refresh frequency). Pipeline reads config and executes dynamically. Adding/changing a KPI = update config table, no code change.`,
        tips: ['Metadata-driven', 'Config table', 'Dynamic execution'],
        difficulty: 'hard',
        company: 'Common'
      },
      {
        id: 'sc-30',
        question: 'What is a CROSS JOIN?',
        answer: `A CROSS JOIN returns the Cartesian product of two tables → every row from the left table is combined with every row from the right table. No join condition is needed. Result rows = rows in Table A × rows in Table B.

Example

  SELECT a.color, b.size
  FROM colors a
  CROSS JOIN sizes b;

If colors has 3 rows (Red, Blue, Green) and sizes has 2 rows (S, M), the result is 6 rows: (Red, S), (Red, M), (Blue, S), (Blue, M), (Green, S), (Green, M).

When to Use

Use cases: Generate all combinations (e.g., product variants), create test datasets, build date/dimension grids. Avoid on large tables → can produce millions of rows quickly.`,
        tips: ['Cartesian product', 'No ON clause', 'Use with caution'],
        difficulty: 'easy',
        company: 'Common'
      }
    ]
  },
  'self-introduction': {
    id: 'self-introduction',
    name: 'Self Introduction',
    icon: 'user',
    color: 'bg-green-500',
    description: 'Master your self-introduction for data engineering interviews',
    questions: [
      {
        id: 'si-1',
        question: 'How do you structure a self-introduction for a data engineering interview?',
        answer: `A strong self-introduction for a Data Engineering interview should follow this structure:

**1. Opening (30 seconds)**
Start with your name, current role, and years of experience. Example: "Hi, I'm [Name], a Data Engineer with 4+ years of experience building scalable data pipelines."

**2. Technical Background (1-2 minutes)**
Highlight your core skills: cloud platforms (AWS/Azure/GCP), processing frameworks (Spark, Flink), orchestration tools (Airflow, Dagster), and databases (SQL, NoSQL). Mention your expertise level for each.

**3. Project Highlights (2-3 minutes)**
Describe 2-3 impactful projects:
- What was the business problem?
- What technologies did you use?
- What was the measurable impact? (e.g., "reduced pipeline runtime by 60%", "processed 10TB daily")

**4. Career Journey (30 seconds)**
Briefly explain your progression and why you're interested in this role/company.

**5. Soft Skills & Culture Fit (30 seconds)**
Mention collaboration, communication, and any relevant achievements.

**Key Tips:**
- Keep it to 3-5 minutes maximum
- Practice until it sounds natural, not scripted
- Tailor it to the company's tech stack
- Show enthusiasm and curiosity`,
        tips: ['3-5 minutes max', 'Tailor to company stack', 'Show measurable impact'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'si-2',
        question: 'What should a data engineer mention about their current project in self-introduction?',
        answer: `When discussing your current project, focus on these elements:

**Project Overview**
- What does the project do? (e.g., "Real-time analytics pipeline for e-commerce platform")
- What business problem does it solve?

**Tech Stack**
- Cloud platform: AWS/GCP/Azure
- Processing: Spark, Flink, Kafka
- Storage: S3, BigQuery, Snowflake, Redshift
- Orchestration: Airflow, Prefect, Dagster

**Scale & Complexity**
- Data volume: (e.g., "10TB daily ingestion")
- Number of sources: (e.g., "15+ data sources")
- Team size: (e.g., "5-engineer team")

**Your Role**
- End-to-end ownership or specific components
- Architectural decisions you made
- Challenges you solved

**Impact**
- Business metrics: revenue, cost savings
- Technical improvements: performance, reliability
- Team impact: documentation, mentoring

**Example:**
"I'm currently working on a real-time analytics pipeline processing 50M events/day for a fintech company. I lead the architecture design using Kafka + Flink on AWS, which reduced latency from 4 hours to under 5 minutes. My team of 4 delivers 99.9% uptime."`,
        tips: ['Use numbers', 'Show ownership', 'Quantify impact'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'si-3',
        question: 'How to answer "Tell me about yourself" in a data engineering interview?',
        answer: `Use the Present-Past-Future framework:

**Present (Current Role)**
"I'm currently a Senior Data Engineer at [Company], where I've been for [X] years. I specialize in building cloud-native data platforms on AWS."

**Past (Background)**
"Before this, I worked at [Company] where I led the migration of on-premise ETL jobs to Spark, reducing costs by 40%. I have [X] years of total experience in data engineering."

**Future (Why This Role)**
"I'm excited about this role at [Company] because [specific reason - tech stack, mission, scale]. I'm particularly interested in [specific technology or problem area mentioned in job description]."

**Alternative: 4-Part Structure**

1. **Who you are:** "I'm a Data Engineer with [X] years building data pipelines"
2. **What you do:** "I specialize in [core skills - e.g., real-time processing, data warehousing]"
3. **Recent achievements:** "Recently, I led a project that [specific achievement with metrics]"
4. **Why here:** "I'm drawn to [Company] because [specific reason]"

**Key Points:**
- Keep it professional, not personal
- Focus on data engineering specifically
- Align with the job requirements
- 2-3 minutes maximum`,
        tips: ['Present-Past-Future', 'Align with job', '2-3 minutes'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'si-4',
        question: 'How to introduce yourself when transitioning from a different field to data engineering?',
        answer: `When transitioning to data engineering, frame your background strategically:

**Acknowledge the Transition Honestly**
"I'm transitioning from [previous field] to data engineering. While my title wasn't 'Data Engineer', I've been working with data-intensive systems and have developed strong technical foundations."

**Bridge the Skills**
Highlight transferable skills:
- **From Software Engineering:** Python/SQL, APIs, debugging, version control, CI/CD
- **From Analytics/BI:** SQL, data modeling, business understanding, reporting
- **From DevOps:** Cloud infrastructure, automation, monitoring, containers
- **From academia:** Research skills, statistics, complex problem-solving

**Show Self-Learning**
Demonstrate initiative:
- Online courses completed (Coursera, Udemy, DataCamp)
- Personal projects built
- Open source contributions
- Kaggle competitions

**Highlight Relatable Experience**
"Even though I was a Backend Engineer, I built event-driven pipelines processing 1M+ daily events, which gave me hands-on experience with Kafka and stream processing."

**Be Confident**
"I'm confident my [specific skills] will transfer well, and I'm committed to deepening my expertise in [specific area]."

**Example:**
"I spent 3 years as a backend engineer, but I've been building data pipelines on the side for 2 years. I've completed [course], built a real-time analytics project on GCP, and I'm ready to make data engineering my primary focus."`,
        tips: ['Bridge skills', 'Show initiative', 'Be honest'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'si-5',
        question: 'What technical skills should a data engineer highlight in self-introduction?',
        answer: `Highlight skills based on the job description, but cover these core areas:

**Programming Languages**
- Python (primary for data engineering)
- SQL (essential for all roles)
- Scala/Java (for Spark, Flink)
- Bash/Shell scripting

**Cloud Platforms**
Pick your strongest:
- AWS: Glue, EMR, Redshift, S3, Kinesis, Lambda, Athena
- GCP: Dataflow, BigQuery, Composer, Pub/Sub, Cloud Storage
- Azure: Data Factory, Synapse, Databricks, Event Hubs

**Data Processing**
- Batch: Spark, Hive, Hadoop
- Streaming: Kafka, Flink, Spark Streaming, Kinesis

**Data Storage**
- Data Warehouse: Redshift, Snowflake, BigQuery, Synapse
- Data Lake: S3, ADLS, GCS
- Databases: PostgreSQL, MySQL, MongoDB, Cassandra

**Orchestration**
- Airflow, Prefect, Dagster, Azure Data Factory

**Other Tools**
- dbt, Docker, Terraform, Git

**How to Present:**
Don't just list - show depth:
❌ "I know Python, SQL, AWS, Spark, Kafka"
✅ "I'm proficient in Python for pipeline development, with 3 years of experience in AWS (Redshift, Glue, Kinesis) and real-time processing using Spark and Kafka"

**For Freshers:**
Focus on: Python, SQL, one cloud platform, basics of Spark/airflow, personal projects`,
        tips: ['Match job description', 'Show depth not breadth', 'Quantify experience'],
        difficulty: 'easy',
        company: 'Common'
      },
      {
        id: 'si-6',
        question: 'How to make self-introduction impactful with project examples?',
        answer: `Use the STAR + Impact method for project examples:

**STAR Method:**
- **Situation:** The context/challenge
- **Task:** Your responsibility
- **Action:** What you did specifically
- **Result:** Measurable outcome

**Example Project Description:**

**Situation:** "Our data warehouse was taking 12+ hours to process daily sales data, blocking analyst queries."

**Task:** "I was assigned to optimize the ETL pipeline and reduce processing time."

**Action:** "I rewrote the Spark jobs using partition pruning, converted CSV to Parquet, and implemented incremental loads using change data capture."

**Result:** "Reduced pipeline runtime from 12 hours to 45 minutes - an 87% improvement. This saved 11 hours of compute cost daily and enabled real-time reporting."

**Structure for Self-Introduction:**

"I led the redesign of our e-commerce analytics pipeline. The challenge was processing 5 years of historical data for a migration. I built a parallel Spark processing framework on AWS EMR that partitioned data by region and date. The result was a 10x speed improvement, cutting migration time from 3 weeks to 2 days."

**Key Tips:**
- Use numbers: %, hours saved, records processed, cost reduced
- Focus on YOUR contributions (use "I", not "we")
- Choose projects relevant to the role
- Practice telling stories naturally`,
        tips: ['Use STAR method', 'Quantify results', 'Focus on your role'],
        difficulty: 'easy',
        company: 'Common'
      }
    ]
  }
};

export const allTopics: TopicData[] = [
  dataEngineeringTopics['my-resume'],
  dataEngineeringTopics['self-introduction'],
  dataEngineeringTopics.python,
  dataEngineeringTopics.pandas,
  dataEngineeringTopics.sql,
  dataEngineeringTopics.pyspark,
  dataEngineeringTopics.aws,
  dataEngineeringTopics.azure,
  dataEngineeringTopics.airflow,
  dataEngineeringTopics.scenarios,
];
