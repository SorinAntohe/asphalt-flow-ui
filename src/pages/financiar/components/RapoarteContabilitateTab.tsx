import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { rapoarte } from "../contabilitate-mockData";
import { 
  TrendingUp, 
  Package, 
  Factory, 
  Calendar, 
  CalendarDays, 
  CalendarRange,
  BarChart3,
  Users,
  UserCheck,
  Truck,
  FileDown,
  Eye
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  Package,
  Factory,
  Calendar,
  CalendarDays,
  CalendarRange,
  BarChart3,
  Users,
  UserCheck,
  Truck,
};

const categoryColors: Record<string, string> = {
  Profit: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  Cashflow: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  Marjă: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
  Solduri: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
};

const RapoarteContabilitateTab = () => {
  const groupedRapoarte = rapoarte.reduce((acc, raport) => {
    if (!acc[raport.categorie]) {
      acc[raport.categorie] = [];
    }
    acc[raport.categorie].push(raport);
    return acc;
  }, {} as Record<string, typeof rapoarte>);

  const categoryTitles: Record<string, string> = {
    Profit: 'Profit & Pierdere',
    Cashflow: 'Cashflow',
    Marjă: 'Analiză Marjă',
    Solduri: 'Situații Solduri',
  };

  return (
    <div className="space-y-8">
      {Object.entries(groupedRapoarte).map(([categorie, rapoarteCategorie]) => (
        <div key={categorie} className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-sm ${categoryColors[categorie]}`}>
              {categoryTitles[categorie]}
            </span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rapoarteCategorie.map((raport) => {
              const IconComponent = iconMap[raport.icon] || BarChart3;
              
              return (
                <Card key={raport.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg ${categoryColors[raport.categorie]}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                    </div>
                    <CardTitle className="text-base mt-3">{raport.titlu}</CardTitle>
                    <CardDescription className="text-sm">
                      {raport.descriere}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Vizualizează
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RapoarteContabilitateTab;
