import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';

// Helper to get priority color
const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
  switch (priority) {
    case 'low':
      return 'bg-green-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'high':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export default function TaskCard({ task }: { task: Task }) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-gray-700 rounded-lg p-4 shadow-md cursor-grab"
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