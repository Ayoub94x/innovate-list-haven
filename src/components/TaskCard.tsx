
import React, { useState, useEffect, useRef } from "react";
import { Check, Trash2, Clock, Target, AlertTriangle, Calendar, Gauge, FileText, PlayCircle, PauseCircle, Trophy, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "@/pages/Home";
import { toast } from "sonner";
import { format, isAfter } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onUpdateTimeSpent?: (id: string, minutes: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onDelete,
  onToggleComplete,
  onUpdateTimeSpent,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const trackingInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackingStartTime = useRef<number | null>(null);

  const handleDelete = () => {
    onDelete(task.id);
    toast.success("Attività eliminata");
  };

  const handleToggleComplete = () => {
    // Interrompiamo il tracciamento se è attivo
    if (isTracking) {
      stopTracking();
    }
    
    onToggleComplete(task.id);
    if (!task.completed) {
      toast.success("Obiettivo raggiunto! 🎉", {
        icon: <Trophy className="h-5 w-5 text-amber-500" />,
      });
    } else {
      toast.success("Attività da completare");
    }
  };

  // Funzioni per il tracciamento del tempo
  const startTracking = () => {
    if (!isTracking && !task.completed) {
      setIsTracking(true);
      trackingStartTime.current = Date.now();
      
      trackingInterval.current = setInterval(() => {
        if (trackingStartTime.current) {
          const seconds = Math.floor((Date.now() - trackingStartTime.current) / 1000);
          setElapsedTime(seconds);
        }
      }, 1000);
      
      toast.info("Tracciamento tempo avviato", {
        description: `Stai lavorando su: ${task.title}`,
        icon: <PlayCircle className="h-5 w-5 text-green-500" />
      });
    }
  };
  
  const stopTracking = () => {
    if (isTracking && trackingInterval.current && trackingStartTime.current) {
      clearInterval(trackingInterval.current);
      const minutes = Math.floor((Date.now() - trackingStartTime.current) / 60000);
      
      if (minutes > 0 && onUpdateTimeSpent) {
        onUpdateTimeSpent(task.id, minutes);
      }
      
      setIsTracking(false);
      setElapsedTime(0);
      trackingStartTime.current = null;
      
      toast.info("Tracciamento tempo fermato", {
        description: `Hai lavorato su "${task.title}" per ${formatTime(minutes * 60)}`,
        icon: <PauseCircle className="h-5 w-5 text-amber-500" />
      });
    }
  };
  
  // Formattazione del tempo
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };
  
  // Formattazione del tempo speso totale
  const formatTimeSpent = (minutes: number | undefined) => {
    if (!minutes) return "0m";
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    } else {
      return `${mins}m`;
    }
  };

  // Pulizia dell'intervallo quando il componente viene smontato
  useEffect(() => {
    return () => {
      if (trackingInterval.current) {
        clearInterval(trackingInterval.current);
      }
    };
  }, []);

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
      return <Trophy className="h-5 w-5 text-amber-500" />;
    } else if (isOverdue) {
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    }
    return null;
  };

  // Priority color logic
  const getPriorityColor = () => {
    switch (task.priority) {
      case "Alta":
        return "text-red-500 border-red-300";
      case "Media":
        return "text-amber-500 border-amber-300";
      case "Bassa":
        return "text-green-500 border-green-300";
      default:
        return "text-muted-foreground border-muted";
    }
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
            
            <div className="flex flex-wrap gap-2 mt-2">
              {task.category && (
                <Badge variant="outline" className="text-xs">
                  {task.category}
                </Badge>
              )}
              
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs flex items-center gap-1",
                  getPriorityColor()
                )}
              >
                <Gauge className="h-3 w-3" />
                {task.priority}
              </Badge>

              {(task.timeSpent || isTracking) && (
                <Badge 
                  variant={isTracking ? "success" : "outline"} 
                  className="text-xs flex items-center gap-1"
                >
                  <Clock className="h-3 w-3" />
                  {isTracking 
                    ? `In corso: ${formatTime(elapsedTime)}` 
                    : `Tempo: ${formatTimeSpent(task.timeSpent)}`}
                </Badge>
              )}
            </div>
            
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

            {/* Time tracking buttons */}
            {!task.completed && (
              <div className="mt-2 flex items-center gap-2">
                {isTracking ? (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 text-xs bg-red-50 hover:bg-red-100 border-red-200 text-red-600"
                    onClick={stopTracking}
                  >
                    <PauseCircle className="h-3.5 w-3.5 mr-1" />
                    Ferma tracciamento
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 text-xs bg-green-50 hover:bg-green-100 border-green-200 text-green-600"
                    onClick={startTracking}
                  >
                    <PlayCircle className="h-3.5 w-3.5 mr-1" />
                    Traccia tempo
                  </Button>
                )}
              </div>
            )}

            {task.notes && (
              <div className="mt-2">
                <button 
                  onClick={() => setShowNotes(!showNotes)}
                  className="flex items-center text-xs text-primary hover:underline"
                >
                  <FileText className="mr-1 h-3 w-3" />
                  {showNotes ? "Nascondi note" : "Mostra note"}
                </button>
                {showNotes && (
                  <div className="mt-2 text-sm p-2 bg-background/50 rounded-md">
                    {task.notes}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleDelete}
                className={cn(
                  "text-muted-foreground/60 hover:text-destructive transition-all duration-200 h-8 w-8 rounded-full flex items-center justify-center",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Elimina attività</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TaskCard;
