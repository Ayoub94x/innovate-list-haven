
import React from "react";
import { Task } from "@/pages/Home";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isToday, isBefore, isAfter, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Check, Calendar, Star, Trophy, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface DailyTasksProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const DailyTasks: React.FC<DailyTasksProps> = ({
  tasks,
  onDeleteTask,
  onToggleComplete
}) => {
  // Filter tasks for today (due today)
  const todayTasks = tasks.filter(task => 
    task.dueDate && isToday(new Date(task.dueDate))
  ).sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

  const getCurrentStatus = (task: Task) => {
    if (task.completed) {
      return { 
        icon: <Trophy className="h-5 w-5 text-green-500" />,
        text: "Completata",
        variant: "success"
      };
    }
    
    if (!task.dueDate) return { 
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      text: "In programma",
      variant: "default"
    };
    
    const now = new Date();
    const dueTime = new Date(task.dueDate);
    
    if (isAfter(now, dueTime)) {
      return { 
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
        text: "In ritardo",
        variant: "warning"
      };
    }
    
    // Due within the next hour
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    if (isBefore(dueTime, oneHourLater)) {
      return { 
        icon: <Clock className="h-5 w-5 text-amber-500" />,
        text: "Imminente",
        variant: "warning" 
      };
    }
    
    return { 
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      text: "Oggi",
      variant: "default"
    };
  };
  
  // Format time
  const formatTime = (date: Date) => {
    return format(new Date(date), 'HH:mm');
  };

  if (todayTasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attività di Oggi</CardTitle>
          <CardDescription>
            Non hai attività programmate per oggi
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <Star className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Congratulazioni! Goditi la tua giornata libera o aggiungi nuove attività.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attività di Oggi</CardTitle>
        <CardDescription>
          {todayTasks.length} attività programmate per oggi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {todayTasks.map(task => {
            const status = getCurrentStatus(task);
            
            const getVariantClass = (variant: string) => {
              switch(variant) {
                case "success": return "bg-green-50 border-green-200";
                case "warning": return "bg-amber-50 border-amber-200";
                default: return "bg-blue-50 border-blue-200";
              }
            };
            
            return (
              <div 
                key={task.id} 
                className={cn(
                  "p-3 rounded-lg border flex items-center gap-3 transition-all duration-300",
                  getVariantClass(status.variant),
                  task.completed && "opacity-75"
                )}
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center border-2",
                    task.completed
                      ? "bg-green-100 border-green-500 text-green-700"
                      : "border-muted-foreground/30"
                  )}
                  onClick={() => onToggleComplete(task.id)}
                >
                  {task.completed && <Check className="h-4 w-4" />}
                </Button>
                
                <div className="flex-1">
                  <h4 className={cn(
                    "font-medium",
                    task.completed && "line-through text-muted-foreground"
                  )}>
                    {task.title}
                  </h4>
                  {task.category && (
                    <span className="text-xs text-muted-foreground">
                      {task.category}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {task.dueDate && (
                    <Badge variant="outline" className={cn(
                      status.variant === "warning" ? "border-amber-500 text-amber-700" : ""
                    )}>
                      {formatTime(task.dueDate)}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1 text-xs">
                    {status.icon}
                    <span className={cn(
                      status.variant === "warning" ? "text-amber-700" : 
                      status.variant === "success" ? "text-green-700" : 
                      "text-blue-700"
                    )}>
                      {status.text}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyTasks;
