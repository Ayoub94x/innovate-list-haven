
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { CheckSquare } from "lucide-react";

const Index: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md text-center glass-card p-10 animate-scale-in">
        <CheckSquare className="h-16 w-16 text-primary mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold tracking-tight mb-2">TaskFlow</h1>
        <p className="text-muted-foreground mb-8">
          L'app per organizzare le tue attività con stile e semplicità
        </p>
        
        <div className="space-y-4">
          <Button 
            className="w-full h-12 transition-all duration-300 transform hover:translate-y-[-2px]"
            onClick={() => navigate("/login")}
          >
            Accedi
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-12 transition-all duration-300 transform hover:translate-y-[-2px]"
            onClick={() => navigate("/login")}
          >
            Registrati
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
