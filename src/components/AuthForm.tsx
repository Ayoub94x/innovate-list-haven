
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckSquare, User, Mail, Lock } from "lucide-react";

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      await login(email, password);
    } else {
      await register(name, email, password);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="w-full max-w-md mx-auto glass-card p-8 animate-scale-in">
      <div className="flex flex-col items-center mb-8">
        <CheckSquare className="h-12 w-12 text-primary mb-2" />
        <h1 className="text-2xl font-bold tracking-tight">
          {isLogin ? "Accedi a TaskFlow" : "Registrati su TaskFlow"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isLogin
            ? "Accedi per gestire le tue attività"
            : "Crea un account per iniziare"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Il tuo nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="La tua email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="La tua password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-6 transition-all duration-300 transform hover:translate-y-[-2px]"
          disabled={isLoading}
        >
          {isLoading
            ? "Caricamento..."
            : isLogin
            ? "Accedi"
            : "Registrati"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {isLogin ? "Non hai un account?" : "Hai già un account?"}
          <Button
            variant="link"
            onClick={toggleMode}
            className="ml-1 p-0"
          >
            {isLogin ? "Registrati" : "Accedi"}
          </Button>
        </p>
      </div>

      {isLogin && (
        <div className="mt-8 text-center border-t border-border pt-4">
          <p className="text-xs text-muted-foreground">
            Per l'accesso demo: user@example.com / password
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
