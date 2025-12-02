import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, LogIn, LogOut, User, CheckCircle2, XCircle, Calendar, LayoutDashboard } from "lucide-react";
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
  const [angajati, setAngajati] = useState<Angajat[]>([]);
  const [selectedAngajat, setSelectedAngajat] = useState<string>("");
  const [isPontajActiv, setIsPontajActiv] = useState(false);
  const [oraStart, setOraStart] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [todayPontaj, setTodayPontaj] = useState<PontajEntry | null>(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch employees list
  useEffect(() => {
    const fetchAngajati = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/resurse_umane/returneaza/lista_angajati`);
        if (response.ok) {
          const data = await response.json();
          setAngajati(data);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchAngajati();
  }, []);

  // Check if employee already has pontaj today
  useEffect(() => {
    if (selectedAngajat) {
      checkTodayPontaj();
    }
  }, [selectedAngajat]);

  const checkTodayPontaj = async () => {
    if (!selectedAngajat) return;
    
    const today = new Date().toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    }).replace(/\./g, '/');

    try {
      const response = await fetch(`${API_BASE_URL}/resurse_umane/returneaza/pontaj`);
      if (response.ok) {
        const data = await response.json();
        const angajatNume = angajati.find(a => a.id.toString() === selectedAngajat)?.nume;
        const existingPontaj = data.find((p: any) => 
          p.angajat === angajatNume && p.data === today
        );
        
        if (existingPontaj) {
          setTodayPontaj(existingPontaj);
          if (existingPontaj.ora_start && !existingPontaj.ora_sfarsit) {
            setIsPontajActiv(true);
            setOraStart(existingPontaj.ora_start);
          } else if (existingPontaj.ora_sfarsit) {
            setIsPontajActiv(false);
          }
        } else {
          setTodayPontaj(null);
          setIsPontajActiv(false);
          setOraStart(null);
        }
      }
    } catch (error) {
      console.error("Error checking today's pontaj:", error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ro-RO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ro-RO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handlePontareIntrare = async () => {
    if (!selectedAngajat) {
      toast.error("Selectează un angajat");
      return;
    }

    setIsLoading(true);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\./g, '/');

    const angajatNume = angajati.find(a => a.id.toString() === selectedAngajat)?.nume;

    try {
      const response = await fetch(`${API_BASE_URL}/resurse_umane/adauga/pontaj`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          angajat: angajatNume,
          data: dateStr,
          ora_start: timeStr,
          ora_sfarsit: ""
        }),
      });

      if (response.ok) {
        setIsPontajActiv(true);
        setOraStart(timeStr);
        toast.success(`Pontare intrare înregistrată la ${timeStr}`);
        checkTodayPontaj();
      } else {
        toast.error("Eroare la înregistrarea pontajului");
      }
    } catch (error) {
      toast.error("Eroare de conexiune");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePontareIesire = async () => {
    if (!selectedAngajat || !todayPontaj) {
      toast.error("Nu există pontaj activ");
      return;
    }

    setIsLoading(true);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });

    try {
      const response = await fetch(`${API_BASE_URL}/editeaza`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tabel: "pontaj",
          id: (todayPontaj as any).id,
          update: {
            ora_sfarsit: timeStr
          }
        }),
      });

      if (response.ok) {
        setIsPontajActiv(false);
        toast.success(`Pontare ieșire înregistrată la ${timeStr}`);
        checkTodayPontaj();
      } else {
        toast.error("Eroare la înregistrarea ieșirii");
      }
    } catch (error) {
      toast.error("Eroare de conexiune");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAngajatData = angajati.find(a => a.id.toString() === selectedAngajat);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Pontare Angajat</h1>
          <p className="text-muted-foreground text-sm">
            Sistem de pontare pentru angajați
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pontaj" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pontaj" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Pontaj</span>
            </TabsTrigger>
            <TabsTrigger value="concedii" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Concedii</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard Program</span>
            </TabsTrigger>
          </TabsList>

          {/* Pontaj Tab */}
          <TabsContent value="pontaj" className="space-y-6">
            {/* Current Time Card */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-5xl font-mono font-bold text-primary">
                    {formatTime(currentTime)}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {formatDate(currentTime)}
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Pontaj Status */}
            {selectedAngajat && (
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Status Pontaj Azi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {todayPontaj ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Intrare:</span>
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {todayPontaj.ora_start}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Ieșire:</span>
                        {todayPontaj.ora_sfarsit ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {todayPontaj.ora_sfarsit}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                            <XCircle className="h-3 w-3 mr-1" />
                            În așteptare
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Nu există pontaj pentru astăzi
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            {selectedAngajat && (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  className="h-20 text-lg bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  onClick={handlePontareIntrare}
                  disabled={isLoading || isPontajActiv || (todayPontaj?.ora_sfarsit ? true : false)}
                >
                  <LogIn className="h-6 w-6 mr-2" />
                  Intrare
                </Button>
                <Button
                  size="lg"
                  className="h-20 text-lg bg-red-600 hover:bg-red-700 disabled:opacity-50"
                  onClick={handlePontareIesire}
                  disabled={isLoading || !isPontajActiv}
                >
                  <LogOut className="h-6 w-6 mr-2" />
                  Ieșire
                </Button>
              </div>
            )}

            {/* Cerere Adăugare Timp Button */}
            <Button className="w-full h-14 text-lg font-semibold">
              <Clock className="h-5 w-5 mr-2" />
              Cerere Adăugare Timp
            </Button>
          </TabsContent>

          {/* Concedii Tab */}
          <TabsContent value="concedii" className="space-y-6">
            {/* Zile disponibile card */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Zile concediu disponibile</p>
                      <p className="text-3xl font-bold text-foreground">21</p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Total anual: 21 zile</p>
                    <p>Utilizate: 0 zile</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cerere nouă button */}
            <Button className="w-full h-14 text-lg font-semibold">
              <Calendar className="h-5 w-5 mr-2" />
              Cerere Nouă
            </Button>

            {/* Istoric cereri placeholder */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Istoric Cereri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Nu există cereri de concediu</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dashboard Program Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-foreground">Salutări</h2>
                <p className="text-muted-foreground">Începe sesiunea de lucru</p>
              </div>
              <Button
                size="lg"
                className="h-24 w-64 text-xl font-semibold"
              >
                <LogIn className="h-8 w-8 mr-3" />
                Pontează
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
