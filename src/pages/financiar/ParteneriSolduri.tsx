import { useState } from "react";
import { Users, UserCheck, Building2, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ClientiTab from "./components/ClientiTab";
import FurnizoriTab from "./components/FurnizoriTab";
import ScadentarTab from "./components/ScadentarTab";

const ParteneriSolduri = () => {
  const [activeTab, setActiveTab] = useState("clienti");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <Users className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Parteneri & Solduri</h1>
          <p className="text-sm text-muted-foreground">Monitorizare solduri clienți și furnizori</p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 h-12">
          <TabsTrigger value="clienti" className="text-sm flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <UserCheck className="h-4 w-4" />
            <span>Clienți</span>
          </TabsTrigger>
          <TabsTrigger value="furnizori" className="text-sm flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Building2 className="h-4 w-4" />
            <span>Furnizori</span>
          </TabsTrigger>
          <TabsTrigger value="scadentar" className="text-sm flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Calendar className="h-4 w-4" />
            <span>Scadențar</span>
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
