import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Thermometer, Gauge, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const productionData = [
  { time: "06:00", plan: 0, realizat: 0 },
  { time: "07:00", plan: 120, realizat: 115 },
  { time: "08:00", plan: 280, realizat: 295 },
  { time: "09:00", plan: 450, realizat: 480 },
  { time: "10:00", plan: 620, realizat: 650 },
  { time: "11:00", plan: 800, realizat: 820 },
  { time: "12:00", plan: 950, realizat: 980 },
  { time: "13:00", plan: 1100, realizat: 1150 },
  { time: "14:00", plan: 1280, realizat: 1320 },
  { time: "15:00", plan: 1450, realizat: 1480 },
  { time: "16:00", plan: 1600, realizat: null },
  { time: "17:00", plan: 1750, realizat: null },
  { time: "18:00", plan: 1900, realizat: null },
];

type StationStatus = "RUN" | "IDLE" | "STOP";

interface StationCardProps {
  name: string;
  status: StationStatus;
  metrics: { label: string; value: string; icon: React.ReactNode }[];
}

const StationCard = ({ name, status, metrics }: StationCardProps) => {
  const statusColors = {
    RUN: "bg-green-500",
    IDLE: "bg-yellow-500",
    STOP: "bg-destructive",
  };

  const statusBg = {
    RUN: "bg-green-500/10 border-green-500/30",
    IDLE: "bg-yellow-500/10 border-yellow-500/30",
    STOP: "bg-destructive/10 border-destructive/30",
  };

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", statusBg[status])}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{name}</CardTitle>
          <Badge
            variant="outline"
            className={cn(
              "text-xs font-semibold",
              status === "RUN" && "border-green-500 text-green-600 bg-green-500/10",
              status === "IDLE" && "border-yellow-500 text-yellow-600 bg-yellow-500/10",
              status === "STOP" && "border-destructive text-destructive bg-destructive/10"
            )}
          >
            <span className={cn("w-2 h-2 rounded-full mr-1.5", statusColors[status])} />
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                {metric.icon}
                <span>{metric.label}</span>
              </div>
              <span className="font-medium">{metric.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const LiveProductionSection = () => {
  const stations = [
    {
      name: "Stație Asfalt",
      status: "RUN" as StationStatus,
      metrics: [
        { label: "Temperatură mix", value: "165°C", icon: <Thermometer className="h-3.5 w-3.5" /> },
        { label: "Tonaj/oră", value: "85 t/h", icon: <Gauge className="h-3.5 w-3.5" /> },
        { label: "Timp funcționare", value: "6h 45m", icon: <Clock className="h-3.5 w-3.5" /> },
      ],
    },
    {
      name: "Stație Beton",
      status: "IDLE" as StationStatus,
      metrics: [
        { label: "Capacitate", value: "45 m³/h", icon: <Gauge className="h-3.5 w-3.5" /> },
        { label: "Ultima rețetă", value: "C25/30", icon: <Activity className="h-3.5 w-3.5" /> },
        { label: "Timp funcționare", value: "4h 20m", icon: <Clock className="h-3.5 w-3.5" /> },
      ],
    },
    {
      name: "Linie Balast",
      status: "RUN" as StationStatus,
      metrics: [
        { label: "Debit curent", value: "120 t/h", icon: <Gauge className="h-3.5 w-3.5" /> },
        { label: "Ore funcționare", value: "5h 30m", icon: <Clock className="h-3.5 w-3.5" /> },
        { label: "Producție azi", value: "660 t", icon: <Activity className="h-3.5 w-3.5" /> },
      ],
    },
    {
      name: "Linie Concasat",
      status: "STOP" as StationStatus,
      metrics: [
        { label: "Debit curent", value: "0 t/h", icon: <Gauge className="h-3.5 w-3.5" /> },
        { label: "Motiv oprire", value: "Mentenanță", icon: <Activity className="h-3.5 w-3.5" /> },
        { label: "Estimare restart", value: "14:30", icon: <Clock className="h-3.5 w-3.5" /> },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        Live Plant & Producție în Timp Real
      </h3>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Production Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Producție vs Plan</CardTitle>
            <CardDescription>Tonaj produs pe ore</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="time" 
                    className="text-xs" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    unit=" t"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="plan"
                    name="Plan"
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="realizat"
                    name="Realizat"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Station Status Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {stations.map((station) => (
            <StationCard key={station.name} {...station} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveProductionSection;
