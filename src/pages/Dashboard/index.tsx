import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Package, Truck } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Producție Totală",
      value: "2,450t",
      change: "+12.5%",
      icon: BarChart3,
      trend: "up",
    },
    {
      title: "Livrări Active",
      value: "18",
      change: "+3",
      icon: Truck,
      trend: "up",
    },
    {
      title: "Stoc Disponibil",
      value: "456t",
      change: "-8.2%",
      icon: Package,
      trend: "down",
    },
    {
      title: "Comenzi Noi",
      value: "24",
      change: "+15%",
      icon: TrendingUp,
      trend: "up",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
          Vizualizare generală a operațiunilor de producție
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.change} față de luna trecută
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Activitate Recentă</CardTitle>
            <CardDescription className="text-sm">
              Ultimele operațiuni înregistrate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Livrare #{1234 + i}</p>
                    <p className="text-xs text-muted-foreground truncate">Asfalt tip A - 45t</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">Acum {i}h</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Producție pe Tipuri</CardTitle>
            <CardDescription className="text-sm">
              Distribuție producție ultimele 30 zile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Asfalt tip A</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "45%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Asfalt tip B</span>
                  <span className="font-medium">30%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-chart-2" style={{ width: "30%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-sm">Asfalt tip C</span>
                  <span className="font-medium">25%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-chart-3" style={{ width: "25%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
