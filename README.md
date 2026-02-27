This is the to do tracker for daily Uconia tasks

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** SQLite (better-sqlite3)

## Getting Started

### 1. Install server dependencies
```bash
cd server && npm install
```

### 2. Install client dependencies
```bash
cd client && npm install
```

### 3. Start the server (port 3001)
```bash
cd server && npm run dev
```

### 4. Start the client (port 5173)
```bash
cd client && npm run dev
```

Open http://localhost:5173

## Features
- Create, edit, delete tasks with inline editing
- Mark tasks complete with animations
- Projects with color-coding (sidebar navigation)
- Due dates with overdue highlighting
- Priority levels P1–P4 with color coding
- Inbox as default project
- Filter views: Today, Upcoming, All Tasks
- Subtasks (nested tasks)
- Drag-and-drop task reordering
- Dark mode toggle
- Data persists in SQLite