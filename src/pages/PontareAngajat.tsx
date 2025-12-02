import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, LogIn, Calendar, LayoutDashboard, Plus, Filter, Square, CalendarIcon, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function PontareAngajat() {
  const [isPontajActiv, setIsPontajActiv] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  
  // Sheet states
  const [isAddTimeOpen, setIsAddTimeOpen] = useState(false);
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  
  // Add Time form state
  const [timeFormData, setTimeFormData] = useState({
    data: format(new Date(), 'dd.MM.yyyy'),
    oraIntrare: '',
    oraIesire: '',
    motiv: ''
  });
  
  // Add Leave form state
  const [leaveFormData, setLeaveFormData] = useState({
    tipConcediu: 'concediu',
    dataStart: format(new Date(), 'dd.MM.yyyy'),
    dataEnd: format(new Date(), 'dd.MM.yyyy'),
    motiv: '',
    excludeWeekend: true
  });

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

  const handleSubmitTimeRequest = () => {
    if (!timeFormData.oraIntrare || !timeFormData.oraIesire) {
      toast.error("Completează orele de intrare și ieșire");
      return;
    }
    toast.success("Cererea de adăugare timp a fost trimisă");
    setIsAddTimeOpen(false);
    setTimeFormData({
      data: format(new Date(), 'dd.MM.yyyy'),
      oraIntrare: '',
      oraIesire: '',
      motiv: ''
    });
  };

  const handleSubmitLeaveRequest = () => {
    toast.success("Cererea de concediu a fost trimisă");
    setIsAddLeaveOpen(false);
    setLeaveFormData({
      tipConcediu: 'concediu',
      dataStart: format(new Date(), 'dd.MM.yyyy'),
      dataEnd: format(new Date(), 'dd.MM.yyyy'),
      motiv: '',
      excludeWeekend: true
    });
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
            <Card 
              className="bg-primary text-primary-foreground border-0 overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => setIsAddTimeOpen(true)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Cerere de pontaj</p>
                  <p className="text-xl font-semibold">Adaugă timp</p>
                </div>
                <div className="h-12 w-12 rounded-full border-2 border-primary-foreground/30 flex items-center justify-center">
                  <Plus className="h-6 w-6" />
                </div>
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

            </div>
          </TabsContent>

          {/* Concedii Tab */}
          <TabsContent value="concedii" className="p-4 space-y-4 mt-0">
            {/* Primary Action Card */}
            <Card 
              className="bg-primary text-primary-foreground border-0 overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => setIsAddLeaveOpen(true)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Depune cerere de concediu</p>
                  <p className="text-xl font-semibold">Cerere nouă</p>
                </div>
                <div className="h-12 w-12 rounded-full border-2 border-primary-foreground/30 flex items-center justify-center">
                  <Plus className="h-6 w-6" />
                </div>
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

      {/* Add Time Sheet */}
      <Sheet open={isAddTimeOpen} onOpenChange={setIsAddTimeOpen}>
        <SheetContent side="bottom" className="h-auto max-h-[90vh] rounded-t-3xl">
          <div className="bg-primary h-16 -mx-6 -mt-6 mb-6 rounded-t-3xl" />
          <SheetHeader className="sr-only">
            <SheetTitle>Adaugă timp</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-4 px-2">
            {/* Data */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Data</Label>
              <div className="relative">
                <Input
                  value={timeFormData.data}
                  onChange={(e) => setTimeFormData({ ...timeFormData, data: e.target.value })}
                  className="pr-10 h-14 text-lg border-border/50 rounded-xl"
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              </div>
            </div>

            {/* Ora de intrare */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Ora de intrare</Label>
              <div className="relative">
                <Input
                  type="time"
                  value={timeFormData.oraIntrare}
                  onChange={(e) => setTimeFormData({ ...timeFormData, oraIntrare: e.target.value })}
                  className="pr-10 h-14 text-lg border-border/50 rounded-xl"
                />
                <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              </div>
            </div>

            {/* Ora de ieșire */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Ora de ieșire</Label>
              <div className="relative">
                <Input
                  type="time"
                  value={timeFormData.oraIesire}
                  onChange={(e) => setTimeFormData({ ...timeFormData, oraIesire: e.target.value })}
                  className="pr-10 h-14 text-lg border-border/50 rounded-xl"
                />
                <ArrowLeft className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              </div>
            </div>

            {/* Motiv */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Motiv</Label>
              <Textarea
                value={timeFormData.motiv}
                onChange={(e) => setTimeFormData({ ...timeFormData, motiv: e.target.value })}
                placeholder="Motiv"
                className="min-h-[100px] border-border/50 rounded-xl resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button 
              onClick={handleSubmitTimeRequest}
              className="w-full h-14 text-lg font-semibold rounded-xl mt-4"
            >
              Trimite cererea
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Leave Sheet */}
      <Sheet open={isAddLeaveOpen} onOpenChange={setIsAddLeaveOpen}>
        <SheetContent side="bottom" className="h-auto max-h-[90vh] rounded-t-3xl">
          <div className="bg-primary h-16 -mx-6 -mt-6 mb-6 rounded-t-3xl" />
          <SheetHeader className="sr-only">
            <SheetTitle>Cerere concediu</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-4 px-2">
            {/* Tip de concediu */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Tip de concediu</Label>
              <Select 
                value={leaveFormData.tipConcediu} 
                onValueChange={(value) => setLeaveFormData({ ...leaveFormData, tipConcediu: value })}
              >
                <SelectTrigger className="h-14 text-lg border-border/50 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concediu">Concedii</SelectItem>
                  <SelectItem value="medical">Concediu medical</SelectItem>
                  <SelectItem value="fara_plata">Fără plată</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* De la data de */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">De la data de</Label>
              <div className="relative">
                <Input
                  value={leaveFormData.dataStart}
                  onChange={(e) => setLeaveFormData({ ...leaveFormData, dataStart: e.target.value })}
                  className="pr-10 h-14 text-lg border-border/50 rounded-xl"
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              </div>
            </div>

            {/* Până în data de */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Până în data de</Label>
              <div className="relative">
                <Input
                  value={leaveFormData.dataEnd}
                  onChange={(e) => setLeaveFormData({ ...leaveFormData, dataEnd: e.target.value })}
                  className="pr-10 h-14 text-lg border-border/50 rounded-xl"
                />
                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              </div>
            </div>

            {/* Motiv */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Motiv (Opțional)</Label>
              <Textarea
                value={leaveFormData.motiv}
                onChange={(e) => setLeaveFormData({ ...leaveFormData, motiv: e.target.value })}
                placeholder="Motiv (Opțional)"
                className="min-h-[100px] border-border/50 rounded-xl resize-none"
              />
            </div>

            {/* Exclude weekend checkbox */}
            <div className="flex items-center gap-3 py-2">
              <Checkbox
                id="excludeWeekend"
                checked={leaveFormData.excludeWeekend}
                onCheckedChange={(checked) => setLeaveFormData({ ...leaveFormData, excludeWeekend: checked as boolean })}
                className="h-6 w-6 rounded-full border-primary data-[state=checked]:bg-primary"
              />
              <Label htmlFor="excludeWeekend" className="text-sm cursor-pointer">
                Concediul va exclude zilele de weekend
              </Label>
            </div>

            {/* Submit Button */}
            <Button 
              onClick={handleSubmitLeaveRequest}
              className="w-full h-14 text-lg font-semibold rounded-xl mt-4"
            >
              Trimite cererea
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
