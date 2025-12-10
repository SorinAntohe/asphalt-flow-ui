import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, BookOpen, Calculator } from "lucide-react";
import JurnalTab from "./components/JurnalTab";
import BalantaFiseTab from "./components/BalantaFiseTab";

const ContabilitateRapoarte = () => {
  const [activeTab, setActiveTab] = useState("jurnal");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">Contabilitate & Rapoarte</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="jurnal" className="text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Jurnal</span>
          </TabsTrigger>
          <TabsTrigger value="balanta" className="text-sm flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Balanță & Fișe</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jurnal">
          <JurnalTab />
        </TabsContent>

        <TabsContent value="balanta">
          <BalantaFiseTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContabilitateRapoarte;
