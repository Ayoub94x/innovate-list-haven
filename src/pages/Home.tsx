
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import NewTaskInput from "@/components/NewTaskInput";
import TaskList from "@/components/TaskList";
import { CheckSquare } from "lucide-react";
import TaskStats from "@/components/TaskStats";
import TaskCalendar from "@/components/TaskCalendar";
import DailyTasks from "@/components/DailyTasks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  dueDate: Date | null;
  category: string;
  priority: string;
  notes?: string;
}

const defaultTasks = [
  {
    id: "1",
    title: "Esercizio fisico mattutino",
    completed: false,
    createdAt: new Date(),
    dueDate: new Date(new Date().setHours(10, 0, 0, 0)),
    category: "Salute",
    priority: "Alta"
  },
  {
    id: "2",
    title: "Riunione di lavoro",
    completed: false,
    createdAt: new Date(),
    dueDate: new Date(new Date().setHours(14, 30, 0, 0)),
    category: "Lavoro",
    priority: "Media"
  },
  {
    id: "3",
    title: "Studiare Italiano",
    completed: false,
    createdAt: new Date(),
    dueDate: new Date(new Date().setHours(18, 0, 0, 0)),
    category: "Formazione",
    priority: "Bassa"
  },
  {
    id: "4",
    title: "Chiamare i genitori",
    completed: false,
    createdAt: new Date(),
    dueDate: new Date(new Date().setHours(20, 0, 0, 0)),
    category: "Personale",
    priority: "Media"
  },
  {
    id: "5",
    title: "Meditazione serale",
    completed: false,
    createdAt: new Date(),
    dueDate: new Date(new Date().setHours(22, 0, 0, 0)),
    category: "Benessere",
    priority: "Bassa"
  }
];

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          priority: task.priority || "Media" // Compatibilità con vecchi dati
        }));
      } catch (e) {
        return defaultTasks;
      }
    }
    return defaultTasks;
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, dueDate: Date | null, category: string, priority: string, notes?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: new Date(),
      dueDate,
      category,
      priority,
      notes
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-6 md:py-10">
        <div className="glass-card p-8 mb-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckSquare className="h-10 w-10 text-primary" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">TaskFlow</h1>
          <p className="text-muted-foreground mb-6">
            Gestisci le tue attività con semplicità ed eleganza
          </p>
          
          <div className="w-full bg-muted/50 rounded-full h-2.5 mb-2">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-700 ease-in-out" 
              style={{ width: `${percent}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {completedCount} di {totalCount} attività completate ({percent}%)
          </p>
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="tasks">Attività</TabsTrigger>
            <TabsTrigger value="stats">Statistiche</TabsTrigger>
            <TabsTrigger value="calendar">Calendario</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="space-y-6">
            <NewTaskInput onAddTask={addTask} />
            
            <DailyTasks 
              tasks={tasks}
              onDeleteTask={deleteTask}
              onToggleComplete={toggleComplete}
            />
            
            <div className="mt-6">
              <TaskList 
                tasks={tasks} 
                onDeleteTask={deleteTask} 
                onToggleComplete={toggleComplete} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <TaskStats tasks={tasks} />
          </TabsContent>
          
          <TabsContent value="calendar">
            <TaskCalendar tasks={tasks} onToggleComplete={toggleComplete} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Home;
