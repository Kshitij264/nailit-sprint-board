'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task } from '@/types';
import TaskCard from '@/components/TaskCard';
import {
  DndContext,
  closestCorners,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

type Column = {
  id: 'todo' | 'inprogress' | 'done';
  title: string;
};

const columns: Column[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export default function BoardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3001/tasks');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    router.push('/login');
  };

  const getTasksByStatus = (status: Column['id']) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return; // Dropped outside a valid droppable area

    // Find the columns the active card and the over card belong to
    const activeTask = tasks.find((t) => t.id === active.id);
    const overTask = tasks.find((t) => t.id === over.id);

    if (!activeTask || !overTask) return;

    const activeColumn = activeTask.status;
    const overColumn = overTask.status;
    
    // If the card is dropped in a different column
    if (activeColumn !== overColumn) {
      setTasks((prevTasks) => {
        // Find the index of the active task
        const activeIndex = prevTasks.findIndex((t) => t.id === active.id);
        if (activeIndex === -1) return prevTasks;
        
        // Update the status of the active task
        prevTasks[activeIndex].status = overColumn;
        
        // This logic is simplified for now.
        // A more robust solution would re-order the items in the new list as well.
        return [...prevTasks];
      });
    }
  };


  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen flex-col bg-gray-900 text-white">
        <header className="flex items-center justify-between p-4 border-b-2 border-gray-700">
          <h1 className="text-2xl font-bold">Nailit Sprint Board</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </header>

        <main className="flex flex-grow p-4 space-x-4 overflow-x-auto">
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex-shrink-0 w-80 bg-gray-800 rounded-lg p-4"
            >
              <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
              <SortableContext
                items={getTasksByStatus(column.id).map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {getTasksByStatus(column.id).map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </SortableContext>
            </div>
          ))}
        </main>
      </div>
    </DndContext>
  );
}