import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddDescription } from "@/components/add-description";
import UploadImage from "./upload-image";

interface TaskEditSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    title: string,
    description?: string,
    image_url?: string
  ) => Promise<void>;
  onOpenChange?: (open: boolean) => void;
  taskTitle?: string;
  taskStatus?: string;
  taskDescription?: string;
  taskImageUrl?: string; // Add this prop
  onSave?: (
    title: string,
    status_id: string,
    description?: string,
    image_url?: string
  ) => void;
  children?: React.ReactNode;
}

export function TaskEditSheet({
  isOpen,
  onClose,
  onConfirm,
  onOpenChange,
  taskTitle = "",
  taskStatus = "",
  taskDescription = "",
  taskImageUrl,
  onSave,
  children,
}: TaskEditSheetProps) {
  const [title, setTitle] = useState(taskTitle);
  const [status, setStatus] = useState(taskStatus);
  const [description, setDescription] = useState(taskDescription);
  const [imageUrl, setImageUrl] = useState<string | undefined>(taskImageUrl);

  // Add this useEffect to update state when props change
  useEffect(() => {
    setTitle(taskTitle);
    setStatus(taskStatus);
    setDescription(taskDescription);
    setImageUrl(taskImageUrl);
  }, [taskTitle, taskStatus, taskDescription, taskImageUrl]);

  const handleSave = () => {
    if (onSave) {
      onSave(title, status, description, imageUrl);
    } else {
      onConfirm(title, description, imageUrl);
    }
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg semibold">
            {title ? "Editar tarefa" : "Adicionar tarefa"}
          </SheetTitle>
          <div className="py-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Nome da tarefa"
              maxLength={20}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
            />
          </div>
        </SheetHeader>

        <div className="space-y-4 py-4">
          <AddDescription
            initialDescription={description}
            onDescriptionChange={setDescription}
          />
          {imageUrl && (
            <div className="mt-4">
              <img
                src={imageUrl}
                alt="Task image"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}
          <UploadImage onUploadComplete={(url) => setImageUrl(url)} />
        </div>
        <SheetFooter className="mt-4">
          <Button onClick={handleSave}>Salvar alterações</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
