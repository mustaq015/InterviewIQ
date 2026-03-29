import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Badge } from '../../components/ui';
import { 
  Plus, Pencil, Trash2, X, Copy, Check, Code, FileCode, Sun, Moon,
  Download, Printer, Braces, Sparkles, ChevronDown, Briefcase, GraduationCap,
  Wrench, FileText as FileTextIcon, GripVertical, User, Save, MessageSquare
} from 'lucide-react';
import { useLocalStorage } from '../../hooks';
import type { Profile, Experience, Education } from '../../types';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };
  
  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10" {...attributes} {...listeners}>
        <GripVertical className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
      </div>
      <div className="pl-8">{children}</div>
    </div>
  );
}

interface ITSkill {
  id: string;
  name: string;
  version: string;
  lastUsed: string;
  experience: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  duration: string;
  responsibilities: string[];
}

interface SelfIntro {
  id: string;
  title: string;
  content: string;
  tips: string;
  createdAt: Date;
  updatedAt: Date;
}

type PaperSize = 'A4' | 'Letter' | 'Legal';

const paperSizes: Record<PaperSize, { width: string; height: string; label: string }> = {
  'A4': { width: '210mm', height: '297mm', label: 'A4 (210mm × 297mm)' },
  'Letter': { width: '216mm', height: '279mm', label: 'Letter (216mm × 279mm)' },
  'Legal': { width: '216mm', height: '356mm', label: 'Legal (216mm × 356mm)' },
};

interface SavedResume {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

const defaultProfile: Profile & { 
  itSkills: ITSkill[];
  projects: Project[];
  summary: string;
  currentLocation: string;
  totalExperience: string;
  objective: string;
  languages: string[];
  preferredLocation: string;
  annualSalary: string;
} = {
  name: 'Mustaqahmed Attar',
  email: 'mustaqahmedattar71@gmail.com',
  phone: '+91 9164531384',
  linkedin: 'linkedin.com/in/mustaqahmedattar',
  github: '',
  portfolio: '',
  summary: 'Data Engineer with over 4 years of experience.',
  skills: ['Python', 'PySpark', 'Apache Spark', 'SQL', 'AWS', 'Pandas', 'Apache Airflow', 'Git'],
  experience: [
    { id: '1', company: 'Capgemini Technologies', role: 'Consultant', startDate: 'Apr 2023', endDate: '', current: true, description: 'Working on data engineering projects involving data pipeline automation and data lake orchestration.', location: 'Bangalore, Karnataka' },
    { id: '2', company: 'Company Name', role: 'Role Name', startDate: 'Mar 2022', endDate: 'Mar 2023', current: false, description: '', location: 'Hyderabad, Telangana' },
    { id: '3', company: 'Company Name', role: 'Role Name', startDate: 'Jan 2021', endDate: 'Jan 2022', current: false, description: '', location: 'Bangalore, Karnataka' }
  ],
  education: [
    { id: '1', institution: 'Visvesvaraya Technological University', degree: 'Bachelor of Engineering', field: 'Computer Science', startYear: '2014', endYear: '2018' }
  ],
  certifications: [],
  itSkills: [],
  projects: [
    { 
      id: '1', 
      title: 'Data Pipeline Automation', 
      description: 'Developed an automated data pipeline using Python and AWS services.',
      technologies: ['Python', 'SQL', 'AWS', 'Pandas'],
      duration: 'Jan 2024 - Present',
      responsibilities: ['Design and implement data pipeline architecture', 'Develop ETL scripts and workflows', 'Handle data transformation and cleansing']
    },
    { 
      id: '2', 
      title: 'Automated Data Lake Orchestration', 
      description: 'Implementing a Python-driven AWS Solution for Data Ingestion, Processing, and Querying.',
      technologies: ['Python', 'SQL', 'AWS', 'Pandas'],
      duration: 'Apr 2023 - Present',
      responsibilities: ['Architect and Configure Data Lake Architecture', 'Develop ETL Workflows using AWS Glue', 'Optimize Data Querying with Athena']
    }
  ],
  currentLocation: 'Bangalore, Karnataka',
  preferredLocation: '',
  totalExperience: '4+ years',
  annualSalary: '',
  objective: 'Data Engineer with over 4 years of experience designing and implementing data solutions.',
  languages: ['English', 'Kannada', 'Hindi', 'Marathi'],
};

const getDefaultResumeCode = (profile: typeof defaultProfile) => `# ${profile.name}

## Contact Information
${profile.phone} | ${profile.email} | ${profile.currentLocation} | ${profile.linkedin}

## Objective
${profile.objective || profile.summary}

## Education
**${profile.education[0]?.degree || ''}** - ${profile.education[0]?.institution || ''}
${profile.education[0]?.startYear || ''} - ${profile.education[0]?.endYear || ''}

## Experience
${profile.experience.map(exp => `
### ${exp.role} | ${exp.company}
**${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}**${exp.location ? ` | ${exp.location}` : ''}

${exp.description}
`).join('\n')}

## Projects
${profile.projects.slice(0, 2).map(proj => `
### ${proj.title}
**${proj.duration}** | Technologies: ${proj.technologies.join(', ')}

${proj.description}

**Roles & Responsibilities:**
${proj.responsibilities?.map(r => `- ${r}`).join('\n') || ''}
`).join('\n')}

## Skills
- **Programming:** ${profile.skills.filter(s => ['Python', 'SQL', 'Scala', 'Java'].includes(s)).join(', ') || 'Python, SQL'}
- **Big Data:** ${profile.skills.filter(s => ['PySpark', 'Apache Spark', 'Kafka', 'Flink'].includes(s)).join(', ') || 'PySpark, Apache Spark'}
- **Cloud:** ${profile.skills.filter(s => ['AWS', 'Azure', 'GCP'].includes(s)).join(', ') || 'AWS'}
- **ETL:** ${profile.skills.filter(s => ['Apache Airflow', 'Dagster'].includes(s)).join(', ') || 'Apache Airflow'}

## Languages
${profile.languages?.join(', ') || 'English, Kannada, Hindi, Marathi'}
`;

export function Profile() {
  const [profile, setProfile] = useLocalStorage<typeof defaultProfile>('user-profile', defaultProfile);
  const [resumeCode, setResumeCode] = useLocalStorage('resume-code', getDefaultResumeCode(defaultProfile));
  const [savedResumes, setSavedResumes] = useLocalStorage<SavedResume[]>('saved-resumes', []);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [showResumeMenu, setShowResumeMenu] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newResumeName, setNewResumeName] = useState('');
  const [activeSection, setActiveSection] = useState<'editor' | 'preview' | 'experience' | 'education' | 'skills' | 'projects' | 'self-intro'>('editor');
  const [editorTheme, setEditorTheme] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState(false);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [paperSize, setPaperSize] = useState<PaperSize>('A4');
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [selfIntros, setSelfIntros] = useLocalStorage<SelfIntro[]>('self-introductions', []);
  const [isIntroDialogOpen, setIsIntroDialogOpen] = useState(false);
  const [editingIntro, setEditingIntro] = useState<SelfIntro | null>(null);
  const [introForm, setIntroForm] = useState({ title: '', content: '', tips: '' });
  const [viewingIntro, setViewingIntro] = useState<SelfIntro | null>(null);
  const [copiedIntro, setCopiedIntro] = useState(false);

