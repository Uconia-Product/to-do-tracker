import React from 'react';
import { useLocation } from 'react-router-dom';

// Pages that need full-width layout (no max-width centering)
const FULL_WIDTH_ROUTES = ['/upcoming'];

export default function MainContent({ children }) {
  const { pathname } = useLocation();
  const isFullWidth = FULL_WIDTH_ROUTES.includes(pathname);

  return (
    <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
      <div className={isFullWidth ? 'w-full px-6 py-8' : 'max-w-2xl mx-auto px-6 py-8'}>
        {children}
      </div>
    </main>
  );
}
