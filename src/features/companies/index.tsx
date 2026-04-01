import { useState } from 'react';
import { useAppStore } from '../../store';
import { Button, Input, Label, Textarea, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Badge } from '../../components/ui';
import { Plus, Pencil, Trash2, Building2, Star, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Company, CompanyRound } from '../../types';

type TabType = string;

const pipelineStages = [
  { value: 'applied', label: 'Applied', color: 'bg-blue-500' },
  { value: 'screening', label: 'Screening', color: 'bg-purple-500' },
  { value: 'technical', label: 'Technical', color: 'bg-orange-500' },
  { value: 'hr-round', label: 'HR Round', color: 'bg-green-500' },
  { value: 'offer', label: 'Offer', color: 'bg-emerald-500' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-500' },
];

export function Companies() {
  const { companies, questions, answers, addCompany, updateCompany, deleteCompany } = useAppStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  
  const [isDescDialogOpen, setIsDescDialogOpen] = useState(false);
  const [descEditData, setDescEditData] = useState({ description: '', website: '' });
  
  const [isTipsDialogOpen, setIsTipsDialogOpen] = useState(false);
  const [tipsEditData, setTipsEditData] = useState<string[]>([]);
  
  const [isRoundDialogOpen, setIsRoundDialogOpen] = useState(false);
  const [editingRound, setEditingRound] = useState<CompanyRound | null>(null);
  const [roundFormData, setRoundFormData] = useState({ name: '', description: '', topics: '' });
  const [isQASelectOpen, setIsQASelectOpen] = useState(false);
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    pipeline: 'applied' as Company['pipeline'],
    tips: [] as string[],
    roundDetails: [] as CompanyRound[],
  });

  const resetFormData = () => ({
    name: '',
    description: '',
    website: '',
    pipeline: 'applied' as Company['pipeline'],
    tips: [] as string[],
    roundDetails: [] as CompanyRound[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const companyData = {
      ...formData,
      tips: formData.tips.filter(t => t.trim()),
    };
    
    if (editingCompany) {
      await updateCompany(editingCompany.id!, companyData);
    } else {
      await addCompany(companyData);
    }
    
    setIsDialogOpen(false);
    setEditingCompany(null);
    setFormData(resetFormData());
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      description: company.description || '',
      website: company.website || '',
      pipeline: company.pipeline || 'applied',
      tips: company.tips || [],
      roundDetails: company.roundDetails || [],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this company?')) {
      await deleteCompany(id);
      if (selectedCompany?.id === id) {
        setSelectedCompany(null);
      }
    }
  };

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
    setActiveTab('description');
  };

  const handleOpenDescEdit = () => {
    if (!selectedCompany) return;
    setDescEditData({
      description: selectedCompany.description || '',
      website: selectedCompany.website || ''
    });
    setIsDescDialogOpen(true);
  };

  const handleSaveDesc = async () => {
    if (!selectedCompany) return;
    await updateCompany(selectedCompany.id!, {
      description: descEditData.description,
      website: descEditData.website
    });
    setSelectedCompany({ ...selectedCompany, description: descEditData.description, website: descEditData.website });
    setIsDescDialogOpen(false);
  };

  const handleOpenTipsEdit = () => {
    if (!selectedCompany) return;
    setTipsEditData([...selectedCompany.tips || []]);
    setIsTipsDialogOpen(true);
  };

  const handleSaveTips = async () => {
    if (!selectedCompany) return;
    await updateCompany(selectedCompany.id!, { tips: tipsEditData.filter(t => t.trim()) });
    setSelectedCompany({ ...selectedCompany, tips: tipsEditData.filter(t => t.trim()) });
    setIsTipsDialogOpen(false);
  };

  const handleAddTip = () => {
    setTipsEditData([...tipsEditData, '']);
  };

  const handleUpdateTip = (index: number, value: string) => {
    setTipsEditData(tipsEditData.map((t, i) => i === index ? value : t));
  };

  const handleRemoveTip = (index: number) => {
    setTipsEditData(tipsEditData.filter((_, i) => i !== index));
  };

  const handleOpenRoundDialog = (round?: CompanyRound) => {
    setEditingRound(round || null);
    setRoundFormData({
      name: round?.name || '',
      description: round?.description || '',
      topics: round?.topics.join(', ') || ''
    });
    setIsRoundDialogOpen(true);
  };

  const handleSaveRound = async () => {
    if (!selectedCompany || !roundFormData.name.trim()) return;
    const topics = roundFormData.topics.split(',').map(t => t.trim()).filter(Boolean);
    if (editingRound) {
      const updatedRounds = selectedCompany.roundDetails?.map(r => 
        r.id === editingRound.id ? { ...r, name: roundFormData.name, description: roundFormData.description, topics } : r
      ) || [];
      await updateCompany(selectedCompany.id!, { roundDetails: updatedRounds });
      setSelectedCompany({ ...selectedCompany, roundDetails: updatedRounds });
    } else {
      const newRound: CompanyRound = {
        id: Date.now().toString(),
        roundNumber: (selectedCompany.roundDetails?.length || 0) + 1,
        name: roundFormData.name,
        description: roundFormData.description,
        topics,
        questionIds: []
      };
      const updatedRounds = [...(selectedCompany.roundDetails || []), newRound];
      await updateCompany(selectedCompany.id!, { roundDetails: updatedRounds });
      setSelectedCompany({ ...selectedCompany, roundDetails: updatedRounds });
    }
    setIsRoundDialogOpen(false);
  };

  const handleOpenQASelect = (roundId: string) => {
    setSelectedRoundId(roundId);
    setIsQASelectOpen(true);
  };

  const handleToggleQA = async (questionId: number) => {
    if (!selectedCompany || !selectedRoundId) return;
    const round = selectedCompany.roundDetails?.find(r => r.id === selectedRoundId);
    if (!round) return;

    const questionIds = round.questionIds.includes(questionId)
      ? round.questionIds.filter(id => id !== questionId)
      : [...round.questionIds, questionId];

    const updatedRounds = selectedCompany.roundDetails?.map(r => 
      r.id === selectedRoundId ? { ...r, questionIds } : r
    ) || [];
    await updateCompany(selectedCompany.id!, { roundDetails: updatedRounds });
    setSelectedCompany({ ...selectedCompany, roundDetails: updatedRounds });
  };

  const getPipelineColor = (stage?: string) => {
    return pipelineStages.find(s => s.value === stage)?.color || 'bg-gray-500';
  };

  const companyQuestions = selectedCompany 
    ? questions.filter(q => q.companyId === selectedCompany.id)
    : [];

  return (
    <div className="h-full flex flex-col">
      {!selectedCompany ? (
        <div className="p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Companies</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your target companies</p>
            </div>
            <Button onClick={() => {
              setEditingCompany(null);
              setFormData(resetFormData());
              setIsDialogOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Button>
          </div>

          {companies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No companies yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start by adding your first company</p>
              <Button onClick={() => {
                setEditingCompany(null);
                setFormData(resetFormData());
                setIsDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Company
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {companies.map((company, idx) => {
                const colors = [
                  'from-blue-500 to-blue-600',
                  'from-green-500 to-green-600',
                  'from-purple-500 to-purple-600',
                  'from-orange-500 to-orange-600',
                  'from-pink-500 to-pink-600',
                  'from-indigo-500 to-indigo-600',
                ];
                const colorClass = colors[idx % colors.length];
                return (
                  <div 
                    key={company.id} 
                    className="group relative bg-card border border-border rounded-lg p-4 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
                    onClick={() => handleSelectCompany(company)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center shrink-0`}>
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{company.name}</h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge className={`${getPipelineColor(company.pipeline)} text-white text-[10px] px-2 py-0.5`}>
                            {pipelineStages.find(s => s.value === company.pipeline)?.label}
                          </Badge>
                          {company.rating && (
                            <div className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                              <span className="text-[10px] text-muted-foreground">{company.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(company); }}
                        className="p-1.5 rounded-md bg-background border border-border shadow-sm hover:bg-accent transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(company.id!); }}
                        className="p-1.5 rounded-md bg-background border border-border shadow-sm hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 lg:p-8 space-y-6">
          <button 
            onClick={() => setSelectedCompany(null)} 
            className="text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1 text-sm font-medium transition-colors"
          >
            <X className="h-4 w-4" />
            Back
          </button>
          
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shrink-0">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-semibold text-foreground">{selectedCompany.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className={`${getPipelineColor(selectedCompany.pipeline)} text-white text-xs`}>
                    {pipelineStages.find(s => s.value === selectedCompany.pipeline)?.label}
                  </Badge>
                  {selectedCompany.rating && (
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < selectedCompany.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                  )}
                  {selectedCompany.interviewDate && (
                    <span className="text-xs text-muted-foreground">{new Date(selectedCompany.interviewDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
            
            <div className="space-y-4">
              <section className="pb-4 border-b border-dashed border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Description
                  </h2>
                  <button 
                    onClick={handleOpenDescEdit}
                    className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full hover:bg-blue-600 transition-all font-medium"
                  >
                    {selectedCompany.description ? 'Edit' : 'Add'}
                  </button>
                </div>
                {selectedCompany.description ? (
                  <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-2 border border-blue-100 dark:border-blue-900">
                    <div className="prose dark:prose-invert max-w-none text-xs text-gray-700 dark:text-gray-300">
                      <ReactMarkdown>{selectedCompany.description}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 italic text-xs text-center py-2">No description</p>
                )}
              </section>
              
              <section className="pb-4 border-b border-dashed border-amber-200 dark:border-amber-800">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    Tips & Tricks
                  </h2>
                  <button 
                    onClick={handleOpenTipsEdit}
                    className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full hover:bg-amber-600 transition-all font-medium"
                  >
                    {selectedCompany.tips?.length ? 'Edit' : 'Add'}
                  </button>
                </div>
                {selectedCompany.tips && selectedCompany.tips.length > 0 ? (
                  <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-lg p-2 border border-amber-100 dark:border-amber-900">
                    <ul className="space-y-1">
                      {selectedCompany.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-xs">
                          <span className="bg-amber-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px] shrink-0">{idx + 1}</span>
                          <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-400 italic text-xs text-center py-2">No tips</p>
                )}
              </section>
              
              <section>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Interview Rounds
                  </h2>
                </div>
                
                {selectedCompany.roundDetails && selectedCompany.roundDetails.length > 0 ? (
                  <>
                    <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3">
                      {selectedCompany.roundDetails.map((round) => (
                        <button
                          key={round.id}
                          onClick={() => setActiveTab(`round-${round.id}`)}
                          className={`px-3 py-1.5 text-[11px] font-bold rounded-lg whitespace-nowrap shrink-0 ${
                            activeTab === `round-${round.id}`
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow'
                              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-purple-200 dark:border-purple-700'
                          }`}
                        >
                          R{round.roundNumber}: {round.name}
                        </button>
                      ))}
                      <button
                        onClick={() => handleOpenRoundDialog()}
                        className="px-2 py-1.5 text-[11px] font-medium rounded-lg border border-dashed border-purple-300 dark:border-purple-600 text-purple-500 shrink-0"
                      >
                        + Add
                      </button>
                    </div>

                    <div className="space-y-3">
                      {selectedCompany.roundDetails.map((round) => (
                        <div key={round.id} className={activeTab === `round-${round.id}` ? '' : 'hidden'}>
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 rounded-xl p-3 border border-purple-100 dark:border-purple-900 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg px-2 py-0.5 font-bold text-xs">
                                  R{round.roundNumber}
                                </span>
                                <h3 className="text-sm font-bold text-purple-800 dark:text-purple-300">{round.name}</h3>
                              </div>
                              <button 
                                onClick={() => handleOpenRoundDialog(round)}
                                className="text-[10px] bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-700 text-purple-600 font-medium"
                              >
                                Edit
                              </button>
                            </div>
                            {round.description && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 bg-white/50 dark:bg-black/20 p-2 rounded">{round.description}</p>
                            )}
                            {round.topics.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {round.topics.map((topic, tIdx) => (
                                  <span key={tIdx} className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <div className="mt-2 pt-2 border-t border-purple-200 dark:border-purple-800">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-bold text-pink-700 dark:text-pink-400">
                                  Q&A ({round.questionIds.length})
                                </h4>
                                <button 
                                  onClick={() => handleOpenQASelect(round.id)}
                                  className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded-full hover:bg-pink-600 font-medium"
                                >
                                  Select Q&A
                                </button>
                              </div>
                              {round.questionIds.length > 0 ? (
                                <div className="space-y-2">
                                  {round.questionIds.map((qId) => {
                                    const q = questions.find(q => q.id === qId);
                                    const ans = q ? (answers.find(a => a.questionId === qId && a.isBest) || answers.find(a => a.questionId === qId)) : null;
                                    if (!q) return null;
                                    return (
                                      <div key={qId} className="bg-white dark:bg-black/30 rounded-lg p-2 border border-pink-100 dark:border-pink-900">
                                        <p className="font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1.5 text-xs mb-1">
                                          <span className="bg-pink-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">Q</span>
                                          {q.title}
                                        </p>
                                        {ans && (
                                          <p className="text-gray-600 dark:text-gray-400 ml-5 text-xs flex items-start gap-1">
                                            <span className="bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] shrink-0">A</span>
                                            {ans.content}
                                          </p>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-gray-400 italic text-[10px] text-center py-1">No Q&A selected</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6 bg-purple-50/50 dark:bg-purple-950/40 rounded-xl border border-dashed border-purple-200 dark:border-purple-800">
                    <p className="text-purple-500 font-bold text-xs">No rounds</p>
                    <button
                      onClick={() => handleOpenRoundDialog()}
                      className="mt-1 text-[10px] bg-purple-500 text-white px-3 py-1 rounded-full hover:bg-purple-600 font-medium"
                    >
                      + Add First Round
                    </button>
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">
              {editingCompany ? 'Edit Company' : 'Add Company'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Company name"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="pipeline" className="text-sm font-medium">Pipeline Stage</Label>
              <select
                id="pipeline"
                value={formData.pipeline}
                onChange={(e) => setFormData({ ...formData, pipeline: e.target.value as Company['pipeline'] })}
                className="w-full mt-1 h-10 px-3 rounded-lg border border-input bg-background text-sm"
              >
                {pipelineStages.map(stage => (
                  <option key={stage.value} value={stage.value}>{stage.label}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1 rounded-lg">
                Cancel
              </Button>
              <Button type="submit" disabled={!formData.name.trim()} className="flex-1 rounded-lg">
                {editingCompany ? 'Save' : 'Add'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDescDialogOpen} onOpenChange={setIsDescDialogOpen}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">Description</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                value={descEditData.description}
                onChange={(e) => setDescEditData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Write about the company..."
                rows={5}
                className="mt-1"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Website</Label>
              <Input
                value={descEditData.website}
                onChange={(e) => setDescEditData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDescDialogOpen(false)} className="flex-1 rounded-lg">Cancel</Button>
              <Button onClick={handleSaveDesc} className="flex-1 rounded-lg">Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isTipsDialogOpen} onOpenChange={setIsTipsDialogOpen}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">Tips & Tricks</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Tips</Label>
              <Button size="sm" variant="outline" onClick={handleAddTip} className="rounded-full text-xs px-3">
                + Add
              </Button>
            </div>
            {tipsEditData.map((tip, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  value={tip}
                  onChange={(e) => handleUpdateTip(idx, e.target.value)}
                  placeholder={`Tip ${idx + 1}`}
                  className="rounded-lg"
                />
                <Button size="icon" variant="ghost" onClick={() => handleRemoveTip(idx)} className="text-gray-400 hover:text-red-500 shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {tipsEditData.length === 0 && (
              <p className="text-gray-400 text-sm italic text-center py-4">No tips yet</p>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsTipsDialogOpen(false)} className="flex-1 rounded-lg">Cancel</Button>
            <Button onClick={handleSaveTips} className="flex-1 rounded-lg">Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isRoundDialogOpen} onOpenChange={setIsRoundDialogOpen}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">{editingRound ? 'Edit Round' : 'Add Round'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Round Name</Label>
              <Input
                value={roundFormData.name}
                onChange={(e) => setRoundFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Technical Screening"
                className="mt-1 rounded-lg"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                value={roundFormData.description}
                onChange={(e) => setRoundFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What to expect in this round..."
                rows={3}
                className="mt-1 rounded-lg"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Topics</Label>
              <Input
                value={roundFormData.topics}
                onChange={(e) => setRoundFormData(prev => ({ ...prev, topics: e.target.value }))}
                placeholder="SQL, Python, System Design"
                className="mt-1 rounded-lg"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsRoundDialogOpen(false)} className="flex-1 rounded-lg">Cancel</Button>
              <Button onClick={handleSaveRound} disabled={!roundFormData.name.trim()} className="flex-1 rounded-lg">
                {editingRound ? 'Update' : 'Add'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isQASelectOpen} onOpenChange={setIsQASelectOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg">Select Q&A for Round</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto space-y-2">
            {companyQuestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No Q&A available. Add Q&A in the Q&A section first.</p>
              </div>
            ) : (
              companyQuestions.map((q) => {
                const isSelected = selectedCompany?.roundDetails?.find(r => r.id === selectedRoundId)?.questionIds.includes(q.id!) || false;
                const ans = answers.find(a => a.questionId === q.id && a.isBest) || answers.find(a => a.questionId === q.id);
                return (
                  <div 
                    key={q.id}
                    onClick={() => handleToggleQA(q.id!)}
                    className={`
                      cursor-pointer rounded-lg p-3 border transition-all
                      ${isSelected 
                        ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/30' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-pink-300'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5
                        ${isSelected 
                          ? 'bg-pink-500 border-pink-500' 
                          : 'border-gray-300 dark:border-gray-600'}
                      `}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{q.title}</p>
                        {ans && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ans.content}</p>
                        )}
                        <div className="flex gap-1 mt-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${q.difficulty === 'easy' ? 'bg-green-100 text-green-700' : q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {q.difficulty}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                            {q.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsQASelectOpen(false)} className="rounded-lg">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
