import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { AlertCircle } from "lucide-react";
import logo from "@/assets/logo-auth.png";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    if (savedPassword) {
      setPassword(savedPassword);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Save or clear credentials based on rememberMe
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberedPassword", password);
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }

    // Simulate network delay
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Eroare la autentificare");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background with zoom animation */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/login-background.mp4" type="video/mp4" />
      </video>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Login Card */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-xl border border-border/30">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto animate-fade-in">
              <img 
                src={logo} 
                alt="Duotip Solutions" 
                className="h-20 object-contain mx-auto hover:scale-110 transition-transform duration-300" 
              />
            </div>
            <CardTitle className="text-2xl font-bold">Management Producție</CardTitle>
            <CardDescription>Autentificare în sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nume@email.ro"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Parolă</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                  Ține-mă minte
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Se autentifică..." : "Autentificare"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
