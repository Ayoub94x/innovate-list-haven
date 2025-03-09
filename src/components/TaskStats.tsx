
import React, { useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { Task, badges } from "@/pages/Home";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";
import { it } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Trophy, Target, Clock, Star, Brain, Heart } from "lucide-react";

interface TaskStatsProps {
  tasks: Task[];
  badges: typeof badges;
  userAchievements: string[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const TaskStats: React.FC<TaskStatsProps> = ({ tasks, badges, userAchievements }) => {
  // Weekly task data
  const weeklyData = useMemo(() => {
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
    const daysInWeek = eachDayOfInterval({ start: startDate, end: endDate });

    return daysInWeek.map(day => {
      const dayTasks = tasks.filter(task => 
        isWithinInterval(new Date(task.createdAt), { 
          start: new Date(day.setHours(0, 0, 0, 0)), 
          end: new Date(day.setHours(23, 59, 59, 999)) 
        })
      );
      
      const completed = dayTasks.filter(task => task.completed).length;
      const pending = dayTasks.length - completed;
      
      return {
        day: format(day, 'EEE', { locale: it }),
        Completate: completed,
        InSospeso: pending,
      };
    });
  }, [tasks]);

  // Monthly task data
  const monthlyData = useMemo(() => {
    const startDate = startOfMonth(new Date());
    const endDate = endOfMonth(new Date());
    
    const totalTasks = tasks.filter(task => 
      isWithinInterval(new Date(task.createdAt), { start: startDate, end: endDate })
    ).length;
    
    const completedTasks = tasks.filter(task => 
      isWithinInterval(new Date(task.createdAt), { start: startDate, end: endDate }) && task.completed
    ).length;
    
    return [
      { name: 'Completate', value: completedTasks },
      { name: 'In Sospeso', value: totalTasks - completedTasks },
    ];
  }, [tasks]);

  // Category distribution
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {};
    
    tasks.forEach(task => {
      const category = task.category || 'Altro';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [tasks]);
  
  // Time tracking data
  const timeTrackingData = useMemo(() => {
    const categories: Record<string, number> = {};
    
    tasks.forEach(task => {
      if (task.timeSpent && task.timeSpent > 0) {
        const category = task.category || 'Altro';
        categories[category] = (categories[category] || 0) + task.timeSpent;
      }
    });
    
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [tasks]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Achievement showcase */}
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-100">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              I tuoi traguardi
            </CardTitle>
            <span className="text-sm font-medium text-amber-600">
              {userAchievements.length} / {badges.length} sbloccati
            </span>
          </div>
          <CardDescription>
            Completa attività per sbloccare nuovi badge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map(badge => {
              const isUnlocked = userAchievements.includes(badge.id);
              
              return (
                <div 
                  key={badge.id} 
                  className={cn(
                    "p-3 rounded-lg border flex items-center gap-3 transition-all",
                    isUnlocked 
                      ? "bg-amber-50 border-amber-200 shadow-sm" 
                      : "bg-muted/30 border-muted text-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full",
                    isUnlocked ? "bg-amber-100 text-amber-600" : "bg-muted text-muted-foreground"
                  )}>
                    {React.cloneElement(badge.icon, { className: "h-5 w-5" })}
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {badge.name}
                      {isUnlocked && <span className="ml-1 text-amber-500">✓</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {badge.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progressi Settimanali</CardTitle>
          <CardDescription>
            Attività completate e in sospeso per ogni giorno della settimana
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Completate" stackId="a" fill="#0088FE" />
                <Bar dataKey="InSospeso" stackId="a" fill="#FFBB28" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuzione Mensile</CardTitle>
            <CardDescription>
              Percentuale di attività completate questo mese
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={monthlyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {monthlyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categorie</CardTitle>
            <CardDescription>
              Distribuzione delle attività per categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Time tracking chart */}
      {timeTrackingData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Tempo investito per categoria
            </CardTitle>
            <CardDescription>
              Minuti dedicati a ciascuna categoria di attività
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timeTrackingData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Minuti', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value} minuti`, 'Tempo investito']} />
                  <Legend />
                  <Bar dataKey="value" name="Minuti" fill="#6366F1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Add the required imports
import { cn } from "@/lib/utils";

export default TaskStats;
