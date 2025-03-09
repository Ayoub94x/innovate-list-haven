
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Calendar } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NewTaskInputProps {
  onAddTask: (taskTitle: string, dueDate: Date | null, category: string) => void;
}

const categories = [
  "Lavoro", "Personale", "Salute", "Formazione", "Casa", "Benessere", "Altro"
];

const NewTaskInput: React.FC<NewTaskInputProps> = ({ onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [category, setCategory] = useState("Altro");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (taskTitle.trim()) {
      onAddTask(taskTitle.trim(), dueDate, category);
      setTaskTitle("");
      setDueDate(null);
      toast.success("Attività aggiunta");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-slide-up glass-card p-4">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Input
              placeholder="Aggiungi una nuova attività..."
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="pr-10 h-12 bg-background/70 backdrop-blur border-input/30 focus-visible:ring-primary"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                type="button" 
                variant="outline" 
                className={cn(
                  "justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : <span>Data di scadenza</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dueDate || undefined}
                onSelect={setDueDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            type="submit" 
            className="ml-auto hover:shadow transition-all duration-300 transform hover:translate-y-[-2px]"
            disabled={!taskTitle.trim()}
          >
            <Plus className="mr-2 h-5 w-5" />
            Aggiungi attività
          </Button>
        </div>
      </div>
    </form>
  );
};

export default NewTaskInput;
