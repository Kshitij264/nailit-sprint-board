import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';
import { KeyboardEvent } from 'react';

// The order of columns for keyboard navigation
const columnOrder: Task['status'][] = ['todo', 'inprogress', 'done'];

// Helper to get priority color
const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'low': return 'bg-green-500';
    case 'medium': return 'bg-yellow-500';
    case 'high': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

type TaskCardProps = {
  task: Task;
  onMoveTask: (taskId: string, newStatus: Task['status']) => void;
};

export default function TaskCard({ task, onMoveTask }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === '[' || e.key === ']') {
      e.preventDefault(); // Prevent typing the character if in a text field
      const currentIndex = columnOrder.indexOf(task.status);

      let newIndex;
      if (e.key === '[') { // Move left
        newIndex = Math.max(0, currentIndex - 1);
      } else { // Move right
        newIndex = Math.min(columnOrder.length - 1, currentIndex + 1);
      }
      
      if (newIndex !== currentIndex) {
        onMoveTask(task.id, columnOrder[newIndex]);
      }
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      tabIndex={0} // Makes the card focusable
      onKeyDown={handleKeyDown} // Adds keyboard listener
      className="bg-gray-700 rounded-lg p-4 shadow-md cursor-grab focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <h3 className="font-bold text-lg mb-2">{task.title}</h3>
      <p className="text-gray-300 text-sm mb-3">{task.description}</p>
      <div
        className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded-full ${getPriorityColor(
          task.priority
        )}`}
      >
        {task.priority}
      </div>
    </div>
  );
}