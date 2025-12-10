import { useState } from "react";
import { FileText, ShoppingCart, Building2, Wallet } from "lucide-react";
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
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <FileText className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documente & Trezorerie</h1>
          <p className="text-sm text-muted-foreground">Gestionare facturi, livrări și încasări</p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 h-12">
          <TabsTrigger value="vanzari" className="text-sm flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Vânzări (Clienți)</span>
            <span className="sm:hidden">Vânzări</span>
          </TabsTrigger>
          <TabsTrigger value="achizitii" className="text-sm flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Achiziții (Furnizori)</span>
            <span className="sm:hidden">Achiziții</span>
          </TabsTrigger>
          <TabsTrigger value="banca-casa" className="text-sm flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">Bancă & Casă</span>
            <span className="sm:hidden">Bancă</span>
          </TabsTrigger>
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
