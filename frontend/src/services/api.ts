import axios from "axios";

const API_URL = "http://localhost:8000/api/";

export const api = axios.create({
  baseURL: API_URL,
});

export const getTasks = async () => {
  const response = await api.get("/tasks/");
  return response.data;
};

export const createTask = async (title: string, statusId?: string) => {
  try {
    const response = await api.post("/tasks/", {
      titulo: title,
      status_id: statusId || "1", // default para Pendente
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 422) {
      console.error("Erro de validação ao criar task", error.response.data);
    }
    throw error;
  }
};

export const updateTask = async (
  taskId: string,
  title: string,
  description?: string,
  statusId?: string
) => {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  const updateData: Record<string, any> = {
    titulo: title,
  };

  if (description !== undefined) {
    updateData.descricao = description;
  }

  if (statusId !== undefined) {
    updateData.status_id = statusId;
  }

  console.log(updateData);

  const response = await api.put(`/tasks/${String(taskId)}/`, updateData);
  return response.data;
};

export const deleteTask = async (taskId: string) => {
  try {
    await api.delete(`/tasks/${taskId}/`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 422) {
      console.error("Erro de validação ao deletar task", error.response.data);
    }
    throw error;
  }
};
