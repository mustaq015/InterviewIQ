import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea } from '../../components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  FileText, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Save,
  File,
  Download,
  AlertCircle,
  Upload,
  Eye,
  X,
  BookOpen,
  FileCode,
  RefreshCw,
  Folder,
  ChevronDown,
  ChevronRight,
  StickyNote
} from 'lucide-react';
import { useLocalStorage } from '../../hooks';
import { topics, topicColors, type Note } from './data';
import { getAllUploadedFiles, addUploadedFile, deleteUploadedFile } from '../../db';
import type { UploadedFile } from '../../types';
import { markdownDocuments } from './markdown-content';

interface NoteItem extends Note {
  id: string;
}

export function Materials() {
  const [notes, setNotes] = useLocalStorage<NoteItem[]>('materials-notes', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTopic, setFilterTopic] = useState<string>('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [showNotes, setShowNotes] = useState(true);
  const [showUploaded, setShowUploaded] = useState(true);
  const [showPath, setShowPath] = useState(false);
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTopic, setUploadTopic] = useState('SQL');
  const [uploadDescription, setUploadDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<typeof markdownDocuments[0] | null>(null);
  const [docContent, setDocContent] = useState<string>('');
  const [isEditingDoc, setIsEditingDoc] = useState(false);
  const [editedDocContent, setEditedDocContent] = useState<string>('');
  const [editedDocuments, setEditedDocuments] = useLocalStorage<Record<string, string>>('edited-documents', {});
  const [showLibrary, setShowLibrary] = useState(true);
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [editingCustomDoc, setEditingCustomDoc] = useState<{id: string; title: string; content: string; topic: string} | null>(null);
  
  interface CustomMarkdownDoc {
    id: string;
    title: string;
    content: string;
    topic: string;
    createdAt: Date;
    updatedAt: Date;
  }
  const [customDocs, setCustomDocs] = useLocalStorage<CustomMarkdownDoc[]>('custom-markdown-docs', []);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    topic: 'SQL',
    tags: ''
  });

  const [newDoc, setNewDoc] = useState({
    title: '',
    content: '',
    topic: 'General'
  });

  const loadUploadedFiles = useCallback(async () => {
    try {
      const files = await getAllUploadedFiles();
      setUploadedFiles(files);
    } catch {
      console.error('Failed to load uploaded files');
    }
  }, []);

  useEffect(() => {
    loadUploadedFiles();
  }, [loadUploadedFiles]);

  const handleAddNote = () => {
    if (!newNote.title.trim()) return;
    
    const note: NoteItem = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      topic: newNote.topic,
      tags: newNote.tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setNotes([note, ...notes]);
    setNewNote({ title: '', content: '', topic: 'SQL', tags: '' });
    setIsAddingNote(false);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Delete this note?')) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  const handleUpdateNote = () => {
    if (!editingNote) return;
    
    setNotes(notes.map(n => 
      n.id === editingNote.id 
        ? { ...editingNote, updatedAt: new Date() }
        : n
    ));
    setEditingNote(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result as string;
        const base64 = data.split(',')[1] || data;
        
        await addUploadedFile({
          name: `${Date.now()}-${uploadFile.name}`,
          originalName: uploadFile.name,
          type: uploadFile.type,
          size: uploadFile.size,
          data: base64,
          topic: uploadTopic,
          description: uploadDescription
        });
        
        await loadUploadedFiles();
        setIsUploadModalOpen(false);
        setUploadFile(null);
        setUploadTopic('SQL');
        setUploadDescription('');
        setIsUploading(false);
      };
      reader.readAsDataURL(uploadFile);
    } catch (error) {
      console.error('Failed to upload file:', error);
      setIsUploading(false);
    }
  };

  const handleDeleteUploadedFile = async (id: number) => {
    if (confirm('Delete this file? This cannot be undone.')) {
      await deleteUploadedFile(id);
      await loadUploadedFiles();
    }
  };

  const loadMarkdownDoc = async (doc: typeof markdownDocuments[0]) => {
    setSelectedDoc(doc);
    setIsEditingDoc(false);
    try {
      const editedContent = editedDocuments[doc.id];
      if (editedContent) {
        setDocContent(editedContent);
      } else {
        const response = await fetch(`/src/features/materials/markdown/${doc.id}.md`);
        if (response.ok) {
          const content = await response.text();
          setDocContent(content);
        } else {
          setDocContent(`# ${doc.title}\n\n*Content could not be loaded. The markdown file may need to be regenerated.*\n\nTo regenerate markdown files:\n1. Open terminal in the project directory\n2. Run: \`node scripts/convert-pdfs.cjs\``);
        }
      }
    } catch {
      setDocContent(`# ${doc.title}\n\n*Error loading content.*`);
    }
  };

  const handleSaveDocEdit = () => {
    if (selectedDoc) {
      if (selectedDoc.id.startsWith('custom-doc-')) {
        setCustomDocs(customDocs.map(d => 
          d.id === selectedDoc.id 
            ? { ...d, content: editedDocContent, updatedAt: new Date() }
            : d
        ));
        setDocContent(editedDocContent);
      } else {
        setEditedDocuments(prev => ({ ...prev, [selectedDoc.id]: editedDocContent }));
        setDocContent(editedDocContent);
      }
      setIsEditingDoc(false);
    }
  };

  const handleResetDocEdit = () => {
    if (selectedDoc && confirm('Reset to original content? This will discard your edits.')) {
      setEditedDocuments(prev => {
        const updated = { ...prev };
        delete updated[selectedDoc.id];
        return updated;
      });
      setIsEditingDoc(false);
      loadMarkdownDoc(selectedDoc);
    }
  };

  const handleCreateDoc = () => {
    if (!newDoc.title.trim()) return;
    const doc: CustomMarkdownDoc = {
      id: `custom-doc-${Date.now()}`,
      title: newDoc.title,
      content: newDoc.content,
      topic: newDoc.topic,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setCustomDocs([doc, ...customDocs]);
    setNewDoc({ title: '', content: '', topic: 'General' });
    setIsCreatingDoc(false);
  };

  const handleUpdateDoc = () => {
    if (!editingCustomDoc) return;
    setCustomDocs(customDocs.map(d => 
      d.id === editingCustomDoc.id 
        ? { ...d, title: editingCustomDoc.title, content: editingCustomDoc.content, topic: editingCustomDoc.topic, updatedAt: new Date() }
        : d
    ));
    setEditingCustomDoc(null);
  };

  const handleDeleteDoc = (id: string) => {
    if (confirm('Delete this document?')) {
      setCustomDocs(customDocs.filter(d => d.id !== id));
    }
  };

  const openCustomDoc = (doc: CustomMarkdownDoc) => {
    setSelectedDoc({ id: doc.id, title: doc.title, topic: doc.topic, source: '', pages: 1 });
    setDocContent(doc.content);
    setIsEditingDoc(false);
  };

  const handleDownloadFile = (file: UploadedFile) => {
    const byteCharacters = atob(file.data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: file.type });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = file.originalName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePreviewFile = (file: UploadedFile) => {
    const byteCharacters = atob(file.data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: file.type });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTopic = !filterTopic || note.topic === filterTopic;
    return matchesSearch && matchesTopic;
  });

  const filteredUploadedFiles = uploadedFiles.filter(f => {
    const matchesSearch = f.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesTopic = !filterTopic || f.topic === filterTopic;
    return matchesSearch && matchesTopic;
  });

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <File className="h-5 w-5 text-red-500" />;
    if (type.includes('image')) return <FileText className="h-5 w-5 text-green-500" />;
    if (type.includes('text')) return <FileText className="h-5 w-5 text-blue-500" />;
    return <File className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Study Materials & Notes</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPath(!showPath)}>
            <Folder className="mr-2 h-4 w-4" />
            {showPath ? 'Hide' : 'Show'} Paths
          </Button>
          <Button onClick={() => setIsCreatingDoc(true)}>
            <FileCode className="mr-2 h-4 w-4" />
            Create Document
          </Button>
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
          <Button onClick={() => setIsAddingNote(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </div>
      </div>

      {showPath && (
        <Card className="border-primary bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              PDF Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-mono bg-background p-2 rounded border">
              C:\Users\User\InterviewIQ\pdf-materials
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Copy this path and paste in Windows Explorer (Win + E) to access your study PDFs
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes and materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={filterTopic}
              onChange={(e) => setFilterTopic(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="">All Topics</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {(isAddingNote || editingNote) && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>{editingNote ? 'Edit Note' : 'Add New Note'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={editingNote ? editingNote.title : newNote.title}
                  onChange={(e) => editingNote 
                    ? setEditingNote({...editingNote, title: e.target.value})
                    : setNewNote({...newNote, title: e.target.value})
                  }
                  placeholder="Note title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Topic</label>
                <select
                  value={editingNote ? editingNote.topic : newNote.topic}
                  onChange={(e) => editingNote
                    ? setEditingNote({...editingNote, topic: e.target.value})
                    : setNewNote({...newNote, topic: e.target.value})
                  }
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  {topics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={editingNote ? editingNote.content : newNote.content}
                onChange={(e) => editingNote
                  ? setEditingNote({...editingNote, content: e.target.value})
                  : setNewNote({...newNote, content: e.target.value})
                }
                placeholder="Write your note here..."
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags (comma-separated)</label>
              <Input
                value={editingNote ? editingNote.tags.join(', ') : newNote.tags}
                onChange={(e) => editingNote
                  ? setEditingNote({...editingNote, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})
                  : setNewNote({...newNote, tags: e.target.value})
                }
                placeholder="interview, sql, optimization"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddingNote(false);
                  setEditingNote(null);
                  setNewNote({ title: '', content: '', topic: 'SQL', tags: '' });
                }}
              >
                Cancel
              </Button>
              <Button onClick={editingNote ? handleUpdateNote : handleAddNote}>
                <Save className="mr-2 h-4 w-4" />
                {editingNote ? 'Update' : 'Save'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <button
          onClick={() => setShowUploaded(!showUploaded)}
          className="flex items-center gap-2 text-lg font-semibold w-full"
        >
          {showUploaded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          <Upload className="h-5 w-5 text-primary" />
          Uploaded Files ({filteredUploadedFiles.length})
        </button>

        {showUploaded && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUploadedFiles.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">No uploaded files yet</p>
                  <Button variant="outline" onClick={() => setIsUploadModalOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload your first file
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredUploadedFiles.map(file => (
                <Card key={file.id} className="relative group hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate" title={file.originalName}>{file.originalName}</h4>
                        {file.description && (
                          <p className="text-sm text-muted-foreground mt-1 truncate">{file.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${topicColors[file.topic] || 'bg-gray-500'} text-white`}>
                            {file.topic}
                          </span>
                          <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePreviewFile(file)}
                        className="flex-1"
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDownloadFile(file)}
                      >
                        <Download className="mr-1 h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteUploadedFile(file.id!)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setShowLibrary(!showLibrary)}
          className="flex items-center gap-2 text-lg font-semibold w-full"
        >
          {showLibrary ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          <FileCode className="h-5 w-5" />
          My Documents ({customDocs.length})
        </button>

        {showLibrary && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customDocs.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <FileCode className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">No documents yet</p>
                  <Button variant="outline" onClick={() => setIsCreatingDoc(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create your first document
                  </Button>
                </CardContent>
              </Card>
            ) : (
              customDocs.map(doc => (
                <Card key={doc.id} className="relative group hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-medium">{doc.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded ${topicColors[doc.topic] || 'bg-gray-500'} text-white`}>
                          {doc.topic}
                        </span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => setEditingCustomDoc(doc)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteDoc(doc.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => openCustomDoc(doc)}
                    >
                      <BookOpen className="mr-1 h-4 w-4" />
                      Open
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setShowNotes(!showNotes)}
          className="flex items-center gap-2 text-lg font-semibold w-full"
        >
          {showNotes ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          <StickyNote className="h-5 w-5" />
          My Notes ({filteredNotes.length})
        </button>

        {showNotes && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <StickyNote className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No notes yet. Create your first note!</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotes.map(note => (
                <Card key={note.id} className="relative group">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-base">{note.title}</CardTitle>
                        <span className={`text-xs px-2 py-0.5 rounded ${topicColors[note.topic] || 'bg-gray-500'} text-white`}>
                          {note.topic}
                        </span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => setEditingNote(note)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteNote(note.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none line-clamp-6 markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {note.content}
                      </ReactMarkdown>
                    </div>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {note.tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select File</label>
              <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.gif"
                />
                {uploadFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <File className="h-8 w-8 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">{uploadFile.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(uploadFile.size)}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => {
                      setUploadFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Supported: PDF, DOC, DOCX, TXT, MD, PNG, JPG, GIF
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Topic</label>
                <select
                  value={uploadTopic}
                  onChange={(e) => setUploadTopic(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  {topics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (optional)</label>
              <Input
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                placeholder="Brief description of the file"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsUploadModalOpen(false);
              setUploadFile(null);
              setUploadTopic('SQL');
              setUploadDescription('');
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!uploadFile || isUploading}>
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreatingDoc || !!editingCustomDoc} onOpenChange={() => { setIsCreatingDoc(false); setEditingCustomDoc(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCustomDoc ? 'Edit Document' : 'Create New Document'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editingCustomDoc ? editingCustomDoc.title : newDoc.title}
                onChange={(e) => editingCustomDoc
                  ? setEditingCustomDoc({...editingCustomDoc, title: e.target.value})
                  : setNewDoc({...newDoc, title: e.target.value})
                }
                placeholder="Document title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Topic</label>
                <select
                  value={editingCustomDoc ? editingCustomDoc.topic : newDoc.topic}
                  onChange={(e) => editingCustomDoc
                    ? setEditingCustomDoc({...editingCustomDoc, topic: e.target.value})
                    : setNewDoc({...newDoc, topic: e.target.value})
                  }
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  {topics.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content (Markdown)</label>
              <Textarea
                value={editingCustomDoc ? editingCustomDoc.content : newDoc.content}
                onChange={(e) => editingCustomDoc
                  ? setEditingCustomDoc({...editingCustomDoc, content: e.target.value})
                  : setNewDoc({...newDoc, content: e.target.value})
                }
                placeholder="Write your document content in markdown..."
                className="min-h-[300px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Supports full Markdown syntax including headers, lists, code blocks, tables, and more.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreatingDoc(false); setEditingCustomDoc(null); setNewDoc({ title: '', content: '', topic: 'General' }); }}>
              Cancel
            </Button>
            <Button onClick={editingCustomDoc ? handleUpdateDoc : handleCreateDoc} disabled={!editingCustomDoc ? !newDoc.title.trim() : !editingCustomDoc.title.trim()}>
              <Save className="mr-2 h-4 w-4" />
              {editingCustomDoc ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {previewFile && (
        <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="truncate">{previewFile.originalName}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              {previewFile.type.includes('image') ? (
                <img 
                  src={`data:${previewFile.type};base64,${previewFile.data}`} 
                  alt={previewFile.originalName}
                  className="max-w-full h-auto mx-auto"
                />
              ) : previewFile.type.includes('pdf') ? (
                <iframe 
                  src={`data:${previewFile.type};base64,${previewFile.data}`}
                  className="w-full h-[60vh]"
                  title={previewFile.originalName}
                />
              ) : previewFile.type.includes('markdown') || previewFile.type.includes('text') || previewFile.originalName.endsWith('.md') || previewFile.originalName.endsWith('.txt') ? (
                <div className="prose prose-sm dark:prose-invert max-w-none p-4 overflow-auto max-h-[60vh]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {atob(previewFile.data)}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <FileCode className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Preview not available for this file type</p>
                  <Button className="mt-4" onClick={() => handleDownloadFile(previewFile)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download to View
                  </Button>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPreviewFile(null)}>
                Close
              </Button>
              <Button onClick={() => handleDownloadFile(previewFile)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b bg-card">
            <div>
              <h2 className="text-lg font-bold">{selectedDoc.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded ${topicColors[selectedDoc.topic] || 'bg-gray-500'} text-white`}>
                  {selectedDoc.topic}
                </span>
                <span className="text-xs text-muted-foreground">{selectedDoc.pages} pages</span>
                {editedDocuments[selectedDoc.id] && (
                  <span className="text-xs px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300">
                    Edited
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditingDoc ? (
                <>
                  <Button variant="default" size="sm" onClick={handleSaveDocEdit}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsEditingDoc(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={() => {
                    setEditedDocContent(docContent);
                    setIsEditingDoc(true);
                  }}>
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {editedDocuments[selectedDoc.id] && (
                    <Button variant="ghost" size="sm" onClick={handleResetDocEdit} title="Reset to original">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  )}
                </>
              )}
              <Button variant="outline" size="sm" onClick={() => setSelectedDoc(null)}>
                <X className="h-4 w-4 mr-1" />
                Close
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto p-6">
              {isEditingDoc ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Markdown Editor</label>
                  <Textarea
                    value={editedDocContent}
                    onChange={(e) => setEditedDocContent(e.target.value)}
                    className="min-h-[70vh] font-mono text-sm"
                    placeholder="Edit markdown content..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports Markdown syntax. Save to persist changes.
                  </p>
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({children}) => <h1 className="text-2xl font-bold mt-6 mb-4 text-foreground">{children}</h1>,
                      h2: ({children}) => <h2 className="text-xl font-semibold mt-5 mb-3 text-foreground">{children}</h2>,
                      h3: ({children}) => <h3 className="text-lg font-medium mt-4 mb-2 text-primary">{children}</h3>,
                      h4: ({children}) => <h4 className="text-base font-medium mt-3 mb-2 text-foreground">{children}</h4>,
                      p: ({children}) => <p className="my-2 leading-relaxed">{children}</p>,
                      ul: ({children}) => <ul className="list-disc ml-6 my-2 space-y-1">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal ml-6 my-2 space-y-1">{children}</ol>,
                      li: ({children}) => <li className="leading-relaxed">{children}</li>,
                      code: ({children, className}) => {
                        const isInline = !className;
                        return isInline 
                          ? <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                          : <code className="block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto my-2">{children}</code>;
                      },
                      pre: ({children}) => <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-2">{children}</pre>,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-primary pl-4 my-2 italic text-muted-foreground">{children}</blockquote>,
                      table: ({children}) => <table className="w-full border-collapse my-4">{children}</table>,
                      th: ({children}) => <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">{children}</th>,
                      td: ({children}) => <td className="border border-border px-4 py-2">{children}</td>,
                      a: ({href, children}) => <a href={href} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">{children}</a>,
                      hr: () => <hr className="my-6 border-border" />,
                      strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                      em: ({children}) => <em className="italic">{children}</em>,
                    }}
                  >
                    {docContent}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
