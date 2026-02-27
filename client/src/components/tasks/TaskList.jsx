import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskItem from './TaskItem';
import { reorderTask } from '../../api/tasks';

export default function TaskList({ tasks, onReorder }) {
  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const [showCompleted, setShowCompleted] = useState(false);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.index === destination.index) return;

    onReorder?.(source.index, destination.index);
    await reorderTask(Number(draggableId), destination.index);
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 text-gray-300 dark:text-gray-600 select-none">
        <div className="text-5xl mb-3">✓</div>
        <p className="text-sm">No tasks here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="active-tasks">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {activeTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} className="group">
                      <TaskItem task={task} provided={provided} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {completedTasks.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted(s => !s)}
            className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <span>{showCompleted ? '▾' : '▸'}</span>
            Completed ({completedTasks.length})
          </button>
          {showCompleted && (
            <div className="space-y-2">
              {completedTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
