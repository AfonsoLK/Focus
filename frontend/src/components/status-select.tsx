import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StatusSelect({
  status,
  onChange,
}: {
  status: string;
  onChange: (status: string) => void;
}) {
  const handleValueChange = (newValue: string) => {
    if (newValue === status) {
      onChange("all"); // Reset to "all" instead of empty string
    } else {
      onChange(newValue);
    }
  };

  return (
    <Select value={status} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filtrar por status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todas</SelectItem>
        <SelectItem value="Pendente">Pendente</SelectItem>
        <SelectItem value="Em Progresso">Em Progresso</SelectItem>
        <SelectItem value="Concluído">Concluído</SelectItem>
      </SelectContent>
    </Select>
  );
}
