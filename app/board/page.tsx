'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Task } from '@/types';
import Column from '@/components/Column';
import CreateTaskModal from '@/components/CreateTaskModal';
import { DndContext, closestCorners, DragEndEvent } from '@dnd-kit/core';
import { Toaster, toast } from 'react-hot-toast';

type ColumnData = {
  id: 'todo' | 'inprogress' | 'done';
  title: string;
};

const columnData: ColumnData[] = [
  { id: 'todo', title: 'Todo' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export default function BoardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) router.push('/login');
  }, [router]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3001/tasks');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        toast.error('Failed to fetch tasks.');
      }
    };
    fetchTasks();
  }, []);
  
  // Memoize the filtered tasks to avoid re-calculating on every render
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((task) =>
        priorityFilter === 'all' ? true : task.priority === priorityFilter
      );
  }, [tasks, searchQuery, priorityFilter]);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    router.push('/login');
  };
  
  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const optimisticTask: Task = {
      ...taskData,
      id: `temp-${Date.now()}`,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const originalTasks = [...tasks];
    setTasks((prev) => [...prev, optimisticTask]);
    try {
      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...taskData, status: 'todo' }),
      });
      if (!response.ok) throw new Error('Failed to create task.');
      const newTask = await response.json();
      setTasks((prev) => prev.map((t) => (t.id === optimisticTask.id ? newTask : t)));
      toast.success('Task created successfully!');
    } catch (error) {
      toast.error('Failed to create task. Reverting.');
      setTasks(originalTasks);
    }
  };

  const handleMoveTask = async (taskId: string, newStatus: Task['status']) => {
    const originalTasks = [...tasks];
    setTasks((prevTasks) => {
      const activeIndex = prevTasks.findIndex((t) => t.id === taskId);
      if (activeIndex === -1) return prevTasks;
      const updatedTasks = [...prevTasks];
      updatedTasks[activeIndex] = { ...updatedTasks[activeIndex], status: newStatus };
      return updatedTasks;
    });

    try {
      const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update task status.');
      toast.success('Task moved successfully!');
    } catch (error) {
      toast.error('Failed to move task. Reverting.');
      setTasks(originalTasks);
    }
  };
  
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;
    const overContainerId = over.data.current?.sortable?.containerId || over.id;
    const newStatus = columnData.find(c => c.id === overContainerId)?.id;
    if (!newStatus || activeTask.status === newStatus) return;
    handleMoveTask(activeId, newStatus);
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex h-screen flex-col bg-gray-900 text-white">
          <header className="flex items-center justify-between p-4 border-b-2 border-gray-700 flex-wrap gap-4">
            <h1 className="text-2xl font-bold">Nailit Sprint Board</h1>
            
            <div className="flex items-center gap-4">
               <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm"
              />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <CreateTaskModal onTaskCreate={handleCreateTask} />
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </header>

          <main className="flex flex-grow p-4 space-x-4 overflow-x-auto">
            {columnData.map((column) => (
              <Column
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={filteredTasks.filter((task) => task.status === column.id)}
                onMoveTask={handleMoveTask}
              />
            ))}
          </main>
        </div>
      </DndContext>
    </>
  );
}