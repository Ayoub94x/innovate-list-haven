
import React, { useMemo } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { Task } from "@/pages/Home";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";
import { it } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskStatsProps {
  tasks: Task[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
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

  return (
    <div className="space-y-8 animate-fade-in">
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
    </div>
  );
};

export default TaskStats;
