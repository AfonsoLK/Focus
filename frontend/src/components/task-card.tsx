import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { CircleX, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TaskEditSheet } from "@/components/app-sheet";

interface Task {
  id: string;
  title: string;
  description?: string;
  status_id: string; // Atualizar para status_id
}

interface TaskCardProps {
  task: Task;
  index: number;
  onDelete: (taskId: string) => void;
  onUpdate: (
    taskId: string,
    title: string,
    status_id: string,
    description?: string
  ) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  onDelete,
  onUpdate,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSave = (title: string, status_id: string) => {
    console.log("TaskCard handleSave:", { title, status_id }); // Debug
    onUpdate(task.id, title, status_id);
  };

  return (
    <Draggable draggableId={String(task.id)} index={index}>
      {(provided, snapshot) => (
        <TaskEditSheet
          isOpen={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          taskTitle={task.title}
          taskStatus={task.status_id}
          onSave={handleSave}
        >
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`p-3 mb-2 transition-colors cursor-pointer ${
              snapshot.isDragging
                ? "shadow-lg"
                : "hover:bg-gray-200 dark:hover:bg-zinc-700"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-left">
                {task.title}
              </span>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="p-1 rounded-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CircleX className="w-5 h-5 hover:text-red-500" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Apagar Tarefa</AlertDialogTitle>
                    <AlertDialogDescription>
                      Você tem certeza que deseja apagar essa tarefa? Essa ação
                      não poderá ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className=" hover:bg-red-500"
                      onClick={() => onDelete(task.id)}
                    >
                      Apagar
                      <Trash2 />
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Card>
        </TaskEditSheet>
      )}
    </Draggable>
  );
};

export default TaskCard;
