
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface NewTaskInputProps {
  onAddTask: (taskTitle: string) => void;
}

const NewTaskInput: React.FC<NewTaskInputProps> = ({ onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (taskTitle.trim()) {
      onAddTask(taskTitle.trim());
      setTaskTitle("");
      toast.success("Attività aggiunta");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-slide-up">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            placeholder="Aggiungi una nuova attività..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="pr-10 h-12 bg-background/70 backdrop-blur border-input/30 focus-visible:ring-primary"
          />
        </div>
        <Button 
          type="submit" 
          size="icon" 
          className="h-12 w-12 rounded-full shadow-sm hover:shadow transition-all duration-300 transform hover:translate-y-[-2px]"
          disabled={!taskTitle.trim()}
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Aggiungi attività</span>
        </Button>
      </div>
    </form>
  );
};

export default NewTaskInput;
