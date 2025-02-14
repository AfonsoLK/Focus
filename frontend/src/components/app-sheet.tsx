import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AddDescription } from "@/components/add-description";

interface TaskEditSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (title: string) => Promise<void>;
  onOpenChange?: (open: boolean) => void;
  taskTitle?: string;
  taskStatus?: string;
  taskDescription?: string;
  onSave?: (title: string, status_id: string, description?: string) => void;
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
  onSave,
  children,
}: TaskEditSheetProps) {
  const [title, setTitle] = useState(taskTitle);
  const [status, setStatus] = useState(taskStatus);
  const [description, setDescription] = useState(taskDescription);

  const handleSave = () => {
    if (onSave) {
      onSave(title, status, description);
    } else {
      onConfirm(title);
    }
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-lg semibold">
            Adicione o nome da tarefa
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
            initialDescription={taskDescription}
            onDescriptionChange={setDescription}
          />
        </div>

        <SheetFooter className="mt-4">
          <Button onClick={handleSave}>Salvar alterações</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
