'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Task } from '@/types';
import Column from '@/components/Column';
import CreateTaskModal from '@/components/CreateTaskModal';
import TaskCardSkeleton from '@/components/TaskCardSkeleton';
import { DndContext, closestCorners, DragEndEvent } from '@dnd-kit/core';
import { Toaster, toast } from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type ColumnData = {
  id: 'todo' | 'inprogress' | 'done';
  title: string;
};

// ... (The rest of the file is identical)

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    
    // START OF THE ONLY CHANGE
    console.log("Attempting to fetch from:", API_BASE_URL);
    // END OF THE ONLY CHANGE

    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks.');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) router.push('/login');
    else fetchTasks();
  }, [router]);
  
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter((task) => priorityFilter === 'all' ? true : task.priority === priorityFilter);
  }, [tasks, searchQuery, priorityFilter]);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    router.push('/login');
  };
  
  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const optimisticTask: Task = { ...taskData, id: `temp-${Date.now()}`, status: 'todo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const originalTasks = [...tasks];
    setTasks((prev) => [...prev, optimisticTask]);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...taskData, status: 'todo' }) });
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
    setTasks((prevTasks) => { const activeIndex = prevTasks.findIndex((t) => t.id === taskId); if (activeIndex === -1) return prevTasks; const updatedTasks = [...prevTasks]; updatedTasks[activeIndex] = { ...updatedTasks[activeIndex], status: newStatus }; return updatedTasks; });
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
      if (!response.ok) throw new Error('Failed to update task status.');
      toast.success('Task moved successfully!');
    } catch (error) {
      toast.error('Failed to move task. Reverting.');
      setTasks(originalTasks);
    }
  };
  
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event; if (!over) return; const activeId = active.id as string; const overId = over.id as string; if (activeId === overId) return; const activeTask = tasks.find((t) => t.id === activeId); if (!activeTask) return; const overContainerId = over.data.current?.sortable?.containerId || over.id; const newStatus = columnData.find(c => c.id === overContainerId)?.id; if (!newStatus || activeTask.status === newStatus) return; handleMoveTask(activeId, newStatus);
  };

  const renderContent = () => {
    if (isLoading) {
      return columnData.map((column) => (
        <div key={column.id} className="w-full md:w-80 flex-shrink-0 bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
          <div className="space-y-4"><TaskCardSkeleton /><TaskCardSkeleton /></div>
        </div>
      ));
    }

    if (error) {
      return (
        <div className="text-center text-red-500 bg-gray-800 p-8 rounded-lg w-full">
          <h2 className="text-2xl font-bold mb-4">Error: {error}</h2>
          <button onClick={fetchTasks} className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700">
            Try Again
          </button>
        </div>
      );
    }

    return columnData.map((column) => (
      <Column
        key={column.id}
        id={column.id}
        title={column.title}
        tasks={filteredTasks.filter((task) => task.status === column.id)}
        onMoveTask={handleMoveTask}
      />
    ));
  };


  return (
    <>
      <Toaster position="bottom-right" />
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex h-screen flex-col bg-gray-900 text-white">
          <header className="flex items-center justify-between p-4 border-b-2 border-gray-700 flex-wrap gap-4">
            <h1 className="text-2xl font-bold">Nailit Sprint Board</h1>
            <div className="flex items-center gap-4">
               <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm" />
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm">
                <option value="all">All Priorities</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <CreateTaskModal onTaskCreate={handleCreateTask} />
              <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Logout</button>
            </div>
          </header>

          <main className="flex flex-col md:flex-row flex-grow p-4 md:space-x-4 space-y-4 md:space-y-0 overflow-x-auto">
            {renderContent()}
          </main>
        </div>
      </DndContext>
    </>
  );
}