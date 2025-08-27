'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BoardPage() {
  const router = useRouter();

  // This effect runs when the component mounts to check for authentication
  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    router.push('/login');
  };

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
          <div className="space-y-4">{/* Task cards will go here */}</div>
        </div>

        {/* In Progress Column */}
        <div className="flex-shrink-0 w-80 bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">In Progress</h2>
          <div className="space-y-4">{/* Task cards will go here */}</div>
        </div>

        {/* Done Column */}
        <div className="flex-shrink-0 w-80 bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Done</h2>
          <div className="space-y-4">{/* Task cards will go here */}</div>
        </div>
      </main>
    </div>
  );
}