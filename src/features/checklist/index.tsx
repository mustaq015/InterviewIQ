import { useState } from 'react';
import { Button, Input } from '../../components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Check, Plus, RotateCcw, CheckCircle2, Edit2, Trash2, Save } from 'lucide-react';
import { useAppStore } from '../../store';

export function Checklist() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'prep' | 'technical' | 'logistics'>('all');
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'prep' | 'technical' | 'logistics'>('prep');
  const [editingItem, setEditingItem] = useState<{ id: number; text: string; category: 'prep' | 'technical' | 'logistics' } | null>(null);
  const [editText, setEditText] = useState('');
  const [editCategory, setEditCategory] = useState<'prep' | 'technical' | 'logistics'>('prep');
  
  const { checklist, toggleChecklistItem, addChecklistItem, updateChecklistItem, deleteChecklistItem, resetChecklist } = useAppStore();

  const filteredItems = filter === 'all' 
    ? checklist 
    : checklist.filter(item => item.category === filter);

  const completedCount = checklist.filter(i => i.done).length;
  const progress = checklist.length > 0 
    ? Math.round((completedCount / checklist.length) * 100) 
    : 0;

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    addChecklistItem(newItemText.trim(), newItemCategory);
    setNewItemText('');
  };

  const handleOpenEdit = (item: typeof checklist[0]) => {
    setEditingItem({ id: item.id, text: item.text, category: item.category });
    setEditText(item.text);
    setEditCategory(item.category);
  };

  const handleSaveEdit = () => {
    if (!editingItem || !editText.trim()) return;
    updateChecklistItem(editingItem.id, editText.trim(), editCategory);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: number) => {
    if (!confirm('Delete this item?')) return;
    deleteChecklistItem(id);
  };

  const categoryColors = {
    prep: 'bg-blue-500',
    technical: 'bg-purple-500',
    logistics: 'bg-green-500',
  };

  const categoryLabels = {
    prep: '📚 Prep',
    technical: '💻 Technical',
    logistics: '📋 Logistics',
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline" size="sm" className="gap-2">
        <CheckCircle2 className="h-4 w-4" />
        Checklist ({completedCount}/{checklist.length})
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Interview Checklist
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-bold">{completedCount}/{checklist.length} ({progress}%)</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              {(['all', 'prep', 'technical', 'logistics'] as const).map(f => (
                <Button
                  key={f}
                  variant={filter === f ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'All' : categoryLabels[f].split(' ')[0] + ' ' + f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
              <Button variant="outline" size="sm" onClick={resetChecklist} className="ml-auto text-destructive">
                <RotateCcw className="mr-1 h-3 w-3" />
                Reset
              </Button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    item.done 
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                      : 'bg-card border-border hover:border-primary/50'
                  }`}
                >
                  <div 
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
                      item.done 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-muted-foreground'
                    }`}
                  >
                    {item.done && <Check className="h-3 w-3" />}
                  </div>
                  <span 
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`flex-1 ${item.done ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {item.text}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[item.category]} text-white`}>
                    {item.category}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenEdit(item); }}
                      className="p-1 hover:bg-secondary rounded"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }}
                      className="p-1 hover:bg-secondary rounded text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add custom checklist item..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                className="flex-1"
              />
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as 'prep' | 'technical' | 'logistics')}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="prep">Prep</option>
                <option value="technical">Technical</option>
                <option value="logistics">Logistics</option>
              </select>
              <Button onClick={handleAddItem} disabled={!newItemText.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Checklist Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Item Text</label>
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Checklist item..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as 'prep' | 'technical' | 'logistics')}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="prep">Prep</option>
                <option value="technical">Technical</option>
                <option value="logistics">Logistics</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={!editText.trim()}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