  useEffect(() => {
    setResumeCode(getDefaultResumeCode(profile));
  }, [profile.experience, profile.education, profile.skills, profile.projects, profile.name, profile.email, profile.phone, profile.currentLocation, profile.linkedin, profile.objective, profile.languages, profile.summary]);

  const handleSaveIntro = () => {
    if (!introForm.title.trim()) return;
    if (editingIntro) {
      setSelfIntros(selfIntros.map(i => 
        i.id === editingIntro.id 
          ? { ...i, title: introForm.title, content: introForm.content, tips: introForm.tips, updatedAt: new Date() }
          : i
      ));
    } else {
      const newIntro: SelfIntro = {
        id: `self-intro-${Date.now()}`,
        title: introForm.title,
        content: introForm.content,
        tips: introForm.tips,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setSelfIntros([newIntro, ...selfIntros]);
    }
    setIsIntroDialogOpen(false);
    setEditingIntro(null);
    setIntroForm({ title: '', content: '', tips: '' });
  };

  const handleDeleteIntro = (id: string) => {
    if (confirm('Delete this self-introduction?')) {
      setSelfIntros(selfIntros.filter(i => i.id !== id));
    }
  };

  const handleCopyIntro = (intro: SelfIntro) => {
    navigator.clipboard.writeText(intro.content);
    setCopiedIntro(true);
    setTimeout(() => setCopiedIntro(false), 2000);
  };

  const openEditIntro = (intro: SelfIntro) => {
    setEditingIntro(intro);
    setIntroForm({ title: intro.title, content: intro.content, tips: intro.tips || '' });
    setIsIntroDialogOpen(true);
  };

  const openNewIntro = () => {
    setEditingIntro(null);
    setIntroForm({ title: '', content: '', tips: '' });
    setIsIntroDialogOpen(true);
  };

  const saveCurrentResume = (name: string) => {
    const newResume: SavedResume = {
      id: Date.now().toString(),
      name,
      code: resumeCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSavedResumes([...savedResumes, newResume]);
    setCurrentResumeId(newResume.id);
    setShowSaveDialog(false);
    setNewResumeName('');
  };

  const loadResume = (id: string) => {
    const resume = savedResumes.find(r => r.id === id);
    if (resume) {
      setResumeCode(resume.code);
      setCurrentResumeId(resume.id);
    }
    setShowResumeMenu(false);
  };

  const deleteResume = (id: string) => {
    if (confirm('Delete this resume?')) {
      setSavedResumes(savedResumes.filter(r => r.id !== id));
      if (currentResumeId === id) {
        setCurrentResumeId(null);
      }
    }
  };

  const parseLatex = (code: string) => {
    // Pre-process: Extract key content first
    let processedCode = code;
    
    // Extract \name{...} for header
    const nameMatch = code.match(/\\name\{([^}]*)\}/);
    const personName = nameMatch ? nameMatch[1].trim() : '';
    
    // Extract \address{...} content (multiline)
    const addressMatch = code.match(/\\address\{([\s\S]*?)\}(?=\\address|\\begin|$)/);
    const addressContent = addressMatch ? addressMatch[1].replace(/\\(href|textit)\{[^}]*\}\{([^}]*)\}/g, '$2').replace(/\\\\/g, ' | ').replace(/\\/g, '').trim() : '';

