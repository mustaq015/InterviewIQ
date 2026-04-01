import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export interface DraggableItem {
  id: string;
  [key: string]: unknown;
}

interface DraggableCardProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  dragHandleClassName?: string;
  showDragHandle?: boolean;
  disabled?: boolean;
}

export function DraggableCard({ 
  id, 
  children, 
  className = '', 
  dragHandleClassName = '',
  showDragHandle = true,
  disabled = false 
}: DraggableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${className} ${isDragging ? 'z-50 shadow-lg' : ''}`}
    >
      <div className="flex">
        {showDragHandle && (
          <button
            {...attributes}
            {...listeners}
            className={`flex-shrink-0 flex items-center justify-center p-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground ${dragHandleClassName}`}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

interface DraggableListProps<T extends DraggableItem> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  className?: string;
  itemClassName?: string;
}

export function DraggableList<T extends DraggableItem>({
  items,
  onReorder,
  renderItem,
  keyExtractor,
  className = '',
  itemClassName = '',
}: DraggableListProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => keyExtractor(item) === active.id);
      const newIndex = items.findIndex(item => keyExtractor(item) === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = [...items];
        const [removed] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removed);
        onReorder(newItems);
      }
    }
  };

  const activeItem = activeId ? items.find(item => keyExtractor(item) === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map(keyExtractor)} strategy={verticalListSortingStrategy}>
        <div className={className}>
          {items.map((item, index) => (
            <div key={keyExtractor(item)} className={itemClassName}>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeItem ? (
          <div className="opacity-80 shadow-lg rounded-lg bg-card border">
            {renderItem(activeItem, items.findIndex(item => keyExtractor(item) === activeId))}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export function SortableItem({ 
  id, 
  children, 
  className = '' 
}: { 
  id: string; 
  children: React.ReactNode; 
  className?: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={className}>
      <div className="flex">
        <button
          {...attributes}
          {...listeners}
          className="flex-shrink-0 flex items-center justify-center p-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
