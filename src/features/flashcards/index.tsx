import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea } from '../../components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { ChevronLeft, ChevronRight, RotateCw, X, Plus, Check, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store';

export function Flashcards() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState<'all' | 'known' | 'unknown'>('all');
  const [showEdit, setShowEdit] = useState(false);
  const [editingCard, setEditingCard] = useState<{ q: string; a: string; tag: string } | null>(null);
  
  const { flashcards, toggleFlashcardKnown, addFlashcard, updateFlashcard, deleteFlashcard } = useAppStore();

  const filteredCards = filter === 'known' 
    ? flashcards.filter(c => c.known)
    : filter === 'unknown'
      ? flashcards.filter(c => !c.known)
      : flashcards;

  const lastFilteredLength = useRef(filteredCards.length);

  useEffect(() => {
    if (lastFilteredLength.current > filteredCards.length && currentIndex >= filteredCards.length && filteredCards.length > 0) {
      setCurrentIndex(filteredCards.length - 1);
    }
    lastFilteredLength.current = filteredCards.length;
  }, [filteredCards.length, currentIndex]);

  const currentCard = filteredCards[currentIndex];
  const knownCount = flashcards.filter(c => c.known).length;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    if (e.key === 'ArrowLeft') {
      setCurrentIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
      setIsFlipped(false);
    } else if (e.key === 'ArrowRight') {
      setCurrentIndex(prev => (prev + 1) % filteredCards.length);
      setIsFlipped(false);
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsFlipped(!isFlipped);
    } else if (e.key === 'k') {
      if (currentCard) toggleFlashcardKnown(currentCard.id);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, [isOpen, isFlipped, filteredCards.length, currentCard, toggleFlashcardKnown]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleFlip = () => setIsFlipped(!isFlipped);
  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
    setIsFlipped(false);
  };
  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % filteredCards.length);
    setIsFlipped(false);
  };
  const handleShuffle = () => {
    setCurrentIndex(Math.floor(Math.random() * filteredCards.length));
    setIsFlipped(false);
  };

  const handleSaveCard = () => {
    if (!editingCard || !editingCard.q.trim() || !editingCard.a.trim()) return;
    
    if (currentCard) {
      updateFlashcard(currentCard.id, editingCard);
    } else {
      addFlashcard(editingCard.q, editingCard.a, editingCard.tag);
    }
    
    setShowEdit(false);
    setEditingCard(null);
  };

  const handleAddNew = () => {
    setEditingCard({ q: '', a: '', tag: '' });
    setShowEdit(true);
  };

  const handleEditCurrent = () => {
    if (currentCard) {
      setEditingCard({ q: currentCard.q, a: currentCard.a, tag: currentCard.tag });
      setShowEdit(true);
    }
  };

  const handleDeleteCurrent = () => {
    if (currentCard && confirm('Delete this flashcard?')) {
      deleteFlashcard(currentCard.id);
      if (currentIndex >= filteredCards.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline" size="sm" className="gap-2">
        🃏 Flashcards ({knownCount}/{flashcards.length})
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                🃏 Flashcards
                <span className="text-sm font-normal text-muted-foreground">
                  Card {filteredCards.length > 0 ? currentIndex + 1 : 0} of {filteredCards.length}
                </span>
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex items-center justify-between py-2">
            <div className="flex gap-1">
              {(['all', 'unknown', 'known'] as const).map(f => (
                <Button
                  key={f}
                  variant={filter === f ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => { setFilter(f); setCurrentIndex(0); setIsFlipped(false); }}
                >
                  {f === 'all' ? 'All' : f === 'known' ? '✅ Known' : '⚡ Review'}
                </Button>
              ))}
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={handleShuffle} title="Shuffle">
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleAddNew}>
                <Plus className="h-4 w-4" />
              </Button>
              {currentCard && (
                <>
                  <Button variant="outline" size="sm" onClick={handleEditCurrent}>
                    ✏️
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDeleteCurrent} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showEdit && editingCard && (
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Edit Card</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Question</label>
                  <Textarea
                    value={editingCard.q}
                    onChange={(e) => setEditingCard({ ...editingCard, q: e.target.value })}
                    placeholder="Enter question..."
                    rows={2}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Answer</label>
                  <Textarea
                    value={editingCard.a}
                    onChange={(e) => setEditingCard({ ...editingCard, a: e.target.value })}
                    placeholder="Enter answer..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tag</label>
                  <Input
                    value={editingCard.tag}
                    onChange={(e) => setEditingCard({ ...editingCard, tag: e.target.value })}
                    placeholder="e.g., SQL, DWH, ETL"
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveCard}>Save</Button>
                  <Button variant="outline" onClick={() => { setShowEdit(false); setEditingCard(null); }}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex-1 overflow-auto">
            {filteredCards.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <p>No flashcards yet</p>
                <Button className="mt-4" onClick={handleAddNew}>Add your first card</Button>
              </div>
            ) : currentCard ? (
              <div 
                onClick={handleFlip}
                className={`relative min-h-[280px] rounded-xl border-2 cursor-pointer transition-all duration-300 p-8 flex flex-col items-center justify-center text-center ${
                  isFlipped 
                    ? 'bg-green-50 dark:bg-green-950/20 border-green-500' 
                    : currentCard.known 
                      ? 'bg-green-50/50 border-green-300 dark:border-green-700'
                      : 'bg-card border-primary'
                }`}
              >
                <div className="absolute top-2 left-3 text-xs text-muted-foreground">
                  {isFlipped ? '💡 Answer' : '❓ Question'}
                </div>
                {currentCard.tag && (
                  <div className="absolute top-2 right-3 text-xs px-2 py-0.5 rounded bg-muted">
                    {currentCard.tag}
                  </div>
                )}
                
                <p className="text-lg font-medium whitespace-pre-wrap">
                  {isFlipped ? currentCard.a : currentCard.q}
                </p>
                
                <div className="absolute bottom-2 text-xs text-muted-foreground">
                  {currentCard.known && <span className="text-green-500">✅ Known</span>}
                  {!currentCard.known && <span>Click or Space to flip</span>}
                </div>
              </div>
            ) : null}

            {isFlipped && currentCard && (
              <div className="flex justify-center gap-4 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => toggleFlashcardKnown(currentCard.id)}
                  className={currentCard.known ? 'border-green-500 text-green-500' : ''}
                >
                  ⚡ Still Learning
                </Button>
                <Button 
                  variant="default"
                  onClick={() => toggleFlashcardKnown(currentCard.id)}
                  className={!currentCard.known ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Got It!
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t mt-4">
            <Button variant="outline" size="sm" onClick={handlePrev} disabled={filteredCards.length <= 1}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>
            <div className="flex gap-1">
              {filteredCards.slice(0, Math.min(15, filteredCards.length)).map((_, i) => (
                <div
                  key={i}
                  onClick={() => { setCurrentIndex(i); setIsFlipped(false); }}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                    i === currentIndex 
                      ? 'bg-primary' 
                      : filteredCards[i]?.known 
                        ? 'bg-green-500' 
                        : 'bg-muted'
                  }`}
                />
              ))}
              {filteredCards.length > 15 && (
                <span className="text-xs text-muted-foreground ml-1">+{filteredCards.length - 15}</span>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={handleNext} disabled={filteredCards.length <= 1}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center mt-2">
            ← → navigate · Space = flip · K = mark known · Esc = close
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
