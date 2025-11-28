import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Truck, MapPin, Clock, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

type TruckStatus = "in_curte" | "in_drum" | "la_santier" | "intors";

interface TruckData {
  id: string;
  nrAuto: string;
  sofer: string;
  client: string;
  volum: string;
  status: TruckStatus;
  timpEstimat?: string;
}

const trucks: TruckData[] = [
  { id: "1", nrAuto: "B-123-ABC", sofer: "Ion Popescu", client: "Construcții SRL", volum: "28 t", status: "in_drum", timpEstimat: "25 min" },
  { id: "2", nrAuto: "B-456-DEF", sofer: "Vasile Ionescu", client: "Drumuri SA", volum: "32 t", status: "la_santier", timpEstimat: "45 min" },
  { id: "3", nrAuto: "B-789-GHI", sofer: "Gheorghe Marin", client: "Construcții SRL", volum: "30 t", status: "in_curte" },
  { id: "4", nrAuto: "B-012-JKL", sofer: "Nicolae Popa", client: "Asfalt Pro", volum: "25 t", status: "intors", timpEstimat: "10 min" },
  { id: "5", nrAuto: "B-345-MNO", sofer: "Andrei Stan", client: "Drumuri SA", volum: "28 t", status: "in_drum", timpEstimat: "35 min" },
];

const statusConfig: Record<TruckStatus, { label: string; color: string; bgColor: string }> = {
  in_curte: { label: "În curte", color: "text-blue-600", bgColor: "bg-blue-500/10 border-blue-500/30" },
  in_drum: { label: "În drum", color: "text-yellow-600", bgColor: "bg-yellow-500/10 border-yellow-500/30" },
  la_santier: { label: "La șantier", color: "text-green-600", bgColor: "bg-green-500/10 border-green-500/30" },
  intors: { label: "Întors", color: "text-primary", bgColor: "bg-primary/10 border-primary/30" },
};

interface TimelineEvent {
  id: string;
  camion: string;
  client: string;
  events: { type: "incarcare" | "drum" | "descarcare" | "intoarcere"; start: number; duration: number }[];
}

const timelineData: TimelineEvent[] = [
  {
    id: "1",
    camion: "B-123-ABC",
    client: "Construcții SRL",
    events: [
      { type: "incarcare", start: 6, duration: 0.5 },
      { type: "drum", start: 6.5, duration: 1 },
      { type: "descarcare", start: 7.5, duration: 0.5 },
      { type: "intoarcere", start: 8, duration: 1 },
      { type: "incarcare", start: 9, duration: 0.5 },
      { type: "drum", start: 9.5, duration: 1 },
    ],
  },
  {
    id: "2",
    camion: "B-456-DEF",
    client: "Drumuri SA",
    events: [
      { type: "incarcare", start: 7, duration: 0.5 },
      { type: "drum", start: 7.5, duration: 1.5 },
      { type: "descarcare", start: 9, duration: 0.5 },
      { type: "intoarcere", start: 9.5, duration: 1.5 },
    ],
  },
  {
    id: "3",
    camion: "B-789-GHI",
    client: "Asfalt Pro",
    events: [
      { type: "incarcare", start: 8, duration: 0.5 },
      { type: "drum", start: 8.5, duration: 0.75 },
      { type: "descarcare", start: 9.25, duration: 0.5 },
      { type: "intoarcere", start: 9.75, duration: 0.75 },
    ],
  },
];

const eventColors = {
  incarcare: "bg-blue-500",
  drum: "bg-yellow-500",
  descarcare: "bg-green-500",
  intoarcere: "bg-gray-400",
};

const LogisticsSection = () => {
  const hours = Array.from({ length: 13 }, (_, i) => 6 + i);
  const currentHour = new Date().getHours();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Truck className="h-5 w-5 text-primary" />
        Logistică & Planificare (Dispecerat)
      </h3>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timeline Gantt */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Timeline Livrări</CardTitle>
            <CardDescription>Planificare orară camioane</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Header with hours */}
              <div className="flex">
                <div className="w-28 flex-shrink-0" />
                <div className="flex-1 flex">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className={cn(
                        "flex-1 text-xs text-center py-1 border-l border-border",
                        hour === currentHour && "bg-primary/10 font-medium"
                      )}
                    >
                      {hour}:00
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline rows */}
              {timelineData.map((item) => (
                <div key={item.id} className="flex items-center">
                  <div className="w-28 flex-shrink-0 pr-2">
                    <div className="text-sm font-medium truncate">{item.camion}</div>
                    <div className="text-xs text-muted-foreground truncate">{item.client}</div>
                  </div>
                  <div className="flex-1 relative h-8 bg-muted/30 rounded">
                    {item.events.map((event, idx) => {
                      const left = ((event.start - 6) / 12) * 100;
                      const width = (event.duration / 12) * 100;
                      return (
                        <div
                          key={idx}
                          className={cn(
                            "absolute top-1 bottom-1 rounded-sm",
                            eventColors[event.type]
                          )}
                          style={{ left: `${left}%`, width: `${width}%` }}
                          title={`${event.type}: ${event.start}:00 - ${event.start + event.duration}:00`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Legend */}
              <div className="flex gap-4 mt-4 pt-4 border-t">
                {Object.entries(eventColors).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-1.5 text-xs">
                    <span className={cn("w-3 h-3 rounded-sm", color)} />
                    <span className="capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mini Map Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hartă</CardTitle>
            <CardDescription>Locații & camioane</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/20" />
              <div className="relative z-10 text-center p-4">
                <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Hartă interactivă</p>
                <p className="text-xs text-muted-foreground">(integrare ulterioară)</p>
              </div>
              {/* Simulated markers */}
              <div className="absolute top-[20%] left-[30%] w-3 h-3 bg-primary rounded-full animate-pulse" />
              <div className="absolute top-[40%] left-[60%] w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div className="absolute top-[60%] left-[25%] w-3 h-3 bg-yellow-500 rounded-full animate-pulse" />
              <div className="absolute top-[70%] left-[70%] w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trucks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Camioane & Status</CardTitle>
          <CardDescription>Situația curentă a flotei</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nr. Auto</TableHead>
                <TableHead>Șofer</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Volum</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timp Estimat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trucks.map((truck) => (
                <TableRow key={truck.id}>
                  <TableCell className="font-medium">{truck.nrAuto}</TableCell>
                  <TableCell>{truck.sofer}</TableCell>
                  <TableCell>{truck.client}</TableCell>
                  <TableCell>{truck.volum}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-xs", statusConfig[truck.status].bgColor, statusConfig[truck.status].color)}>
                      {statusConfig[truck.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {truck.timpEstimat ? (
                      <span className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        {truck.timpEstimat}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticsSection;