    // Pre-process: Remove document structure commands
    processedCode = processedCode
      .replace(/\\documentclass\{[^}]*\}/g, '')
      .replace(/\\usepackage(\[[^\]]*\])?\{[^}]*\}/g, '')
      .replace(/\\begin\{document\}/g, '')
      .replace(/\\end\{document\}/g, '')
      .replace(/\\maketitle/g, '')
      .replace(/\\name\{[^}]*\}/g, '')
      .replace(/\\address\{[\s\S]*?\}(?=\\address|\\begin|$)/g, '')
      .replace(/\\newpage/g, '')
      .replace(/\\newlist\{[^}]*\}/g, '')
      .replace(/\\setlist\{[^}]*\}/g, '')
      .replace(/\\setlength\{[^}]*\}\{[^}]*\}/g, '')
      .replace(/\\usenotestyle\{[^}]*\}/g, '')
      .replace(/\\hline/g, '')
      .replace(/\\centering/g, '')
      .replace(/\\raggedright/g, '')
      .replace(/\\raggedleft/g, '')
      .replace(/\\noindent/g, '')
      .replace(/\\hfill/g, ' ')
      .replace(/\\tab\b/g, ' ')
      .replace(/\\itab\b/g, ' ')
      .replace(/\\nbsp/g, ' ');

    // Remove custom \newcommand definitions
    processedCode = processedCode.replace(/\\newcommand\{\\[\w]+\}\[[^\]]*\]\{[^}]*\}/g, '');
    processedCode = processedCode.replace(/\\newcommand\{\\[\w]+\}\{[^}]*\}/g, '');

    // Remove \rSection{...} and extract section title
    const rSectionPattern = /\\begin\{rSection\}\{([^}]*)\}([\s\S]*?)\\end\{rSection\}/g;
    const sections: { title: string; content: string }[] = [];
    let match;
    while ((match = rSectionPattern.exec(processedCode)) !== null) {
      sections.push({
        title: match[1].trim(),
        content: match[2]
      });
    }
    processedCode = processedCode.replace(rSectionPattern, '');

    // Remove all other \begin{...} and \end{...} blocks
    processedCode = processedCode.replace(/\\begin\{[^}]*\}/g, '');
    processedCode = processedCode.replace(/\\end\{[^}]*\}/g, '');

    // Remove remaining commands with {...} patterns (but keep href content)
    processedCode = processedCode
      .replace(/\\href\{[^}]*\}\{([^}]*)\}/g, '$2') // Keep href visible text
      .replace(/\\textbf\{([^}]*)\}/g, '**$1**') // Convert to markdown bold
      .replace(/\\textit\{([^}]*)\}/g, '*$1*') // Convert to markdown italic
      .replace(/\\underline\{([^}]*)\}/g, '$1') // Keep underline text
      .replace(/\\textsf\{([^}]*)\}/g, '$1') // Keep text
      .replace(/\\texttt\{([^}]*)\}/g, '$1') // Keep text
      .replace(/\\url\{([^}]*)\}/g, '$1') // Keep URL text
      .replace(/\\section\*?\{([^}]*)\}/g, '## $1') // Convert to markdown
      .replace(/\\subsection\*?\{([^}]*)\}/g, '### $1') // Convert to markdown
      .replace(/\\subsubsection\*?\{([^}]*)\}/g, '#### $1') // Convert to markdown
      .replace(/\\item\s*/g, '- ') // Convert itemize to markdown
      .replace(/\\item\*/g, '- ')
      .replace(/\\paragraph\*?\{([^}]*)\}/g, '**$1**') // Convert to bold
      .replace(/\\position\{([^}]*)\}/g, '$1')
      .replace(/\\date\{([^}]*)\}/g, '')
      .replace(/\\mobile\{([^}]*)\}/g, '')
      .replace(/\\email\{([^}]*)\}/g, '')
      .replace(/\\github\{([^}]*)\}/g, '$1')
      .replace(/\\linkedin\{([^}]*)\}/g, '$1')
      .replace(/\\twitter\{([^}]*)\}/g, '')
      .replace(/\\tagline\{([^}]*)\}/g, '')
      .replace(/\\雇主\{([^}]*)\}/g, '')
      .replace(/\\雇主\{([^}]*)\}/g, '');

    // Remove remaining LaTeX commands with braces
    processedCode = processedCode.replace(/\\[\w]+\{[^}]*\}/g, '');
    processedCode = processedCode.replace(/\\[\w]+\[[^\]]*\]\{[^}]*\}/g, '');

    // Remove remaining LaTeX commands
    const commandsToRemove = [
      'section', 'subsection', 'subsubsection', 'paragraph', 'subparagraph',
      'textbf', 'textit', 'underline', 'textsf', 'texttt', 'emph',
      'href', 'url', 'vspace', 'hspace', 'newline', 'par',
      'item', 'caption', 'label', 'ref', 'input', 'include',
      'centering', 'raggedright', 'raggedleft', 'small', 'normalsize',
      'large', 'Large', 'huge', 'Huge', 'footnote', 'thanks',
      'setlength', 'addtolength', 'setstretch',
      'textbf', 'textit', 'bfseries', 'itshape', 'scshape', 'ttfamily',
      '雇主', '雇主', '雇主', '雇主', '雇主', '雇主', '雇主', '雇主',
      'mobile', 'email', 'github', 'linkedin', 'twitter', 'date', 'tagline'
    ];
    
    commandsToRemove.forEach(cmd => {
      processedCode = processedCode.replace(new RegExp(`\\\\${cmd}\\b`, 'g'), '');
    });

    // Handle comments
    const lines: string[] = [];
    processedCode.split('\n').forEach(line => {
      const commentIndex = line.indexOf('%');
      if (commentIndex !== -1) {
        const beforePercent = line.substring(0, commentIndex);
        if (!beforePercent.endsWith('\\')) {
          lines.push(line.substring(0, commentIndex));
          return;
        }
      }
      lines.push(line);
    });

    const content: React.ReactNode[] = [];

    // Add header with name
    if (personName) {
      content.push(
        <h1 key="header" className="text-2xl font-bold uppercase tracking-wide text-center mb-4 pb-3 border-b-2 border-gray-400">
          {personName}
        </h1>
      );
    }

    // Add address info
    if (addressContent) {
      content.push(
        <p key="address" className="text-xs text-center text-gray-600 mb-6">
          {addressContent}
        </p>
      );
    }

    // Render each rSection
    sections.forEach((section, sectionIdx) => {
      const sectionLines = section.content.split('\n').filter(l => l.trim());
      
      // Section header
      content.push(
        <h2 key={`section-${sectionIdx}`} className="text-base font-bold uppercase tracking-wide mt-6 mb-3 pb-2 border-b border-gray-400 bg-gray-100 px-3 py-2">
          {section.title}
        </h2>
      );

      // Section content
      sectionLines.forEach((line, lineIdx) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        // Handle markdown bold at start
        if (trimmedLine.startsWith('**')) {
          const boldMatch = trimmedLine.match(/^\*\*(.+?)\*\*(.*)$/);
          if (boldMatch) {
            content.push(
              <p key={`p-${sectionIdx}-${lineIdx}`} className="text-xs my-1.5">
                <strong className="font-semibold">{boldMatch[1]}</strong>
                {boldMatch[2] && <span className="text-gray-700">{boldMatch[2]}</span>}
              </p>
            );
            return;
          }
        }

        // Handle markdown headers
        if (trimmedLine.startsWith('#### ')) {
          content.push(
            <h4 key={`h4-${sectionIdx}-${lineIdx}`} className="text-xs font-semibold mt-3 mb-1 text-gray-800">
              {trimmedLine.replace('#### ', '')}
            </h4>
          );
          return;
        }

        if (trimmedLine.startsWith('### ')) {
          content.push(
            <h3 key={`h3-${sectionIdx}-${lineIdx}`} className="text-sm font-semibold mt-4 mb-2 text-gray-800">
              {trimmedLine.replace('### ', '')}
            </h3>
          );
          return;
        }

        if (trimmedLine.startsWith('## ')) {
          content.push(
            <h2 key={`h2-${sectionIdx}-${lineIdx}`} className="text-sm font-semibold mt-4 mb-2 text-gray-800">
              {trimmedLine.replace('## ', '')}
            </h2>
          );
          return;
        }

        // Handle list items
        if (trimmedLine.startsWith('- ')) {
          const itemText = trimmedLine.substring(2);
          content.push(
            <li key={`li-${sectionIdx}-${lineIdx}`} className="text-xs my-1 ml-4 list-disc text-gray-700">
              {renderLatexInline(itemText)}
            </li>
          );
          return;
        }

        // Handle regular paragraphs
        const cleanLine = trimmedLine
          .replace(/\*\*(.+?)\*\*/g, '$1') // Remove markdown bold markers
          .replace(/\*(.+?)\*/g, '$1') // Remove markdown italic markers
          .replace(/\\\\/g, ' ') // Handle line breaks
          .replace(/\\+/g, ''); // Remove remaining backslashes

        if (cleanLine.trim()) {
          content.push(
            <p key={`p-${sectionIdx}-${lineIdx}`} className="text-xs my-1.5 text-gray-700">
              {cleanLine}
            </p>
          );
        }
      });
    });

    // Render remaining content not in rSection
    let currentSection: React.ReactNode[] = [];
    let sectionTitle: React.ReactNode = null;
    let sectionKey = 0;
    let isFirstLine = true;

    const flushSection = () => {
      if (currentSection.length > 0 || sectionTitle) {
        content.push(
          <div key={`section-${sectionKey}`} className="mb-4">
            {sectionTitle}
            {currentSection.length > 0 && (
              <div className="mt-2">
                {currentSection}
              </div>
            )}
          </div>
        );
        currentSection = [];
        sectionTitle = null;
        sectionKey++;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      if (trimmedLine === '') {
        isFirstLine = false;
        continue;
      }

      if (trimmedLine.match(/^\\[\w]+$/)) {
        isFirstLine = false;
        continue;
      }

      if (isFirstLine && trimmedLine.startsWith('# ')) {
        content.push(
          <h1 key={`header-${i}`} className="text-2xl font-bold uppercase tracking-wide text-center mb-6 pb-3 border-b-2 border-gray-400">
            {trimmedLine.replace('# ', '')}
          </h1>
        );
        isFirstLine = false;
      } else if (trimmedLine.startsWith('## ')) {
        flushSection();
        sectionTitle = (
          <h2 key={`title-${sectionKey}`} className="text-base font-bold uppercase tracking-wide mt-6 mb-3 pb-2 border-b border-gray-400 bg-gray-100 px-3 py-2 -mx-3">
            {trimmedLine.replace('## ', '')}
          </h2>
        );
        isFirstLine = false;
      } else if (trimmedLine.startsWith('### ')) {
        currentSection.push(
          <h3 key={`h3-${sectionKey}-${currentSection.length}`} className="text-sm font-semibold mt-4 mb-2 text-gray-800">
            {trimmedLine.replace('### ', '')}
          </h3>
        );
        isFirstLine = false;
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        currentSection.push(
          <li key={`li-${sectionKey}-${currentSection.length}`} className="text-xs my-1.5 ml-4 list-disc text-gray-700">
            {renderLatexInline(trimmedLine.substring(2))}
          </li>
        );
        isFirstLine = false;
      } else {
        currentSection.push(
          <p key={`p-${sectionKey}-${currentSection.length}`} className="text-xs my-1.5 whitespace-pre-wrap text-gray-700">
            {renderLatexInline(trimmedLine)}
          </p>
        );
        isFirstLine = false;
      }
    }

    flushSection();
    return content;
  };

  const renderLatexInline = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      const inlineMathMatch = remaining.match(/^\$([^$\n]+?)\$/);
      if (inlineMathMatch) {
        try {
          const html = katex.renderToString(inlineMathMatch[1], {
            throwOnError: false,
            displayMode: false
          });
          parts.push(<span key={key++} className="katex-inline" dangerouslySetInnerHTML={{ __html: html }} />);
        } catch {
          parts.push(<span key={key++}>{inlineMathMatch[0]}</span>);
        }
        remaining = remaining.slice(inlineMathMatch[0].length);
        continue;
      }

      const displayMathMatch = remaining.match(/^\$\$([^$]+?)\$\$/);
      if (displayMathMatch) {
        try {
          const html = katex.renderToString(displayMathMatch[1], {
            throwOnError: false,
            displayMode: true
          });
          parts.push(<span key={key++} className="katex-display" dangerouslySetInnerHTML={{ __html: html }} />);
        } catch {
          parts.push(<span key={key++}>{displayMathMatch[0]}</span>);
        }
        remaining = remaining.slice(displayMathMatch[0].length);
        continue;
      }

      const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
      if (boldMatch) {
        parts.push(<strong key={key++} className="font-semibold">{boldMatch[1]}</strong>);
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      const italicMatch = remaining.match(/^\*(.+?)\*/);
      if (italicMatch && !remaining.startsWith('**')) {
        parts.push(<em key={key++}>{italicMatch[1]}</em>);
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      const nextSpecial = remaining.search(/(\$|\*)/);
      if (nextSpecial === -1) {
        const cleanText = remaining
          .replace(/\\[\w]+\{[^}]*\}/g, '')
          .replace(/\\[\w]+\[[^\]]*\]\{[^}]*\}/g, '')
          .replace(/\\[\w]+/g, '')
          .replace(/\\\w+$/g, '');
        if (cleanText) parts.push(<span key={key++}>{cleanText}</span>);
        break;
      } else if (nextSpecial === 0) {
        parts.push(<span key={key++}>{remaining[0]}</span>);
        remaining = remaining.slice(1);
      } else {
        const cleanText = remaining.slice(0, nextSpecial)
          .replace(/\\[\w]+\{[^}]*\}/g, '')
          .replace(/\\[\w]+\[[^\]]*\]\{[^}]*\}/g, '')
          .replace(/\\[\w]+/g, '')
          .replace(/\\\w+$/g, '');
        if (cleanText) parts.push(<span key={key++}>{cleanText}</span>);
        remaining = remaining.slice(nextSpecial);
      }
    }

    return parts;
  };

  const renderPreview = () => {
    const parsed = parseLatex(resumeCode);
    const size = paperSizes[paperSize];
    
    if (!resumeCode.trim()) {
      return (
        <div 
          ref={previewRef}
          className="bg-white mx-auto my-4 shadow-lg"
          style={{ 
            fontFamily: 'Arial, sans-serif', 
            fontSize: '11px', 
            lineHeight: '1.5',
            padding: '24px',
            width: size.width,
            minHeight: size.height
          }}
        >
          <p className="text-gray-500 text-center">Start typing LaTeX code to see preview...</p>
        </div>
      );
    }
    return (
      <div 
        ref={previewRef}
        className="bg-white mx-auto my-4 shadow-lg"
        style={{ 
          fontFamily: 'Arial, sans-serif', 
          fontSize: '11px', 
          lineHeight: '1.5',
          padding: '24px',
          width: size.width,
          minHeight: size.height
        }}
      >
        {parsed.length > 0 ? parsed : <p className="text-gray-500">No content to preview</p>}
      </div>
    );
  };

  const handlePrint = (size: PaperSize = 'A4') => {
    const printWindow = window.open('', '_blank');
    const sizeInfo = paperSizes[size];
    if (printWindow) {
      printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${profile.name} - Resume</title>
  <style>
    @page { size: ${sizeInfo.width} ${sizeInfo.height}; margin: 10mm; }
    body { 
      font-family: Arial, sans-serif; 
      font-size: 11px; 
      line-height: 1.5; 
      padding: 20px; 
      max-width: ${sizeInfo.width}; 
      margin: 0 auto;
    }
    h1 { font-size: 18px; text-align: center; text-transform: uppercase; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #ccc; }
    h2 { font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 2px; margin: 12px 0 6px; background: #f5f5f5; padding: 4px 8px; }
    h3 { font-size: 11px; font-weight: bold; margin: 10px 0 4px; }
    p { margin: 4px 0; }
    li { margin-left: 16px; }
    strong { font-weight: bold; }
  </style>
</head>
<body>${previewRef.current?.innerHTML || ''}</body>
</html>`);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  const handleSaveAs = (format: string, size: PaperSize = 'A4') => {
    setShowSaveMenu(false);
    const sizeInfo = paperSizes[size];
    
    if (format === 'pdf') { 
      handlePrint(size); 
      return; 
    }
    
    let content = '';
    let filename = `${profile.name.replace(/\s+/g, '_')}_Resume`;
    let mimeType = 'text/plain';

    switch (format) {
      case 'txt': 
        content = resumeCode; 
        filename += '.txt'; 
        break;
      case 'html':
        content = `<!DOCTYPE html>
<html>
<head>
  <title>${profile.name} - Resume</title>
  <style>
    @page { size: ${sizeInfo.width} ${sizeInfo.height}; margin: 10mm; }
    body { font-family: Arial, sans-serif; font-size: 11px; line-height: 1.5; padding: 20px; max-width: ${sizeInfo.width}; margin: 0 auto; }
    h1 { font-size: 18px; text-align: center; text-transform: uppercase; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #ccc; }
    h2 { font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 2px; margin: 12px 0 6px; background: #f5f5f5; padding: 4px 8px; }
    h3 { font-size: 11px; font-weight: bold; margin: 10px 0 4px; }
    li { margin-left: 16px; }
  </style>
</head>
<body>${previewRef.current?.innerHTML || ''}</body>
</html>`;
        filename += '.html'; 
        mimeType = 'text/html'; 
        break;
      case 'md': 
        content = resumeCode; 
        filename += '.md'; 
        break;
      case 'json':
        content = JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          location: profile.currentLocation,
          linkedin: profile.linkedin,
          objective: profile.objective,
          education: profile.education,
          experience: profile.experience,
          projects: profile.projects,
          skills: profile.skills,
          languages: profile.languages
        }, null, 2);
        filename += '.json';
        mimeType = 'application/json';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyResume = () => {
    navigator.clipboard.writeText(resumeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const syncFromProfile = () => {
    setResumeCode(getDefaultResumeCode(profile));
  };

  const sections = [
    { key: 'editor' as const, label: 'Editor', icon: <Braces className="h-4 w-4" /> },
    { key: 'preview' as const, label: 'Preview', icon: <FileTextIcon className="h-4 w-4" /> },
    { key: 'experience' as const, label: 'Experience', icon: <Briefcase className="h-4 w-4" /> },
    { key: 'education' as const, label: 'Education', icon: <GraduationCap className="h-4 w-4" /> },
    { key: 'skills' as const, label: 'Skills', icon: <Wrench className="h-4 w-4" /> },
    { key: 'projects' as const, label: 'Projects', icon: <FileTextIcon className="h-4 w-4" /> },
    { key: 'self-intro' as const, label: 'Self Intro', icon: <MessageSquare className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Resume Builder</h2>
        <div className="flex gap-2">
          {/* Saved Resumes Dropdown */}
          <div className="relative">
            <Button variant="outline" onClick={() => setShowResumeMenu(!showResumeMenu)}>
              <FileTextIcon className="mr-2 h-4 w-4" />
              My Resumes ({savedResumes.length})
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            {showResumeMenu && (
              <div className="absolute left-0 top-full mt-1 bg-background border rounded-lg shadow-lg z-50 min-w-[250px]">
                <div className="p-2 border-b">
                  <Button size="sm" className="w-full" onClick={() => { setShowSaveDialog(true); setShowResumeMenu(false); }}>
                    <Plus className="h-4 w-4 mr-1" /> Save Current Resume
                  </Button>
                </div>
                {savedResumes.length === 0 ? (
                  <p className="p-4 text-sm text-muted-foreground text-center">No saved resumes yet</p>
                ) : (
                  <div className="max-h-[300px] overflow-auto">
                    {savedResumes.map(resume => (
                      <div key={resume.id} className={`flex items-center justify-between p-2 hover:bg-muted ${currentResumeId === resume.id ? 'bg-primary/10' : ''}`}>
                        <button 
                          className="flex-1 text-left text-sm truncate"
                          onClick={() => loadResume(resume.id)}
                        >
                          <span className="font-medium">{resume.name}</span>
                          <span className="block text-xs text-muted-foreground">
                            {new Date(resume.updatedAt).toLocaleDateString()}
                          </span>
                        </button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-destructive"
                          onClick={(e) => { e.stopPropagation(); deleteResume(resume.id); }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <Button variant="outline" onClick={copyResume}>
            {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy LaTeX'}
          </Button>
          <Button variant="outline" onClick={syncFromProfile}>
            <Sparkles className="mr-2 h-4 w-4" />
            Sync LaTeX
          </Button>
          <div className="relative">
            <Button variant="outline" onClick={() => setShowSaveMenu(!showSaveMenu)}>
              <Download className="mr-2 h-4 w-4" />
              Save As
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            {showSaveMenu && (
              <div className="absolute right-0 top-full mt-1 bg-background border rounded-lg shadow-lg z-50 min-w-[200px]">
                <div className="p-2 border-b">
                  <p className="text-xs font-medium text-muted-foreground px-2">Paper Size</p>
                  <div className="flex gap-1 mt-1">
                    {(Object.keys(paperSizes) as PaperSize[]).map(size => (
                      <button
                        key={size}
                        onClick={() => setPaperSize(size)}
                        className={`px-2 py-1 text-xs rounded ${paperSize === size ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 text-sm" onClick={() => handleSaveAs('pdf', paperSize)}>
                  <Printer className="h-4 w-4" /> PDF ({paperSize})
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 text-sm" onClick={() => handleSaveAs('html', paperSize)}>
                  <Code className="h-4 w-4" /> HTML ({paperSize})
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 text-sm" onClick={() => handleSaveAs('md', paperSize)}>
                  <Braces className="h-4 w-4" /> Markdown
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 text-sm" onClick={() => handleSaveAs('txt', paperSize)}>
                  <FileTextIcon className="h-4 w-4" /> Text
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 text-sm" onClick={() => handleSaveAs('json', paperSize)}>
                  <Braces className="h-4 w-4" /> JSON
                </button>
                <div className="border-t my-1" />
                <button className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 text-sm" onClick={() => { setShowSaveMenu(false); handlePrint(paperSize); }}>
                  <Printer className="h-4 w-4" /> Print ({paperSize})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Resume Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Resume</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Resume Name</label>
              <Input 
                value={newResumeName} 
                onChange={(e) => setNewResumeName(e.target.value)} 
                placeholder="e.g., Software Developer Resume, Tech Lead Resume"
                onKeyDown={(e) => e.key === 'Enter' && newResumeName.trim() && saveCurrentResume(newResumeName.trim())}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>Cancel</Button>
            <Button onClick={() => newResumeName.trim() && saveCurrentResume(newResumeName.trim())} disabled={!newResumeName.trim()}>
              Save Resume
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Self Introduction Dialog */}
      <Dialog open={isIntroDialogOpen} onOpenChange={(open) => { if (!open) { setIsIntroDialogOpen(false); setEditingIntro(null); setIntroForm({ title: '', content: '', tips: '' }); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingIntro ? 'Edit Self Introduction' : 'Create Self Introduction'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={introForm.title}
                onChange={(e) => setIntroForm({ ...introForm, title: e.target.value })}
                placeholder="e.g., 2-Minute Elevator Pitch, Technical Round Intro"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={introForm.content}
                onChange={(e) => setIntroForm({ ...introForm, content: e.target.value })}
                placeholder="Write your self-introduction content here..."
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tips (optional)</label>
              <Textarea
                value={introForm.tips}
                onChange={(e) => setIntroForm({ ...introForm, tips: e.target.value })}
                placeholder="Add key points or tips to remember...&#10;&#10;e.g.:&#10;- Mention years of experience&#10;- Highlight current project&#10;- Mention specific technologies"
                className="min-h-[100px] text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsIntroDialogOpen(false); setEditingIntro(null); setIntroForm({ title: '', content: '', tips: '' }); }}>
              Cancel
            </Button>
            <Button onClick={handleSaveIntro} disabled={!introForm.title.trim()}>
              <Save className="mr-2 h-4 w-4" />
              {editingIntro ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Navigation Tabs */}
      <Card>
        <CardContent className="p-2">
          <div className="flex flex-wrap gap-1">
            {sections.map(section => (
              <button key={section.key} onClick={() => setActiveSection(section.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === section.key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                {section.icon}
                {section.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className={activeSection === 'editor' ? 'grid lg:grid-cols-2 gap-4' : ''}>
        {/* Editor - Side by Side Preview and Code */}
        {activeSection === 'editor' && (
          <>
            {/* Live Preview - Left Pane */}
            <Card className="overflow-hidden h-[calc(100vh-220px)]">
              <CardHeader className="py-3 bg-muted/50 border-b">
                <CardTitle className="text-lg">Live Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-52px)] overflow-auto" style={{ backgroundColor: '#f5f5f5' }}>
                {renderPreview()}
              </CardContent>
            </Card>

            {/* LaTeX Editor Panel - Right Pane */}
            <Card className="overflow-hidden h-[calc(100vh-220px)]">
              <CardHeader className="py-3 bg-muted/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileCode className="h-5 w-5" />
                    LaTeX Editor
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setEditorTheme(editorTheme === 'light' ? 'dark' : 'light')}>
                    {editorTheme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-60px)]">
                <textarea
                  ref={editorRef}
                  value={resumeCode}
                  onChange={(e) => setResumeCode(e.target.value)}
                  className={`w-full h-full p-4 font-mono text-sm resize-none focus:outline-none ${editorTheme === 'dark' ? 'bg-slate-900 text-green-400' : 'bg-slate-50 text-slate-800'}`}
                  placeholder="# Your Name&#10;&#10;## Contact&#10;email@example.com | phone&#10;&#10;## Experience&#10;### Job Title | Company&#10;**Jan 2020 - Present**&#10;&#10;- Description&#10;&#10;## Skills&#10;- **Python**, SQL, AWS&#10;&#10;## Education&#10;**BE** - University Name (2018-2022)"
                  spellCheck={false}
                  style={{ lineHeight: '1.6' }}
                />
              </CardContent>
            </Card>
          </>
        )}

        {/* Experience Manager - Full Width */}
        {activeSection === 'experience' && (
          <Card className="h-[calc(100vh-220px)] overflow-hidden">
            <ExperienceManager profile={profile} setProfile={setProfile} />
          </Card>
        )}

        {/* Education Manager - Full Width */}
        {activeSection === 'education' && (
          <Card className="h-[calc(100vh-220px)] overflow-hidden">
            <EducationManager profile={profile} setProfile={setProfile} />
          </Card>
        )}

        {/* Skills Manager - Full Width */}
        {activeSection === 'skills' && (
          <Card className="h-[calc(100vh-220px)] overflow-hidden">
            <SkillsManager profile={profile} setProfile={setProfile} />
          </Card>
        )}

        {/* Projects Manager - Full Width */}
        {activeSection === 'projects' && (
          <Card className="h-[calc(100vh-220px)] overflow-hidden">
            <ProjectsManager profile={profile} setProfile={setProfile} />
          </Card>
        )}

        {/* Self Introduction Manager */}
        {activeSection === 'self-intro' && (
          <Card className="h-[calc(100vh-220px)] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between py-4 border-b bg-muted/30">
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Self Introductions
              </CardTitle>
              <Button size="sm" onClick={openNewIntro}>
                <Plus className="h-4 w-4 mr-1" /> Add File
              </Button>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)] overflow-auto p-6">
              {selfIntros.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No files added yet</p>
                  <p className="text-sm mt-1">Add your self-introduction files with tips</p>
                  <Button variant="outline" size="sm" onClick={openNewIntro} className="mt-4">
                    <Plus className="h-4 w-4 mr-1" /> Add Your First File
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {selfIntros.map((intro) => (
                    <div key={intro.id} className="p-4 rounded-lg bg-muted relative hover:bg-muted/80 transition-colors border">
                      <div className="absolute top-4 right-4 flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopyIntro(intro)} title="Copy">
                          {copiedIntro && viewingIntro?.id === intro.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditIntro(intro)} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteIntro(intro.id)} title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <h3 className="font-semibold text-lg pr-20">{intro.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated: {new Date(intro.updatedAt).toLocaleDateString()}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setViewingIntro(viewingIntro?.id === intro.id ? null : intro)}>
                          {viewingIntro?.id === intro.id ? 'Hide' : 'View'}
                        </Button>
                        {intro.tips && (
                          <Badge variant="secondary" className="text-xs">
                            Tips available
                          </Badge>
                        )}
                      </div>
                      {viewingIntro?.id === intro.id && (
                        <div className="mt-3 space-y-3">
                          <div className="p-3 bg-background rounded-md border text-sm whitespace-pre-wrap max-h-[200px] overflow-auto">
                            {intro.content}
                          </div>
                          {intro.tips && (
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                              <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 mb-1">Tips:</p>
                              <p className="text-sm whitespace-pre-wrap">{intro.tips}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Full Preview - Same size as other tabs */}
        {activeSection === 'preview' && (
          <Card className="h-[calc(100vh-220px)] overflow-hidden">
            <CardHeader className="py-3 bg-muted/50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileTextIcon className="h-5 w-5" />
                  Full Resume Preview
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Button variant="outline" size="sm" onClick={() => setShowSizeMenu(!showSizeMenu)}>
                      Paper: {paperSize}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                    {showSizeMenu && (
                      <div className="absolute right-0 top-full mt-1 bg-background border rounded-lg shadow-lg z-50 min-w-[180px]">
                        {(Object.keys(paperSizes) as PaperSize[]).map(size => (
                          <button
                            key={size}
                            onClick={() => { setPaperSize(size); setShowSizeMenu(false); }}
                            className={`w-full px-4 py-2 text-left hover:bg-muted text-sm ${paperSize === size ? 'bg-primary text-primary-foreground' : ''}`}
                          >
                            {paperSizes[size].label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button variant="outline" onClick={() => handlePrint(paperSize)}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-60px)] overflow-auto p-8 bg-gray-100">
              {renderPreview()}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ExperienceManager({ profile, setProfile }: { profile: typeof defaultProfile; setProfile: (updater: (prev: typeof defaultProfile) => typeof defaultProfile) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [form, setForm] = useState({ company: '', role: '', startDate: '', endDate: '', current: false, description: '', location: '' });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = profile.experience.findIndex(e => e.id === active.id);
      const newIndex = profile.experience.findIndex(e => e.id === over.id);
      setProfile(p => ({ ...p, experience: arrayMove(p.experience, oldIndex, newIndex) as Experience[] }));
    }
  };

  const openAdd = () => { setForm({ company: '', role: '', startDate: '', endDate: '', current: false, description: '', location: '' }); setEditingIdx(null); setIsOpen(true); };
  const openEdit = (idx: number) => { const exp = profile.experience[idx]; setForm({ company: exp.company, role: exp.role, startDate: exp.startDate, endDate: exp.endDate, current: exp.current, description: exp.description, location: exp.location || '' }); setEditingIdx(idx); setIsOpen(true); };
  const save = () => {
    if (editingIdx !== null) {
      setProfile((p) => ({ ...p, experience: p.experience.map((e, i) => i === editingIdx ? { ...e, ...form } : e) as Experience[] }));
    } else {
      setProfile((p) => ({ ...p, experience: [...p.experience, { id: Date.now().toString(), ...form }] as Experience[] }));
    }
    setIsOpen(false);
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between py-4 border-b bg-muted/30">
        <CardTitle className="text-xl">Experience <span className="text-sm font-normal text-muted-foreground">(drag to reorder)</span></CardTitle>
        <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Add Experience</Button>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)] overflow-auto p-6">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={profile.experience.map(e => e.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {profile.experience.map((exp, idx) => (
                <SortableItem key={exp.id} id={exp.id}>
                  <div className="p-4 rounded-lg bg-muted relative hover:bg-muted/80 transition-colors">
                    <div className="absolute top-4 right-4 flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(idx)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setProfile((p) => ({ ...p, experience: p.experience.filter((_, i) => i !== idx) }))}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    <p className="font-semibold text-lg">{exp.role}</p>
                    <p className="text-primary font-medium">{exp.company}</p>
                    <p className="text-sm text-muted-foreground">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}{exp.location ? ` • ${exp.location}` : ''}</p>
                    {exp.description && <p className="mt-2 text-sm">{exp.description}</p>}
                  </div>
                </SortableItem>
              ))}
              {profile.experience.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No experience added yet</p>
                  <Button variant="outline" size="sm" onClick={openAdd} className="mt-4">
                    <Plus className="h-4 w-4 mr-1" /> Add Your First Experience
                  </Button>
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingIdx !== null ? 'Edit' : 'Add'} Experience</DialogTitle></DialogHeader>
            <div className="space-y-3 py-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Company</label><Input value={form.company} onChange={e => setForm({...form, company: e.target.value})} /></div>
                <div><label className="text-sm font-medium">Role</label><Input value={form.role} onChange={e => setForm({...form, role: e.target.value})} /></div>
                <div><label className="text-sm font-medium">Start</label><Input value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} placeholder="Jan 2023" /></div>
                <div><label className="text-sm font-medium">End</label><Input value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} disabled={form.current} placeholder="Dec 2023" /></div>
                <div className="col-span-2"><label className="text-sm font-medium">Location</label><Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="City, State" /></div>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.current} onChange={e => setForm({...form, current: e.target.checked})} className="h-4 w-4" /> Current Position</label>
              <div><label className="text-sm font-medium">Description</label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </>
  );
}

function EducationManager({ profile, setProfile }: { profile: typeof defaultProfile; setProfile: (updater: (prev: typeof defaultProfile) => typeof defaultProfile) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [form, setForm] = useState({ institution: '', degree: '', field: '', startYear: '', endYear: '' });

  const openAdd = () => { setForm({ institution: '', degree: '', field: '', startYear: '', endYear: '' }); setEditingIdx(null); setIsOpen(true); };
  const openEdit = (idx: number) => { setForm(profile.education[idx]); setEditingIdx(idx); setIsOpen(true); };
  const save = () => {
    if (editingIdx !== null) {
      setProfile((p) => ({ ...p, education: p.education.map((e, i) => i === editingIdx ? { ...e, ...form } : e) as Education[] }));
    } else {
      setProfile((p) => ({ ...p, education: [...p.education, { id: Date.now().toString(), ...form }] as Education[] }));
    }
    setIsOpen(false);
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between py-4 border-b bg-muted/30">
        <CardTitle className="text-xl">Education</CardTitle>
        <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Add Education</Button>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)] overflow-auto p-6">
        <div className="space-y-4">
          {profile.education.map((edu, idx) => (
            <div key={edu.id} className="p-4 rounded-lg bg-muted relative hover:bg-muted/80 transition-colors">
              <div className="absolute top-4 right-4 flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(idx)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setProfile((p) => ({ ...p, education: p.education.filter((_, i) => i !== idx) }))}><Trash2 className="h-4 w-4" /></Button>
              </div>
              <p className="font-semibold text-lg">{edu.degree} in {edu.field}</p>
              <p className="text-primary font-medium">{edu.institution}</p>
              <p className="text-sm text-muted-foreground">{edu.startYear} - {edu.endYear}</p>
            </div>
          ))}
          {profile.education.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No education added yet</p>
              <Button variant="outline" size="sm" onClick={openAdd} className="mt-4">
                <Plus className="h-4 w-4 mr-1" /> Add Your First Education
              </Button>
            </div>
          )}
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingIdx !== null ? 'Edit' : 'Add'} Education</DialogTitle></DialogHeader>
            <div className="space-y-3 py-3">
              <div><label className="text-sm font-medium">Institution</label><Input value={form.institution} onChange={e => setForm({...form, institution: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Degree</label><Input value={form.degree} onChange={e => setForm({...form, degree: e.target.value})} /></div>
                <div><label className="text-sm font-medium">Field</label><Input value={form.field} onChange={e => setForm({...form, field: e.target.value})} /></div>
                <div><label className="text-sm font-medium">Start Year</label><Input value={form.startYear} onChange={e => setForm({...form, startYear: e.target.value})} /></div>
                <div><label className="text-sm font-medium">End Year</label><Input value={form.endYear} onChange={e => setForm({...form, endYear: e.target.value})} /></div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </>
  );
}

function SkillsManager({ profile, setProfile }: { profile: typeof defaultProfile; setProfile: (updater: (prev: typeof defaultProfile) => typeof defaultProfile) => void }) {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim()) {
      setProfile((p) => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between py-4 border-b bg-muted/30">
        <CardTitle className="text-xl">Skills</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)] overflow-auto p-6">
        <div className="max-w-2xl">
          <div className="flex gap-2 mb-6">
            <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add a skill..." onKeyDown={e => e.key === 'Enter' && addSkill()} className="flex-1" />
            <Button onClick={addSkill}><Plus className="h-4 w-4" /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, idx) => (
              <Badge key={idx} variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 text-sm">
                {skill}
                <button onClick={() => setProfile((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }))} className="hover:text-destructive ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          {profile.skills.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No skills added yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </>
  );
}

function ProjectsManager({ profile, setProfile }: { profile: typeof defaultProfile; setProfile: (updater: (prev: typeof defaultProfile) => typeof defaultProfile) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', description: '', technologies: '', duration: '', responsibilities: '' });

  const openAdd = () => { setForm({ title: '', description: '', technologies: '', duration: '', responsibilities: '' }); setEditingIdx(null); setIsOpen(true); };
  const openEdit = (idx: number) => {
    const proj = profile.projects[idx];
    setForm({ title: proj.title, description: proj.description, technologies: proj.technologies.join(', '), duration: proj.duration, responsibilities: proj.responsibilities?.join('\n') || '' });
    setEditingIdx(idx); setIsOpen(true);
  };
  const save = () => {
    const data = { ...form, technologies: form.technologies.split(',').map(t => t.trim()).filter(t => t), responsibilities: form.responsibilities.split('\n').filter(r => r.trim()) };
    if (editingIdx !== null) {
      setProfile((p) => ({ ...p, projects: p.projects.map((pr, i) => i === editingIdx ? { ...pr, ...data } : pr) as Project[] }));
    } else {
      setProfile((p) => ({ ...p, projects: [...p.projects, { id: Date.now().toString(), ...data }] as Project[] }));
    }
    setIsOpen(false);
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between py-4 border-b bg-muted/30">
        <CardTitle className="text-xl">Projects</CardTitle>
        <Button size="sm" onClick={openAdd}><Plus className="h-4 w-4 mr-1" /> Add Project</Button>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)] overflow-auto p-6">
        <div className="space-y-4">
          {profile.projects.map((proj, idx) => (
            <div key={proj.id} className="p-4 rounded-lg bg-muted relative hover:bg-muted/80 transition-colors">
              <div className="absolute top-4 right-4 flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(idx)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setProfile((p) => ({ ...p, projects: p.projects.filter((_, i) => i !== idx) }))}><Trash2 className="h-4 w-4" /></Button>
              </div>
              <p className="font-semibold text-lg">{proj.title}</p>
              <p className="text-sm text-muted-foreground">{proj.duration}</p>
              {proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {proj.technologies.map((tech, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{tech}</Badge>
                  ))}
                </div>
              )}
              {proj.description && <p className="mt-2 text-sm">{proj.description}</p>}
            </div>
          ))}
          {profile.projects.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FileTextIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No projects added yet</p>
              <Button variant="outline" size="sm" onClick={openAdd} className="mt-4">
                <Plus className="h-4 w-4 mr-1" /> Add Your First Project
              </Button>
            </div>
          )}
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editingIdx !== null ? 'Edit' : 'Add'} Project</DialogTitle></DialogHeader>
            <div className="space-y-3 py-3">
              <div><label className="text-sm font-medium">Title</label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm font-medium">Duration</label><Input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="Jan 2024 - Present" /></div>
                <div><label className="text-sm font-medium">Technologies</label><Input value={form.technologies} onChange={e => setForm({...form, technologies: e.target.value})} placeholder="Python, AWS, Pandas" /></div>
              </div>
              <div><label className="text-sm font-medium">Description</label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} /></div>
              <div><label className="text-sm font-medium">Responsibilities (one per line)</label><Textarea value={form.responsibilities} onChange={e => setForm({...form, responsibilities: e.target.value})} rows={5} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </>
  );
}
