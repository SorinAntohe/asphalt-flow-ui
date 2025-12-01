import { PieChart, Factory, Briefcase, Package, CheckCircle, Wrench, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLink } from "@/components/NavLink";

const categories = [
  { 
    title: "Producție", 
    description: "Plan vs Real, randament pe rețetă", 
    icon: Factory, 
    url: "/rapoarte/productie",
    color: "text-blue-500"
  },
  { 
    title: "Comercial", 
    description: "Volum livrat, termen mediu în plantă", 
    icon: Briefcase, 
    url: "/rapoarte/comercial",
    color: "text-green-500"
  },
  { 
    title: "Stocuri", 
    description: "Intrări/ieșiri, stoc util, min/max", 
    icon: Package, 
    url: "/rapoarte/stocuri",
    color: "text-orange-500"
  },
  { 
    title: "Calitate", 
    description: "Trend umiditate/temperatură, neconformități", 
    icon: CheckCircle, 
    url: "/rapoarte/calitate",
    color: "text-purple-500"
  },
  { 
    title: "Mentenanță", 
    description: "MTBF/MTTR, cost per utilaj", 
    icon: Wrench, 
    url: "/rapoarte/mentenanta",
    color: "text-red-500"
  },
  { 
    title: "Financiar", 
    description: "Sumar financiar și indicatori", 
    icon: DollarSign, 
    url: "/rapoarte/financiar",
    color: "text-emerald-500"
  },
];

const GalerieRapoarte = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PieChart className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Galerie Rapoarte</h1>
          <p className="text-muted-foreground">Selectează categoria de rapoarte</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <NavLink key={category.title} to={category.url}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className={`p-3 rounded-lg bg-muted ${category.color}`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{category.description}</CardDescription>
              </CardContent>
            </Card>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default GalerieRapoarte;
