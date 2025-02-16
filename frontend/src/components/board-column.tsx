import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./task-card";
import { useTheme } from "next-themes";

interface Task {
  id: string;
  title: string;
  status_id: string; // Adicionar status_id
  image_url?: string;
}

interface BoardColumnProps {
  columnId: string;
  title: string;
  tasks: Task[];
  isSidebarOpen: boolean;
  onAddTask: () => void;
  onUpdateTask: (
    taskId: string,
    title: string,
    status_id: string,
    description?: string
  ) => void; // Atualizar signature
  onDeleteTask: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
}

const BoardColumn: React.FC<BoardColumnProps> = ({
  columnId,
  title,
  tasks = [],
  isSidebarOpen,
  onDeleteTask,
  onUpdateTask,
  onTaskClick,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`flex flex-col rounded-lg transition-all duration-300
      ${
        isSidebarOpen ? "w-[400px]" : "w-[582px]"
      } min-w-[350px] h-[calc(90vh-2rem)]
      overflow-y-auto-hover
      max-h-[calc(100vh-2rem)] mx-2 border
      shadow-md ${
        theme === "dark"
          ? "bg-zinc-900 border-zinc-800"
          : "bg-white border-gray-200"
      }`}
    >
      <div
        className={`p-4 font-semibold rounded-t-lg ${
          theme === "dark"
            ? "bg-zinc-800/80 text-white"
            : "bg-gray-100 text-black"
        }`}
      >
        {title}
      </div>
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-4 flex-1 overflow-y-auto ${
              snapshot.isDraggingOver ? "bg-gray-50 dark:bg-zinc-800/50" : ""
            }`}
          >
            {tasks.map((task, index) => (
              <div
                key={task.id}
                onClick={() => onTaskClick(task)}
                className="cursor-pointer" // Add this class to indicate clickability
              >
                <TaskCard
                  task={{
                    ...task,
                    status_id: columnId, // Usar diretamente o columnId como status
                  }}
                  index={index}
                  onDelete={onDeleteTask}
                  onUpdate={(taskId, title, status_id, description) => {
                    console.log("Updating task with status:", status_id); // Debug
                    onUpdateTask(
                      taskId,
                      title,
                      status_id || columnId,
                      description
                    );
                  }}
                />
              </div>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default BoardColumn;
