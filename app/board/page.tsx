'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task } from '@/types';
import TaskCard from '@/components/TaskCard';

export default function BoardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);

  // This effect runs when the component mounts to check for authentication
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  // This effect runs to fetch tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3001/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error(error);
        // Here you could set an error state to show a message to the user
      }
    };

    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    router.push('/login');
  };

  // Filter tasks for each column
  const todoTasks = tasks.filter((task) => task.status === 'todo');
  const inprogressTasks = tasks.filter((task) => task.status === 'inprogress');
  const doneTasks = tasks.filter((task) => task.status === 'done');

  return (
    <div className="flex h-screen flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b-2 border-gray-700">
        <h1 className="text-2xl font-bold">Nailit Sprint Board</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </header>

      {/* Board Columns */}
      <main className="flex flex-grow p-4 space-x-4 overflow-x-auto">
        {/* Todo Column */}
        <div className="flex-shrink-0 w-80 bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Todo</h2>
          <div className="space-y-4">
            {todoTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="flex-shrink-0 w-80 bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">In Progress</h2>
          <div className="space-y-4">
            {inprogressTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        {/* Done Column */}
        <div className="flex-shrink-0 w-80 bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Done</h2>
          <div className="space-y-4">
            {doneTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}