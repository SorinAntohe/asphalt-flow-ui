import { useState } from "react";
import { Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ClientiTab from "./components/ClientiTab";
import FurnizoriTab from "./components/FurnizoriTab";
import ScadentarTab from "./components/ScadentarTab";

const ParteneriSolduri = () => {
  const [activeTab, setActiveTab] = useState("clienti");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">Parteneri & Solduri</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="clienti" className="text-sm">Clienți</TabsTrigger>
          <TabsTrigger value="furnizori" className="text-sm">Furnizori</TabsTrigger>
          <TabsTrigger value="scadentar" className="text-sm">Scadențar</TabsTrigger>
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
