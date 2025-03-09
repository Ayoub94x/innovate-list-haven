
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Task } from "@/pages/Home";
import { isSameDay, format } from "date-fns";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Target, AlertTriangle, CheckSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TaskCalendarProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks, onToggleComplete }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Calculate days that have tasks for the calendar
  const hasTaskDate = (date: Date) => {
    return tasks.some(task => task.dueDate && isSameDay(new Date(task.dueDate), date));
  };

  // Get tasks for the selected date
  const tasksForSelectedDate = selectedDate 
    ? tasks.filter(task => task.dueDate && isSameDay(new Date(task.dueDate), selectedDate))
    : [];

  // Format time from date
  const formatTime = (date: Date) => {
    return format(new Date(date), 'HH:mm');
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 animate-fade-in">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Calendario Attività</CardTitle>
          <CardDescription>
            Seleziona una data per vedere le tue attività
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            locale={it}
            modifiers={{
              hasTasks: (date) => hasTaskDate(date),
            }}
            modifiersClassNames={{
              hasTasks: "bg-primary/10 font-bold text-primary",
            }}
          />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>
            {selectedDate ? (
              <>Attività per {format(selectedDate, 'EEEE dd MMMM yyyy', { locale: it })}</>
            ) : (
              <>Seleziona una data</>
            )}
          </CardTitle>
          <CardDescription>
            {tasksForSelectedDate.length > 0 
              ? `${tasksForSelectedDate.length} attività pianificate per questa data` 
              : 'Nessuna attività pianificata per questa data'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tasksForSelectedDate.length > 0 ? (
            <div className="space-y-4">
              {tasksForSelectedDate
                .sort((a, b) => (a.dueDate && b.dueDate) 
                  ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() 
                  : 0)
                .map(task => {
                  const isOverdue = task.dueDate && !task.completed && new Date() > new Date(task.dueDate);
                  
                  return (
                    <div 
                      key={task.id} 
                      className={cn(
                        "p-4 rounded-lg border flex items-start gap-3",
                        task.completed ? "bg-muted/30" : isOverdue ? "border-amber-200 bg-amber-50" : "bg-white"
                      )}
                    >
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className={cn(
                          "h-6 w-6 rounded-full flex-shrink-0 mt-0.5",
                          task.completed ? "text-green-500" : isOverdue ? "text-amber-500" : "text-muted-foreground"
                        )}
                        onClick={() => onToggleComplete(task.id)}
                      >
                        {task.completed ? (
                          <Target className="h-4 w-4" />
                        ) : isOverdue ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : (
                          <CheckSquare className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={cn(
                            "font-medium",
                            task.completed && "line-through text-muted-foreground"
                          )}>
                            {task.title}
                          </h4>
                          {task.dueDate && (
                            <Badge variant="outline" className={cn(
                              isOverdue && !task.completed ? "border-amber-500 text-amber-700" : ""
                            )}>
                              {formatTime(task.dueDate)}
                            </Badge>
                          )}
                        </div>
                        
                        {task.category && (
                          <span className="text-xs text-muted-foreground mt-1 block">
                            {task.category}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p>Non hai attività pianificate per questa data.</p>
              <p className="mt-2">Seleziona un'altra data o aggiungi nuove attività.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCalendar;
