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
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <BarChart3 className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contabilitate</h1>
          <p className="text-sm text-muted-foreground">Jurnal contabil și balanțe de verificare</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
          <TabsTrigger value="jurnal" className="text-sm flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BookOpen className="h-4 w-4" />
            <span>Jurnal</span>
          </TabsTrigger>
          <TabsTrigger value="balanta" className="text-sm flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Balanță & Fișe</span>
            <span className="sm:hidden">Balanță</span>
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
