
import React, { useState } from "react";
import { Check, Trash2, Clock, Target, AlertTriangle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "@/pages/Home";
import { toast } from "sonner";
import { format, isAfter } from "date-fns";
import { Badge } from "@/components/ui/badge";

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
    if (!task.completed) {
      toast.success("Obiettivo raggiunto! 🎉", {
        icon: "🏆",
      });
    } else {
      toast.success("Attività da completare");
    }
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

  // Check if task is overdue (past due date and not completed)
  const isOverdue = task.dueDate && !task.completed && isAfter(new Date(), task.dueDate);

  // Status icon logic
  const getStatusIcon = () => {
    if (task.completed) {
      return <Target className="h-5 w-5 text-green-500" />;
    } else if (isOverdue) {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    }
    return null;
  };

  return (
    <div
      className={cn(
        "group glass-card p-4 transition-all duration-300 hover:shadow-md animate-scale-in",
        task.completed && "bg-muted/50",
        isOverdue && !task.completed && "border-amber-300 border"
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
                : isOverdue
                ? "border-amber-500 hover:border-primary"
                : "border-muted-foreground/30 hover:border-primary"
            )}
          >
            {task.completed && <Check className="h-4 w-4" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3
                className={cn(
                  "text-base font-medium leading-tight break-words",
                  task.completed && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </h3>
              {getStatusIcon()}
            </div>
            
            {task.category && (
              <Badge variant="outline" className="mt-2 text-xs">
                {task.category}
              </Badge>
            )}
            
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                <span>Creato: {formatDate(task.createdAt)}</span>
              </div>
              
              {task.dueDate && (
                <div className={cn(
                  "flex items-center",
                  isOverdue && !task.completed && "text-amber-600 font-medium"
                )}>
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>Scadenza: {formatDate(task.dueDate)}</span>
                </div>
              )}
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
