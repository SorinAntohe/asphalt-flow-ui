import { useState } from "react";
import { FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import tab components
import VanzariTab from "./components/VanzariTab";
import AchizitiiTab from "./components/AchizitiiTab";
import BancaCasaTab from "./components/BancaCasaTab";

const DocumenteTrezorerie = () => {
  const [activeTab, setActiveTab] = useState("vanzari");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">Documente & Trezorerie</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="vanzari" className="text-sm">Vânzări (Clienți)</TabsTrigger>
          <TabsTrigger value="achizitii" className="text-sm">Achiziții (Furnizori)</TabsTrigger>
          <TabsTrigger value="banca-casa" className="text-sm">Bancă & Casă</TabsTrigger>
        </TabsList>

        <TabsContent value="vanzari">
          <VanzariTab />
        </TabsContent>

        <TabsContent value="achizitii">
          <AchizitiiTab />
        </TabsContent>

        <TabsContent value="banca-casa">
          <BancaCasaTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumenteTrezorerie;
