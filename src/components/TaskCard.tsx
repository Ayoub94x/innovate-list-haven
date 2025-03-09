
import React, { useState } from "react";
import { Check, Trash2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "@/pages/Home";
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onDelete,
  onToggleComplete,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    onDelete(task.id);
    toast.success("Attività eliminata");
  };

  const handleToggleComplete = () => {
    onToggleComplete(task.id);
    toast.success(task.completed ? "Attività da completare" : "Attività completata");
  };

  // Format the date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("it-IT", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div
      className={cn(
        "group glass-card p-4 transition-all duration-300 hover:shadow-md animate-scale-in",
        task.completed && "bg-muted/50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <button
            onClick={handleToggleComplete}
            className={cn(
              "flex-shrink-0 mt-0.5 h-6 w-6 rounded-full flex items-center justify-center border-2 transition-colors duration-200",
              task.completed
                ? "bg-primary border-primary text-white"
                : "border-muted-foreground/30 hover:border-primary"
            )}
          >
            {task.completed && <Check className="h-4 w-4" />}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "text-base font-medium leading-tight break-words",
                task.completed && "line-through text-muted-foreground"
              )}
            >
              {task.title}
            </h3>
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              <span>{formatDate(task.createdAt)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className={cn(
            "text-muted-foreground/60 hover:text-destructive transition-all duration-200 h-8 w-8 rounded-full flex items-center justify-center",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
