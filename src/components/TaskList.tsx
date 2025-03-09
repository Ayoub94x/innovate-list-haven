
import React, { useState } from "react";
import TaskCard from "./TaskCard";
import { Task } from "@/pages/Home";
import { Filter, Trophy, Focus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onUpdateTimeSpent?: (id: string, minutes: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDeleteTask,
  onToggleComplete,
  onUpdateTimeSpent,
}) => {
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  
  const completedTasks = tasks.filter((task) => task.completed);
  const pendingTasks = tasks.filter((task) => !task.completed);
  
  const filteredPendingTasks = filterCategory 
    ? pendingTasks.filter(task => task.category === filterCategory)
    : pendingTasks;
    
  const filteredCompletedTasks = filterCategory 
    ? completedTasks.filter(task => task.category === filterCategory)
    : completedTasks;
  
  const uniqueCategories = Array.from(new Set(tasks.map(task => task.category)));
  
  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
    if (!focusMode) {
      toast.success("Modalità Focus attivata", {
        description: "Concentrati sulle tue attività prioritarie",
        icon: <Focus className="h-5 w-5" />,
      });
    } else {
      toast.info("Modalità Focus disattivata", {
        icon: <Bell className="h-5 w-5" />,
      });
    }
  };
  
  // Calculate user level based on completed tasks
  const calculateUserLevel = () => {
    const completedCount = completedTasks.length;
    const level = Math.floor(completedCount / 5) + 1;
    const progress = (completedCount % 5) / 5 * 100;
    return { level, progress };
  };
  
  const { level, progress } = calculateUserLevel();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <p className="text-muted-foreground text-sm">
          Non ci sono attività. Aggiungine una nuova!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* User Level & Gamification */}
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h3 className="font-medium">Livello {level}</h3>
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            {completedTasks.length} attività completate
          </Badge>
        </div>
        
        <div className="w-full bg-muted/50 rounded-full h-2 mb-1">
          <div 
            className="bg-amber-500 h-2 rounded-full transition-all duration-700 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground">
          {5 - (completedTasks.length % 5)} attività per raggiungere il livello {level + 1}
        </p>
      </div>
      
      {/* Controls section */}
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFilterCategory(null)}
            className={!filterCategory ? "border-primary bg-primary/10" : ""}
          >
            Tutte
          </Button>
          {uniqueCategories.map(category => (
            <Button 
              key={category} 
              variant="outline" 
              size="sm"
              onClick={() => setFilterCategory(category)}
              className={filterCategory === category ? "border-primary bg-primary/10" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
        
        <Button 
          variant={focusMode ? "default" : "outline"} 
          size="sm"
          onClick={toggleFocusMode}
          className={focusMode ? "bg-amber-600 hover:bg-amber-700" : ""}
        >
          <Focus className="mr-1 h-4 w-4" />
          {focusMode ? "Esci dal Focus" : "Modalità Focus"}
        </Button>
      </div>
      
      {filteredPendingTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground px-1 flex items-center">
            <Filter className="mr-2 h-3.5 w-3.5" />
            Da completare ({filteredPendingTasks.length})
          </h2>
          <div className="space-y-3">
            {filteredPendingTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                onToggleComplete={onToggleComplete}
                onUpdateTimeSpent={onUpdateTimeSpent}
                focusMode={focusMode}
              />
            ))}
          </div>
        </div>
      )}

      {filteredCompletedTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground px-1 flex items-center">
            <Trophy className="mr-2 h-3.5 w-3.5 text-amber-500" />
            Completate ({filteredCompletedTasks.length})
          </h2>
          <div className="space-y-3">
            {filteredCompletedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                onToggleComplete={onToggleComplete}
                onUpdateTimeSpent={onUpdateTimeSpent}
                focusMode={focusMode}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
