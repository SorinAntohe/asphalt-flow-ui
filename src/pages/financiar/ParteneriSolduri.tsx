import { useState } from "react";
import { Users, UserCheck, Building2, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ClientiTab from "./components/ClientiTab";
import FurnizoriTab from "./components/FurnizoriTab";
import ScadentarTab from "./components/ScadentarTab";

const ParteneriSolduri = () => {
  const [activeTab, setActiveTab] = useState("clienti");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="p-2 sm:p-2.5 bg-primary/10 rounded-lg sm:rounded-xl">
          <Users className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Parteneri & Solduri</h1>
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Monitorizare solduri clienți și furnizori</p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full flex mb-4 sm:mb-6 h-10 sm:h-12 bg-muted/70 border border-border p-1">
          <TabsTrigger 
            value="clienti" 
            className="flex-1 text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <UserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline sm:inline">Clienți</span>
          </TabsTrigger>
          <TabsTrigger 
            value="furnizori" 
            className="flex-1 text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline sm:inline">Furnizori</span>
          </TabsTrigger>
          <TabsTrigger 
            value="scadentar" 
            className="flex-1 text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline sm:inline">Scadențar</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clienti">
          <ClientiTab />
        </TabsContent>

        <TabsContent value="furnizori">
          <FurnizoriTab />
        </TabsContent>

        <TabsContent value="scadentar">
          <ScadentarTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParteneriSolduri;
