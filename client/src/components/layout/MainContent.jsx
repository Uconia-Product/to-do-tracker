import React from 'react';

export default function MainContent({ children }) {
  return (
    <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {children}
      </div>
    </main>
  );
}
