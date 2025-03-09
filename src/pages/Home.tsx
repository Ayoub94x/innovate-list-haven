import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import NewTaskInput from "@/components/NewTaskInput";
import TaskList from "@/components/TaskList";
import { CheckSquare, Trophy, Award, Star, Brain, Heart } from "lucide-react";
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
  timeSpent?: number; // Tempo in minuti speso sull'attività
  level?: number; // Livello di gamification
  achievements?: string[]; // Traguardi raggiunti
}

// Simulazione di suggerimenti AI (in produzione questo verrebbe da un servizio AI)
const aiSuggestions = [
  "Ricordati di fare una pausa ogni 25 minuti di lavoro",
  "Prova a completare prima le attività più importanti",
  "Gli appuntamenti in mattinata sono spesso più produttivi",
  "Raggruppa attività simili per aumentare l'efficienza",
  "Dedica 10 minuti alla pianificazione della giornata",
  "Programma del tempo libero tra le attività importanti",
  "Le attività più difficili dovrebbero essere programmate quando sei più energico",
  "Utilizzare la tecnica Pomodoro può aumentare la tua concentrazione",
  "Ricorda di idratarsi durante la giornata di lavoro",
  "Una breve meditazione può aiutarti a ritrovare il focus"
];

// Simulazione di achievement badges
export const badges = [
  { id: "early_bird", name: "Early Bird", icon: <Star className="h-4 w-4" />, description: "Completa 3 attività prima delle 10:00" },
  { id: "focus_master", name: "Focus Master", icon: <Brain className="h-4 w-4" />, description: "Traccia 2 ore consecutive di lavoro" },
  { id: "deadline_hero", name: "Deadline Hero", icon: <Trophy className="h-4 w-4" />, description: "Completa 5 attività entro la scadenza" },
  { id: "wellness_guru", name: "Wellness Guru", icon: <Heart className="h-4 w-4" />, description: "Fai 3 pause programmate in un giorno" },
  { id: "achievement_hunter", name: "Achievement Hunter", icon: <Award className="h-4 w-4" />, description: "Ottieni 3 badge diversi" }
];

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
          priority: task.priority || "Media",
          timeSpent: task.timeSpent || 0,
          level: 1,
          achievements: []
        }));
      } catch (e) {
        return defaultTasks;
      }
    }
    return defaultTasks;
  });

  const [userAchievements, setUserAchievements] = useState<string[]>(() => {
    const savedAchievements = localStorage.getItem("achievements");
    return savedAchievements ? JSON.parse(savedAchievements) : [];
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("achievements", JSON.stringify(userAchievements));
  }, [userAchievements]);

  useEffect(() => {
    checkForAchievements();
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
      notes,
      timeSpent: 0,
      level: 1,
      achievements: []
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          if (!task.completed && task.dueDate) {
            const now = new Date();
            const dueDate = new Date(task.dueDate);
            
            if (now < dueDate) {
              checkDeadlineHeroAchievement();
            }
          }
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  };

  const updateTimeSpent = (id: string, minutes: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, timeSpent: (task.timeSpent || 0) + minutes } : task
      );
      
      if (minutes >= 60) {
        checkFocusMasterAchievement();
      }
      
      return updatedTasks;
    });
  };

  const checkForAchievements = () => {
    checkEarlyBirdAchievement();
    checkDeadlineHeroAchievement();
    checkAchievementHunterAchievement();
  };

  const unlockAchievement = (achievementId: string) => {
    if (!userAchievements.includes(achievementId)) {
      const achievement = badges.find(badge => badge.id === achievementId);
      setUserAchievements(prev => [...prev, achievementId]);
      
      if (achievement) {
        toast.success(`🎉 Nuovo badge sbloccato: ${achievement.name}`, {
          description: achievement.description,
          icon: achievement.icon,
          duration: 5000,
        });
      }
    }
  };

  const checkEarlyBirdAchievement = () => {
    const now = new Date();
    const morningTasks = tasks.filter(task => {
      return task.completed && task.createdAt && 
      new Date(task.createdAt).getHours() < 10;
    });
    
    if (morningTasks.length >= 3 && !userAchievements.includes("early_bird")) {
      unlockAchievement("early_bird");
    }
  };

  const checkFocusMasterAchievement = () => {
    const focusedTasks = tasks.filter(task => (task.timeSpent || 0) >= 120);
    
    if (focusedTasks.length > 0 && !userAchievements.includes("focus_master")) {
      unlockAchievement("focus_master");
    }
  };

  const checkDeadlineHeroAchievement = () => {
    const onTimeCompletions = tasks.filter(task => {
      if (!task.completed || !task.dueDate) return false;
      
      const completionDate = task.createdAt;
      const dueDate = new Date(task.dueDate);
      
      return completionDate <= dueDate;
    });
    
    if (onTimeCompletions.length >= 5 && !userAchievements.includes("deadline_hero")) {
      unlockAchievement("deadline_hero");
    }
  };

  const checkAchievementHunterAchievement = () => {
    if (userAchievements.length >= 3 && !userAchievements.includes("achievement_hunter")) {
      unlockAchievement("achievement_hunter");
    }
  };

  const getAiSuggestion = () => {
    return aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-6 md:py-10">
        <div className="glass-card p-8 mb-8 text-center bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 shadow-lg">
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
          
          {userAchievements.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {userAchievements.map(id => {
                const badge = badges.find(b => b.id === id);
                return badge ? (
                  <div key={id} className="flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-1 rounded-full text-xs border border-amber-200">
                    {badge.icon}
                    <span>{badge.name}</span>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="tasks">Attività</TabsTrigger>
            <TabsTrigger value="stats">Statistiche</TabsTrigger>
            <TabsTrigger value="calendar">Calendario</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="space-y-6">
            <NewTaskInput onAddTask={addTask} getAiSuggestion={getAiSuggestion} />
            
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
                onUpdateTimeSpent={updateTimeSpent}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <TaskStats tasks={tasks} badges={badges} userAchievements={userAchievements} />
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
