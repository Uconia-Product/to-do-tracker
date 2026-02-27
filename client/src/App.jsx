import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { TaskProvider } from './context/TaskContext';
import Sidebar from './components/layout/Sidebar';
import MainContent from './components/layout/MainContent';
import Inbox from './pages/Inbox';
import Today from './pages/Today';
import Upcoming from './pages/Upcoming';
import AllTasks from './pages/AllTasks';
import ProjectView from './pages/ProjectView';

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <BrowserRouter>
          <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
            <Sidebar />
            <MainContent>
              <Routes>
                <Route path="/" element={<Navigate to="/inbox" replace />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/today" element={<Today />} />
                <Route path="/upcoming" element={<Upcoming />} />
                <Route path="/all" element={<AllTasks />} />
                <Route path="/project/:id" element={<ProjectView />} />
              </Routes>
            </MainContent>
          </div>
        </BrowserRouter>
      </TaskProvider>
    </ThemeProvider>
  );
}
