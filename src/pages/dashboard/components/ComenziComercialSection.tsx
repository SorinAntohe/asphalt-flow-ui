import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, TrendingUp, Clock, CheckCircle } from "lucide-react";

const ComenziComercialSection = () => {
  const comenziStats = {
    noi: 8,
    inLucru: 15,
    finalizate: 12,
    totalValoare: "245,000 lei",
  };

  const topClienti = [
    { nume: "CNAIR", comenzi: 5, valoare: "125,000 lei" },
    { nume: "Primăria Sector 3", comenzi: 3, valoare: "68,000 lei" },
    { nume: "DRDP București", comenzi: 4, valoare: "52,000 lei" },
  ];

  const ofertePending = [
    { cod: "OF-2024-0089", client: "CNAIR", valoare: "180,000 lei", status: "În aprobare" },
    { cod: "OF-2024-0091", client: "Primăria Buftea", valoare: "45,000 lei", status: "Trimisă" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Status Comenzi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-blue-500/10">
              <p className="text-2xl font-bold text-blue-600">{comenziStats.noi}</p>
              <p className="text-xs text-muted-foreground">Noi</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-yellow-500/10">
              <p className="text-2xl font-bold text-yellow-600">{comenziStats.inLucru}</p>
              <p className="text-xs text-muted-foreground">În lucru</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-500/10">
              <p className="text-2xl font-bold text-green-600">{comenziStats.finalizate}</p>
              <p className="text-xs text-muted-foreground">Finalizate</p>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">Valoare totală</p>
            <p className="text-xl font-bold">{comenziStats.totalValoare}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Top Clienți (perioada)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topClienti.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="font-medium text-sm">{client.nume}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{client.valoare}</p>
                  <p className="text-xs text-muted-foreground">{client.comenzi} comenzi</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Oferte în Așteptare
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ofertePending.map((oferta, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{oferta.cod}</span>
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {oferta.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{oferta.client}</span>
                  <span className="font-medium">{oferta.valoare}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComenziComercialSection;
