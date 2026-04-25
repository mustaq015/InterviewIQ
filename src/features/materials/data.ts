export interface Note {
  id: string;
  title: string;
  content: string;
  topic: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'video' | 'document';
  url: string;
  topic: string;
  description: string;
}

export interface QuickNote {
  id: string;
  content: string;
  topic: string;
  createdAt: Date;
}

export const predefinedResources: Resource[] = [
  // PDF paths now relative - will work locally and in Vercel
  {
    id: 'sql-performance',
    title: 'SQL Performance Tuning Guide',
    type: 'pdf',
    url: '/pdf-materials/SQL Performance Tuning.pdf',
    topic: 'SQL',
    description: 'Comprehensive guide to SQL performance optimization'
  },
  {
    id: 'spark-optimization',
    title: 'Spark Optimization Techniques',
    type: 'pdf',
    url: '/pdf-materials/Copy of Spark Optimization Techniques.pdf',
    topic: 'Spark',
    description: 'Best practices for Spark performance optimization'
  },
  {
    id: 'pyspark-optimization',
    title: 'PySpark Optimization Scenario-based Q&A',
    type: 'pdf',
    url: '/pdf-materials/Pyspark optimization scenario based Q&A.pdf',
    topic: 'Spark',
    description: 'Scenario-based interview questions and answers'
  },
  {
    id: 'pyspark-python',
    title: 'PySpark + Python Interview Guide',
    type: 'pdf',
    url: '/pdf-materials/Pyspark+Python.pdf',
    topic: 'Python',
    description: 'Combined PySpark and Python interview preparation'
  },
  {
    id: 'pyspark-coding',
    title: 'PySpark Coding Interview Questions',
    type: 'pdf',
    url: '/pdf-materials/Pyspark Coding Interview.pdf',
    topic: 'Spark',
    description: 'Coding problems for PySpark interviews'
  },
  {
    id: 'top-sql-qa',
    title: 'Top SQL Q&A',
    type: 'pdf',
    url: '/pdf-materials/Top SQL Q&A.pdf',
    topic: 'SQL',
    description: 'Most frequently asked SQL interview questions'
  },
  {
    id: 'databricks-qa',
    title: 'Databricks Interview Q&A',
    type: 'pdf',
    url: '/pdf-materials/Databricks Interview Q&A set.pdf',
    topic: 'Databricks',
    description: 'Databricks specific interview questions'
  },
  {
    id: 'aws-overview',
    title: 'AWS Overview',
    type: 'link',
    url: '/pdf-materials/AWS Overview.pptx',
    topic: 'AWS',
    description: 'AWS services overview presentation'
  },
  {
    id: 'adf-databricks',
    title: 'ADF & Databricks Interview Guide',
    type: 'pdf',
    url: '/pdf-materials/ADF & Databrics interview_.pdf',
    topic: 'Azure',
    description: 'Azure Data Factory and Databricks questions'
  },
  {
    id: 'azure-data-eng',
    title: 'Azure Data Engineer Q&A',
    type: 'pdf',
    url: '/pdf-materials/Azure Data Engineer Q&A.pdf',
    topic: 'Azure',
    description: 'Azure-specific data engineering questions'
  },
  {
    id: 'data-warehouse',
    title: 'Data Warehouse Concepts',
    type: 'pdf',
    url: '/pdf-materials/Data warehouse.pdf',
    topic: 'Data Warehouse',
    description: 'Data warehousing fundamentals and concepts'
  },
  {
    id: 'dsa-interview',
    title: 'DSA Interview Guide',
    type: 'pdf',
    url: '/pdf-materials/DSA interview.pdf',
    topic: 'DSA',
    description: 'Data structures and algorithms interview prep'
  },
  {
    id: 'amazon-de',
    title: 'Amazon Data Engineer Interview',
    type: 'pdf',
    url: '/pdf-materials/Amazon Data Engineer Interview Questions.pdf',
    topic: 'Company',
    description: 'Amazon-specific data engineer interview questions'
  },
  {
    id: 'tcs-de',
    title: 'TCS Data Engineer Interview',
    type: 'pdf',
    url: '/pdf-materials/TCS.pdf',
    topic: 'Company',
    description: 'TCS data engineer interview questions'
  },
  {
    id: 'quick-revision',
    title: 'Quick Revision Strategy',
    type: 'pdf',
    url: '/pdf-materials/Quick Revision Strategy for Data Engineering_.pdf',
    topic: 'General',
    description: 'Quick revision strategy for data engineering'
  },
  {
    id: 'roadmap-2025',
    title: 'Data Engineering Roadmap 2025',
    type: 'pdf',
    url: '/pdf-materials/Data Engineer Roadmap 2025.pdf',
    topic: 'General',
    description: 'Complete data engineering career roadmap'
  }
];

export const companyMaterials = [
  { name: 'Deloitte', file: 'Deloitte.pdf', rounds: ['Round 1', 'Round 2'] },
  { name: 'TCS', file: 'TCS.pdf', rounds: ['Interview'] },
  { name: 'Accenture', file: 'Accenture .pdf', rounds: ['Interview'] },
  { name: 'Capgemini', file: 'Capgemini.pdf', rounds: ['Interview'] },
  { name: 'Coforge', file: 'Coforge (Round1).pdf', rounds: ['Round 1', 'Round 2', 'Round 3'] },
  { name: 'Genpact', file: 'Genpact.pdf', rounds: ['Interview'] },
  { name: 'EXL', file: 'EXL.pdf', rounds: ['Interview'] },
  { name: 'NTT DATA', file: 'NTT DATA.pdf', rounds: ['Interview'] },
  { name: 'Amazon', file: 'Amazon Data Engineer Interview Questions.pdf', rounds: ['Interview'] }
];

export const topics = [
  'SQL',
  'Python',
  'Spark',
  'Kafka',
  'Airflow',
  'AWS',
  'Azure',
  'Databricks',
  'Data Warehouse',
  'ETL',
  'DSA',
  'Git & GitHub',
  'Company',
  'General'
];

export const topicColors: Record<string, string> = {
  'SQL': 'bg-blue-500',
  'Python': 'bg-yellow-500',
  'Spark': 'bg-orange-500',
  'Kafka': 'bg-purple-500',
  'Airflow': 'bg-cyan-500',
  'AWS': 'bg-orange-400',
  'Azure': 'bg-blue-600',
  'Databricks': 'bg-pink-500',
  'Data Warehouse': 'bg-indigo-500',
  'ETL': 'bg-green-500',
  'DSA': 'bg-red-500',
  'Git & GitHub': 'bg-gray-700',
  'Company': 'bg-gray-500',
  'General': 'bg-teal-500'
};
