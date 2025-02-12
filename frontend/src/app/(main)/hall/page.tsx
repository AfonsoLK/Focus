"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { getTasks, createTask, updateTask, deleteTask } from "@/services/api";
import { StatusSelect } from "@/components/status-select";
import { Input } from "@/components/ui/input";

const BoardColumn = dynamic(() => import("@/components/board-column"), {
  ssr: false,
});

interface Task {
  id: string;
  title: string;
  status_id: string;
}

interface BoardData {
  [key: string]: Task[];
}

const statusIdToColumn: Record<string, string> = {
  "1": "Pendente",
  "2": "Em Progresso",
  "3": "Concluído",
};

const columnToStatusId: Record<string, string> = {
  Pendente: "1",
  "Em Progresso": "2",
  Concluído: "3",
};

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [boardData, setBoardData] = useState<BoardData>({
    Pendente: [],
    "Em Progresso": [],
    Concluído: [],
  });

  const [status, setStatus] = useState("all");

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksFromAPI = await getTasks();
      const newBoardData: BoardData = {
        Pendente: [],
        "Em Progresso": [],
        Concluído: [],
      };

      tasksFromAPI.forEach((task: any) => {
        const column = statusIdToColumn[task.status_id] || "Pendente";
        newBoardData[column].push({
          id: task.id,
          title: task.titulo,
          status_id: task.status_id,
        });
      });

      setBoardData(newBoardData);
    };

    fetchTasks();
  }, []);

  const handleAddTask = async (column: string) => {
    try {
      const statusId = columnToStatusId[column];
      const newTask = await createTask("Nova tarefa", statusId);
      setBoardData((prev) => ({
        ...prev,
        [column]: [
          ...prev[column],
          {
            id: newTask.id,
            title: newTask.titulo,
            status_id: statusId,
          },
        ],
      }));

      toast.success("Nova tarefa adicionada");
    } catch (error) {
      if ((error as any).response?.status === 422) {
        toast.error("Erro de validação ao criar tarefa");
      } else {
        toast.error("Erro ao criar tarefa");
      }
    }
  };

  const handleUpdateTask = async (taskId: string, title: string) => {
    await updateTask(taskId, title);

    setBoardData((prevBoard) => {
      const updatedBoard = { ...prevBoard };
      for (const column in updatedBoard) {
        const taskIndex = updatedBoard[column].findIndex(
          (task) => task.id === taskId
        );
        if (taskIndex !== -1) {
          updatedBoard[column][taskIndex] = {
            ...updatedBoard[column][taskIndex],
            title,
          };
          break;
        }
      }
      return updatedBoard;
    });
  };

  const handleDeleteTask = async (taskId: string, column: string) => {
    await deleteTask(taskId);

    setBoardData((prevBoard) => {
      const updatedBoard = { ...prevBoard };
      updatedBoard[column] = updatedBoard[column].filter(
        (task) => task.id !== taskId
      );
      return updatedBoard;
    });
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceColumn = source.droppableId;
    const destinationColumn = destination.droppableId;
    const destinationStatusId = columnToStatusId[destinationColumn];

    setBoardData((prev) => {
      const newBoardData = { ...prev };
      const task = newBoardData[sourceColumn].find(
        (t) => String(t.id) === draggableId
      );

      if (task) {
        newBoardData[sourceColumn] = newBoardData[sourceColumn].filter(
          (t) => String(t.id) !== draggableId
        );

        const destinationTasks = Array.from(newBoardData[destinationColumn]);
        destinationTasks.splice(destination.index, 0, task);
        newBoardData[destinationColumn] = destinationTasks;

        updateTask(draggableId, task.title, destinationStatusId)
          .then(() => toast.success(`Card movido para ${destinationColumn}`))
          .catch(() => {
            setBoardData(prev);
          });
      }

      return newBoardData;
    });
  };

  const filteredBoardData = Object.fromEntries(
    Object.entries(boardData).map(([column, tasks]) => {
      let filteredTasks = [...tasks];

      if (status !== "all") {
        const columnStatus = columnToStatusId[column];
        if (columnStatus !== status) {
          filteredTasks = [];
        }
      }

      filteredTasks = filteredTasks.filter((task) =>
        task.title.toLowerCase().includes(searchValue.toLowerCase())
      );

      return [column, filteredTasks];
    })
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-board p-4">
        <div className="flex items-center gap-4 mb-6 ml-4">
          <h1 className="text-2xl font-bold">Tarefas</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => handleAddTask("Pendente")}
              variant="default"
              className="justify-start"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar tarefa
            </Button>
            <Input
              className="w-64"
              placeholder="Buscar"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <StatusSelect status={status} onChange={setStatus} />
          </div>
        </div>
        <div className="flex gap-4 pb-4 overflow-x-auto">
          {Object.entries(filteredBoardData).map(([columnTitle, tasks]) => (
            <BoardColumn
              key={columnTitle}
              columnId={columnTitle}
              title={columnTitle}
              tasks={tasks}
              isSidebarOpen={isSidebarOpen}
              onAddTask={() => handleAddTask(columnTitle)}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={(taskId) => handleDeleteTask(taskId, columnTitle)}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};
export default Index;
