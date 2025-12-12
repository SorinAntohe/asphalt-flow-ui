import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { X, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DrillDownData {
  title: string;
  subtitle?: string;
  type: "table" | "chart" | "pie" | "details";
  data: any[];
  columns?: { key: string; label: string; align?: "left" | "right" | "center" }[];
  chartConfig?: {
    xKey: string;
    yKey: string;
    chartType?: "bar" | "line";
    color?: string;
  };
  summary?: { label: string; value: string | number; trend?: number }[];
}

interface DrillDownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DrillDownData | null;
}

const CHART_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const DrillDownDialog = ({ open, onOpenChange, data }: DrillDownDialogProps) => {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[85vh] overflow-hidden p-0" hideCloseButton>
        <DialogHeader className="px-5 pt-4 pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-base font-semibold">{data.title}</DialogTitle>
              {data.subtitle && (
                <p className="text-xs text-muted-foreground mt-0.5">{data.subtitle}</p>
              )}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 max-h-[calc(85vh-80px)]">
          <div className="px-5 py-4 space-y-4">
            {/* Summary Cards */}
            {data.summary && data.summary.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {data.summary.map((item, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/40 border border-border/50">
                    <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-lg font-bold">{item.value}</p>
                      {item.trend !== undefined && (
                        <span className={`text-xs font-semibold flex items-center gap-0.5 ${item.trend >= 0 ? "text-green-600" : "text-destructive"}`}>
                          {item.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {item.trend > 0 ? "+" : ""}{item.trend}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Table View */}
            {data.type === "table" && data.columns && (
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      {data.columns.map((col) => (
                        <TableHead 
                          key={col.key} 
                          className={`text-xs font-semibold ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : ""}`}
                        >
                          {col.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((row, index) => (
                      <TableRow key={index} className="hover:bg-muted/20">
                        {data.columns!.map((col) => (
                          <TableCell 
                            key={col.key} 
                            className={`text-xs ${col.align === "right" ? "text-right tabular-nums" : col.align === "center" ? "text-center" : ""}`}
                          >
                            {typeof row[col.key] === "number" ? row[col.key].toLocaleString() : row[col.key]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Chart View */}
            {data.type === "chart" && data.chartConfig && (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {data.chartConfig.chartType === "line" ? (
                    <LineChart data={data.data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" vertical={false} />
                      <XAxis dataKey={data.chartConfig.xKey} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }} 
                      />
                      <Line type="monotone" dataKey={data.chartConfig.yKey} stroke={data.chartConfig.color || "hsl(var(--primary))"} strokeWidth={2.5} dot={{ fill: data.chartConfig.color || "hsl(var(--primary))", strokeWidth: 0, r: 4 }} />
                    </LineChart>
                  ) : (
                    <BarChart data={data.data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" vertical={false} />
                      <XAxis dataKey={data.chartConfig.xKey} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }} 
                      />
                      <Bar dataKey={data.chartConfig.yKey} fill={data.chartConfig.color || "hsl(var(--primary))"} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            )}

            {/* Pie Chart View */}
            {data.type === "pie" && (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                    >
                      {data.data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Details View */}
            {data.type === "details" && (
              <div className="space-y-3">
                {data.data.map((item, index) => (
                  <div key={index} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm">{item.title || item.name}</p>
                      {item.status && (
                        <Badge variant={item.status === "OK" ? "default" : "destructive"} className="text-xs">
                          {item.status}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(item)
                        .filter(([key]) => !["title", "name", "status"].includes(key))
                        .map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}:</span>
                            <span className="font-medium">{typeof value === "number" ? value.toLocaleString() : String(value)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default DrillDownDialog;
