import { useState } from "react";
import { Search, Bell, User, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function TopBar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  const toggleTheme = () => {
    // Add transitioning class for smooth color transitions
    document.documentElement.classList.add("transitioning");
    
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
    
    // Remove transitioning class after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove("transitioning");
    }, 350);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 sm:h-16 items-center gap-3 sm:gap-4 px-3 sm:px-6">
        <SidebarTrigger className="-ml-1 hover:bg-muted rounded-lg transition-colors" />
        
        <div className="flex-1 flex items-center gap-3 sm:gap-4">
          <Select defaultValue="asfalt-emulsie">
            <SelectTrigger className="w-[140px] sm:w-[200px] text-xs sm:text-sm bg-muted/50 border-0 hover:bg-muted transition-colors">
              <SelectValue placeholder="Gestiune" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asfalt-emulsie">Asfalt + Emulsie</SelectItem>
              <SelectItem value="beton-stabilizat">Beton Stabilizat(BSC)</SelectItem>
              <SelectItem value="betoane">Betoane</SelectItem>
              <SelectItem value="beton-concasat">Beton Concasat</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1 max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground" />
            <Input 
              type="search" 
              placeholder="Căutare globală..." 
              className="pl-10 bg-background border-2 border-foreground/20 placeholder:text-foreground/60 placeholder:font-medium hover:border-foreground/40 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 transition-all shadow-sm" 
            />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="rounded-full h-9 w-9 sm:h-10 sm:w-10 hover:bg-muted transition-colors"
          >
            {theme === "light" ? <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full relative h-9 w-9 sm:h-10 sm:w-10 hover:bg-muted transition-colors overflow-visible">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-md border-2 border-background">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2">
              <DropdownMenuLabel className="text-sm font-semibold">Notificări</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 rounded-lg cursor-pointer">
                <p className="text-sm font-medium">Livrare nouă</p>
                <p className="text-xs text-muted-foreground">Livrare #1234 a fost înregistrată</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 rounded-lg cursor-pointer">
                <p className="text-sm font-medium">Stoc scăzut</p>
                <p className="text-xs text-muted-foreground">Asfalt tip B sub limita minimă</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 rounded-lg cursor-pointer">
                <p className="text-sm font-medium">Raport generat</p>
                <p className="text-xs text-muted-foreground">Raportul lunar este disponibil</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 sm:h-10 sm:w-10 hover:bg-muted transition-colors">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <DropdownMenuLabel className="text-sm font-semibold">Contul meu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-lg cursor-pointer">Profil</DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer">Setări</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive rounded-lg cursor-pointer">
                Deconectare
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}