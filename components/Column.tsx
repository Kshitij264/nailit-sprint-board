import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '@/types';
import TaskCard from './TaskCard';

type ColumnProps = {
  id: 'todo' | 'inprogress' | 'done';
  title: string;
  tasks: Task[];
  onMoveTask: (taskId: string, newStatus: Task['status']) => void;
};

export default function Column({ id, title, tasks, onMoveTask }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="w-full md:w-80 flex-shrink-0 bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <SortableContext
        id={id}
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="space-y-4 min-h-[100px]">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} onMoveTask={onMoveTask} />
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">No tasks here.</div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}