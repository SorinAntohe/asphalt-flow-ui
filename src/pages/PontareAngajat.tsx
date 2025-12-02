import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, LogIn, Calendar, LayoutDashboard, Plus, Filter, Square } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";

interface Angajat {
  id: number;
  nume: string;
  functie: string;
}

interface PontajEntry {
  data: string;
  ora_start: string;
  ora_sfarsit: string;
}

export default function PontareAngajat() {
  const [isPontajActiv, setIsPontajActiv] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionStart, setSessionStart] = useState<Date | null>(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatSessionTime = () => {
    if (!sessionStart) return "00:00:00";
    const diff = Math.floor((currentTime.getTime() - sessionStart.getTime()) / 1000);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDateRangeText = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const formatDate = (d: Date) => d.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');
    return `${formatDate(startOfMonth)} - ${formatDate(endOfMonth)}`;
  };

  const handlePontareIntrare = () => {
    setIsPontajActiv(true);
    setSessionStart(new Date());
    toast.success("Sesiune de lucru începută");
  };

  const handlePontareIesire = () => {
    setIsPontajActiv(false);
    setSessionStart(null);
    toast.success("Sesiune de lucru finalizată");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto">
        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-transparent border-b border-border rounded-none h-auto p-0">
            <TabsTrigger 
              value="pontaj" 
              className="flex items-center gap-2 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Clock className="h-4 w-4" />
              <span>Pontaj</span>
            </TabsTrigger>
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="concedii" 
              className="flex items-center gap-2 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <Calendar className="h-4 w-4" />
              <span>Concedii</span>
            </TabsTrigger>
          </TabsList>

          {/* Pontaj Tab */}
          <TabsContent value="pontaj" className="p-4 space-y-4 mt-0">
            {/* Primary Action Card */}
            <Card className="bg-primary text-primary-foreground border-0 overflow-hidden">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Cerere de pontaj</p>
                  <p className="text-xl font-semibold">Adaugă timp</p>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-12 w-12 rounded-full border-2 border-primary-foreground/30 hover:bg-primary-foreground/10"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-muted/50 border-border/50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Timp înregistrat pentru perioada aleasă</p>
                <p className="text-2xl font-bold text-foreground">168:00</p>
              </CardContent>
            </Card>

            {/* Date Range Filter */}
            <div className="flex items-center justify-between py-2">
              <p className="text-sm text-muted-foreground">
                Înregistrări din <span className="text-foreground underline">{getDateRangeText()}</span>
              </p>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Empty State */}
            <div className="text-center py-16">
              <p className="text-lg font-medium text-foreground">
                Nu ai înregistrări de timp pentru<br />perioada aleasă
              </p>
            </div>
          </TabsContent>

          {/* Dashboard Program Tab */}
          <TabsContent value="dashboard" className="p-4 mt-0">
            <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
              {/* Session Label & Timer */}
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">Sesiunea actuală de lucru</p>
                <p className="text-5xl font-mono font-bold text-foreground">
                  {formatSessionTime()}
                </p>
              </div>

              {/* Large Circular Button */}
              {!isPontajActiv ? (
                <button
                  onClick={handlePontareIntrare}
                  className="w-48 h-48 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center group"
                >
                  <LogIn className="h-12 w-12 text-primary-foreground group-hover:scale-110 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={handlePontareIesire}
                  className="w-48 h-48 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center group"
                >
                  <Square className="h-10 w-10 text-primary-foreground fill-primary-foreground group-hover:scale-110 transition-transform" />
                </button>
              )}

              {/* Hint Text */}
              <div className="text-center space-y-1">
                <span className="text-2xl text-muted-foreground">^</span>
                <p className="text-sm text-muted-foreground">Glisează pentru detalii</p>
              </div>
            </div>
          </TabsContent>

          {/* Concedii Tab */}
          <TabsContent value="concedii" className="p-4 space-y-4 mt-0">
            {/* Primary Action Card */}
            <Card className="bg-primary text-primary-foreground border-0 overflow-hidden">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Depune cerere de concediu</p>
                  <p className="text-xl font-semibold">Cerere nouă</p>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-12 w-12 rounded-full border-2 border-primary-foreground/30 hover:bg-primary-foreground/10"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-muted/50 border-border/50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Zile concediu disponibile total</p>
                <p className="text-2xl font-bold text-foreground">21 zile</p>
              </CardContent>
            </Card>

            {/* Date Range Filter */}
            <div className="flex items-center justify-between py-2">
              <p className="text-sm text-muted-foreground">
                Concedii din <span className="text-foreground underline">{getDateRangeText()}</span>
              </p>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Empty State */}
            <div className="text-center py-16">
              <p className="text-lg font-medium text-foreground">
                Nu sunt concedii programate pentru<br />perioada aleasă
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
