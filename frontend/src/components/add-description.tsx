import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bold, Italic, Underline } from "lucide-react";
import { useState } from "react";
import { ImageUpload } from "./image-upload";

interface AddDescriptionProps {
  onDescriptionChange: (description: string) => void;
  initialDescription?: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
}

interface TaskCardProps {
  task: Task;
  index: number;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, title: string, description?: string) => void;
}

export function AddDescription({
  onDescriptionChange,
  initialDescription = "",
}: AddDescriptionProps) {
  const [charCount, setCharCount] = useState(initialDescription.length);
  const [text, setText] = useState(initialDescription);
  const [format, setFormat] = useState<{
    bold: boolean;
    italic: boolean;
    underline: boolean;
  }>({
    bold: false,
    italic: false,
    underline: false,
  });
  const maxChars = 300;

  const handleToggle = (type: "bold" | "italic" | "underline") => {
    setFormat((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const getTextStyle = () => {
    return {
      fontWeight: format.bold ? "bold" : "normal",
      fontStyle: format.italic ? "italic" : "normal",
      textDecoration: format.underline ? "underline" : "none",
    };
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setCharCount(newText.length);
    onDescriptionChange(newText);
  };

  return (
    <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-1">
      <div className="flex overflow-auto mb-2">
        <ToggleGroup type="multiple">
          <ToggleGroupItem
            value="bold"
            aria-label="Toggle bold"
            onClick={() => handleToggle("bold")}
            className={format.bold ? "bg-gray-300" : ""}
          >
            <Bold className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="italic"
            aria-label="Toggle italic"
            onClick={() => handleToggle("italic")}
            className={format.italic ? "bg-gray-300" : ""}
          >
            <Italic className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="underline"
            aria-label="Toggle underline"
            onClick={() => handleToggle("underline")}
            className={format.underline ? "bg-gray-300" : ""}
          >
            <Underline className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="relative">
        <Textarea
          placeholder="Adicione uma descrição"
          className="mb-1 max-h-[200px] overflow-y-auto p-2 placeholder:font-normal placeholder:no-underline placeholder:not-italic"
          maxLength={maxChars}
          value={text}
          style={getTextStyle()}
          onChange={handleTextChange}
        />
        <div
          className={`text-xs text-right mb-3 ${
            charCount >= maxChars
              ? "text-red-500"
              : charCount >= maxChars * 0.9
              ? "text-amber-500"
              : "text-gray-500"
          }`}
        >
          {charCount}/{maxChars}
        </div>
        {/* <ImageUpload /> */}
      </div>
    </div>
  );
}
