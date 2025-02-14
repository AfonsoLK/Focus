"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { StatusSelect } from "@/components/status-select";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { TarefasService } from "../../../../services";
import { TaskEditSheet } from "@/components/app-sheet";

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

const queryClient = new QueryClient();

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [boardData, setBoardData] = useState<BoardData>({
    Pendente: [],
    "Em Progresso": [],
    Concluído: [],
  });

  const [status, setStatus] = useState("all");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [pendingColumn, setPendingColumn] = useState<string | null>(null);

  const { data: response, refetch } = useQuery({
    queryKey: ["tasks"],
    queryFn: TarefasService.listarTasks,
    refetchInterval: 1000 * 60,
  });

  console.log(response);

  const criarTaskMutation = useMutation({
    mutationFn: TarefasService.criarTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await refetch();
      toast.success("Nova tarefa adicionada");
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        toast.error("Erro de validação ao criar tarefa");
      } else {
        toast.error("Erro ao criar tarefa");
      }
    },
  });

  const atualizarTaskMutation = useMutation({
    mutationFn: TarefasService.atualizarTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await refetch();
      toast.success("Tarefa atualizada");
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        toast.error("Erro de validação ao atualizar tarefa");
      } else {
        toast.error("Erro ao atualizar tarefa");
      }
    },
  });

  const deletarTaskMutation = useMutation({
    mutationFn: TarefasService.deletarTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await refetch();
      toast.success("Tarefa apagada");
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        toast.error("Erro de validação ao apagar tarefa");
      } else {
        toast.error("Erro ao apagar tarefa");
      }
    },
  });

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deletarTaskMutation.mutateAsync({
        taskId: Number(taskId),
      });
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const handleUpdateTask = async (
    taskId: string,
    title: string,
    statusId?: string
  ) => {
    try {
      await atualizarTaskMutation.mutateAsync({
        taskId: Number(taskId),
        requestBody: {
          titulo: title,
          status_id: statusId ? Number(statusId) : undefined,
        },
      });
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  const handleAddTask = (column: string) => {
    setPendingColumn(column);
    setIsSheetOpen(true);
  };

  const handleConfirmAdd = async (title: string) => {
    if (!pendingColumn) return;

    try {
      const statusId = columnToStatusId[pendingColumn];
      await criarTaskMutation.mutateAsync({
        requestBody: {
          titulo: title,
          status_id: Number(statusId),
        },
      });
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  };

  useEffect(() => {
    if (response) {
      const initialBoardData: BoardData = {
        Pendente: [],
        "Em Progresso": [],
        Concluído: [],
      };

      response.forEach((task) => {
        const column = task.status_id
          ? statusIdToColumn[String(task.status_id)]
          : "Pendente";

        if (column) {
          initialBoardData[column].push({
            id: String(task.id),
            title: task.titulo,
            status_id: String(task.status_id ?? 1),
          });
        }
      });

      setBoardData(initialBoardData);
    }
  }, [response]);

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

        handleUpdateTask(draggableId, task.title, destinationStatusId)
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

      // First apply text search if exists
      if (searchValue.trim()) {
        const searchTerm = searchValue.toLowerCase().trim();
        filteredTasks = filteredTasks.filter(
          (task) =>
            task.title.toLowerCase().includes(searchTerm) ||
            task.id.toLowerCase().includes(searchTerm)
        );
      }

      // Then filter by status if not "all"
      if (status !== "all") {
        return [
          column,
          columnToStatusId[column] === status ? filteredTasks : [],
        ];
      }

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
              onDeleteTask={(taskId) => handleDeleteTask(taskId)}
            />
          ))}
        </div>
      </div>
      <TaskEditSheet
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false);
          setPendingColumn(null);
        }}
        onConfirm={handleConfirmAdd}
        taskTitle=""
        taskStatus=""
      />
    </DragDropContext>
  );
};

export default Index;
