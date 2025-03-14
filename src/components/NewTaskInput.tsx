
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Calendar, BrainCircuit, Gauge, Clock } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { it } from "date-fns/locale";

interface NewTaskInputProps {
  onAddTask: (taskTitle: string, dueDate: Date | null, category: string, priority: string, notes?: string) => void;
  getAiSuggestion: () => string;
}

const categories = [
  "Lavoro", "Personale", "Salute", "Formazione", "Casa", "Benessere", "Altro"
];

const priorities = [
  "Alta", "Media", "Bassa"
];

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = [0, 15, 30, 45];

const NewTaskInput: React.FC<NewTaskInputProps> = ({ onAddTask, getAiSuggestion }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [dueHour, setDueHour] = useState<number>(9);
  const [dueMinute, setDueMinute] = useState<number>(0);
  const [category, setCategory] = useState("Altro");
  const [priority, setPriority] = useState("Media");
  const [notes, setNotes] = useState("");
  const [showAiSuggestion, setShowAiSuggestion] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (taskTitle.trim()) {
      let finalDueDate = dueDate;
      
      if (finalDueDate) {
        // Impostiamo l'orario specifico selezionato
        finalDueDate = new Date(finalDueDate);
        finalDueDate.setHours(dueHour, dueMinute, 0, 0);
      }
      
      onAddTask(taskTitle.trim(), finalDueDate, category, priority, notes);
      setTaskTitle("");
      setDueDate(null);
      setNotes("");
      toast.success("Attività aggiunta");
    }
  };

  const handleAiSuggestion = () => {
    const suggestion = getAiSuggestion();
    setCurrentSuggestion(suggestion);
    setShowAiSuggestion(true);
    toast.info("Suggerimento IA", {
      description: suggestion,
      icon: <BrainCircuit className="h-5 w-5" />
    });
  };

  return (
    <form onSubmit={handleSubmit} className="animate-slide-up glass-card p-4">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Input
              placeholder="Aggiungi una nuova attività..."
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="pr-10 h-12 bg-background/70 backdrop-blur border-input/30 focus-visible:ring-primary"
            />
          </div>
          <Button 
            type="button" 
            variant="outline" 
            size="icon" 
            onClick={handleAiSuggestion}
            className="h-12 w-12 flex-shrink-0"
            title="Suggerimenti IA"
          >
            <BrainCircuit className="h-5 w-5" />
          </Button>
        </div>

        {showAiSuggestion && (
          <div className="bg-primary/10 p-3 rounded-md text-sm flex items-start gap-2 animate-fade-in">
            <BrainCircuit className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <p>{currentSuggestion}</p>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row flex-wrap gap-3">
          <div className="flex flex-wrap gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  className={cn(
                    "justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP", { locale: it }) : <span>Data di scadenza</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dueDate || undefined}
                  onSelect={setDueDate}
                  initialFocus
                  locale={it}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            {dueDate && (
              <div className="flex gap-2 items-center">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Select value={dueHour.toString()} onValueChange={(value) => setDueHour(parseInt(value))}>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="Ora" />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem key={hour} value={hour.toString()}>
                        {hour.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>:</span>
                <Select value={dueMinute.toString()} onValueChange={(value) => setDueMinute(parseInt(value))}>
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((minute) => (
                      <SelectItem key={minute} value={minute.toString()}>
                        {minute.toString().padStart(2, '0')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Priorità" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map(p => (
                  <SelectItem key={p} value={p}>
                    <div className="flex items-center gap-2">
                      <Gauge className={cn(
                        "h-4 w-4",
                        p === "Alta" ? "text-red-500" : 
                        p === "Media" ? "text-amber-500" : 
                        "text-green-500"
                      )} />
                      {p}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-full md:min-w-0">
            <Textarea 
              placeholder="Note (opzionale)" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              className="h-12 min-h-[3rem] resize-none"
            />
          </div>
          
          <Button 
            type="submit" 
            className="ml-auto hover:shadow transition-all duration-300 transform hover:translate-y-[-2px]"
            disabled={!taskTitle.trim()}
          >
            <Plus className="mr-2 h-5 w-5" />
            Aggiungi attività
          </Button>
        </div>
      </div>
    </form>
  );
};

export default NewTaskInput;
