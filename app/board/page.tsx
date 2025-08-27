export default function BoardPage() {
  return (
    <div className="flex h-screen flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="p-4 border-b-2 border-gray-700">
        <h1 className="text-2xl font-bold">Nailit Sprint Board</h1>
      </header>

      {/* Board Columns */}
      <main className="flex flex-grow p-4 space-x-4 overflow-x-auto">
        {/* Todo Column */}
        <div className="flex-shrink-0 w-80 bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Todo</h2>
          <div className="space-y-4">
            {/* Task cards will go here */}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="flex-shrink-0 w-80 bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">In Progress</h2>
          <div className="space-y-4">
            {/* Task cards will go here */}
          </div>
        </div>

        {/* Done Column */}
        <div className="flex-shrink-0 w-80 bg-gray-800 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Done</h2>
          <div className="space-y-4">
            {/* Task cards will go here */}
          </div>
        </div>
      </main>
    </div>
  );
}