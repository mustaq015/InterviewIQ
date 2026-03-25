const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const MATERIALS_DIR = "C:\\Users\\User\\InterviewIQ\\pdf-materials";
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'features', 'materials', 'markdown');
const DATA_FILE = path.join(__dirname, '..', 'src', 'features', 'materials', 'markdown-content.ts');

const TOPIC_MAP = {
  'sql': 'SQL',
  'pyspark': 'Spark',
  'spark': 'Spark',
  'python': 'Python',
  'aws': 'AWS',
  'azure': 'Azure',
  'databricks': 'Databricks',
  'kafka': 'Kafka',
  'airflow': 'Airflow',
  'etl': 'ETL',
  'data warehouse': 'Data Warehouse',
  'dsa': 'DSA',
  'interview': 'General',
  'top': 'General',
  'roadmap': 'General',
  'cheat': 'General',
  'concept': 'General',
  'faq': 'General',
  'quick revision': 'General',
  'adf': 'Azure',
  'advanced': 'General',
  'delloite': 'Company',
  'deloi': 'Company',
  'tcs': 'Company',
  'accenture': 'Company',
  'capgemini': 'Company',
  'coforg': 'Company',
  'genpact': 'Company',
  'exl': 'Company',
  'ntt': 'Company',
  'amazon': 'Company',
  'tech mahindra': 'Company',
  'databrick': 'Databricks'
};

function categorizeTopic(filename) {
  const lower = filename.toLowerCase();
  for (const [key, value] of Object.entries(TOPIC_MAP)) {
    if (lower.includes(key)) return value;
  }
  return 'General';
}

function cleanText(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .trim();
}

function textToMarkdown(text, title) {
  const lines = text.split('\n');
  const markdown = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) continue;

    if (line.match(/^Q\d+[\.\):]?\s/i) || line.match(/^\d+\.\s+(What|How|Why|When|Where|Describe|Explain|Tell)/i)) {
      markdown.push(`\n### ${line}\n`);
    } else if (line.match(/^(Answer|Solution|Explanation):/i)) {
      markdown.push(`\n**${line}**\n`);
    } else if (line.match(/^[A-Z][A-Z\s]{2,}$/)) {
      markdown.push(`\n## ${line}\n`);
    } else if (line.match(/^\d+\.\s/) && !line.match(/^Answer/i)) {
      markdown.push(`\n${line}`);
    } else if (line.match(/^[•\-\*]\s/)) {
      markdown.push(line);
    } else {
      markdown.push(line);
    }
  }

  return markdown.join('\n');
}

async function convertPdfToMarkdown(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    const filename = path.basename(pdfPath, '.pdf');
    const topic = categorizeTopic(filename);
    const content = cleanText(data.text);
    const markdown = textToMarkdown(content, filename);

    return {
      id: filename.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: filename.replace(/[_-]/g, ' '),
      topic,
      content: markdown,
      source: pdfPath,
      pages: data.numpages
    };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('Starting PDF to Markdown conversion...\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(MATERIALS_DIR)
    .filter(f => f.toLowerCase().endsWith('.pdf'));

  console.log(`Found ${files.length} PDF files\n`);

  const documents = [];
  const errors = [];

  for (const file of files) {
    const pdfPath = path.join(MATERIALS_DIR, file);
    process.stdout.write(`Converting: ${file}... `);

    const result = await convertPdfToMarkdown(pdfPath);

    if (result && result.content.length > 50) {
      const outputPath = path.join(OUTPUT_DIR, `${result.id}.md`);
      fs.writeFileSync(outputPath, `# ${result.title}\n\n**Topic:** ${result.topic}\n**Pages:** ${result.pages}\n**Source:** ${result.source}\n\n---\n\n${result.content}`);
      documents.push(result);
      console.log(`✓ (${result.topic}, ${result.content.length} chars)`);
    } else {
      errors.push(file);
      console.log(`✗ (empty or failed)`);
    }
  }

  const markdownData = documents.map(doc => ({
    id: doc.id,
    title: doc.title,
    topic: doc.topic,
    source: doc.source,
    pages: doc.pages
  }));

  const contentFile = `// Auto-generated from PDF conversion\n// Run: node scripts/convert-pdfs.cjs\n\nexport interface MarkdownDocument {\n  id: string;\n  title: string;\n  topic: string;\n  source: string;\n  pages: number;\n}\n\nexport const markdownDocuments: MarkdownDocument[] = ${JSON.stringify(markdownData, null, 2)};\n`;

  fs.writeFileSync(DATA_FILE, contentFile);

  console.log('\n' + '='.repeat(50));
  console.log(`Conversion complete!`);
  console.log(`  - Successfully converted: ${documents.length}`);
  console.log(`  - Errors/Failed: ${errors.length}`);
  console.log(`\nMarkdown files saved to: ${OUTPUT_DIR}`);
  console.log(`Data file: ${DATA_FILE}`);

  if (errors.length > 0) {
    console.log('\nFailed files:');
    errors.forEach(f => console.log(`  - ${f}`));
  }
}

main().catch(console.error);
