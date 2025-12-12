import { Skeleton } from "@/components/ui/skeleton";

// Dashboard skeleton with KPI cards and charts
export const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48 mt-2" />
      </div>
      <Skeleton className="h-10 w-64" />
    </div>
    
    {/* Tabs */}
    <Skeleton className="h-12 w-full max-w-3xl rounded-xl" />
    
    {/* KPI Cards */}
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 rounded-lg border border-border/50 bg-card">
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-3 w-16 mt-2" />
        </div>
      ))}
    </div>
    
    {/* Second row KPIs */}
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 rounded-lg border border-border/50 bg-card">
          <Skeleton className="h-3 w-24 mb-2" />
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-20 mt-2" />
        </div>
      ))}
    </div>
    
    {/* Charts */}
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="p-4 rounded-lg border border-border/50 bg-card">
        <Skeleton className="h-5 w-40 mb-4" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </div>
      <div className="p-4 rounded-lg border border-border/50 bg-card">
        <Skeleton className="h-5 w-48 mb-4" />
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </div>
    </div>
  </div>
);

// Table page skeleton (Liste, Receptii, Livrari, etc.)
export const TablePageSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-56 mt-1" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
    
    {/* Tabs (optional) */}
    <Skeleton className="h-10 w-full max-w-xl rounded-lg" />
    
    {/* Table */}
    <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
      {/* Table header */}
      <div className="flex gap-4 p-3 bg-muted/30 border-b border-border/50">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Table rows */}
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex gap-4 p-3 border-b border-border/30 last:border-0">
          {[...Array(6)].map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
    
    {/* Pagination */}
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-32" />
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded" />
        ))}
      </div>
    </div>
  </div>
);

// Form page skeleton (Add/Edit dialogs content)
export const FormSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="grid grid-cols-2 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>
      ))}
    </div>
    <div className="space-y-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-20 w-full rounded-md" />
    </div>
    <div className="flex justify-end gap-2 pt-4">
      <Skeleton className="h-9 w-20" />
      <Skeleton className="h-9 w-24" />
    </div>
  </div>
);

// Cards grid skeleton (Rapoarte, Galerie)
export const CardsGridSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Header */}
    <div>
      <Skeleton className="h-7 w-40" />
      <Skeleton className="h-4 w-64 mt-1" />
    </div>
    
    {/* Cards grid */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-5 rounded-lg border border-border/50 bg-card">
          <div className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-full mt-2" />
              <Skeleton className="h-3 w-3/4 mt-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Calendar/Planning skeleton
export const CalendarSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-4 w-56 mt-1" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-9 rounded" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-9 rounded" />
      </div>
    </div>
    
    {/* Calendar grid */}
    <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
      {/* Days header */}
      <div className="grid grid-cols-7 gap-px bg-muted/30 border-b border-border/50">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="p-2 text-center">
            <Skeleton className="h-4 w-8 mx-auto" />
          </div>
        ))}
      </div>
      {/* Calendar cells */}
      {[...Array(5)].map((_, row) => (
        <div key={row} className="grid grid-cols-7 gap-px">
          {[...Array(7)].map((_, col) => (
            <div key={col} className="p-2 min-h-[80px] border-b border-r border-border/30 last:border-r-0">
              <Skeleton className="h-4 w-6 mb-2" />
              {row % 2 === 0 && col % 3 === 0 && (
                <Skeleton className="h-5 w-full rounded" />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Financiar/Reports skeleton with summary cards
export const FinanciarSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64 mt-1" />
      </div>
      <Skeleton className="h-9 w-28" />
    </div>
    
    {/* Tabs */}
    <Skeleton className="h-10 w-full max-w-lg rounded-lg" />
    
    {/* Summary cards */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-4 rounded-lg border border-border/50 bg-card">
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-20 mt-2" />
        </div>
      ))}
    </div>
    
    {/* Table */}
    <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
      <div className="flex gap-4 p-3 bg-muted/30 border-b border-border/50">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex gap-4 p-3 border-b border-border/30 last:border-0">
          {[...Array(5)].map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Cantar/Weighing console skeleton
export const CantarSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-56 mt-1" />
      </div>
      <Skeleton className="h-9 w-36" />
    </div>
    
    {/* Queues */}
    <div className="grid gap-6 lg:grid-cols-2">
      {[...Array(2)].map((_, queueIndex) => (
        <div key={queueIndex} className="space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg border border-border/50 bg-card">
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Calculator skeleton
export const CalculatorSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Header */}
    <div>
      <Skeleton className="h-7 w-36" />
      <Skeleton className="h-4 w-64 mt-1" />
    </div>
    
    {/* Calculator cards */}
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Input card */}
      <div className="p-5 rounded-lg border border-border/50 bg-card space-y-4">
        <Skeleton className="h-5 w-36" />
        <div className="space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
      
      {/* Result card */}
      <div className="p-5 rounded-lg border border-border/50 bg-card space-y-4">
        <Skeleton className="h-5 w-32" />
        <div className="text-center py-4">
          <Skeleton className="h-12 w-40 mx-auto" />
          <Skeleton className="h-4 w-24 mx-auto mt-2" />
        </div>
        <Skeleton className="h-9 w-full" />
      </div>
      
      {/* Competition card */}
      <div className="p-5 rounded-lg border border-border/50 bg-card space-y-4">
        <Skeleton className="h-5 w-40" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-between p-2 rounded bg-muted/30">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Trasabilitate skeleton
export const TrasabilitateSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-4 w-56 mt-1" />
      </div>
      <Skeleton className="h-9 w-48" />
    </div>
    
    {/* Tree view */}
    <div className="p-6 rounded-lg border border-border/50 bg-card">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="ml-8 space-y-3 border-l-2 border-border/50 pl-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 rounded" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20 ml-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Auth page skeleton
export const AuthSkeleton = () => (
  <div className="min-h-screen flex items-center justify-center p-4 animate-pulse">
    <div className="w-full max-w-md p-8 rounded-xl border border-border/50 bg-card">
      <div className="text-center mb-8">
        <Skeleton className="h-16 w-16 rounded-xl mx-auto" />
        <Skeleton className="h-6 w-32 mx-auto mt-4" />
        <Skeleton className="h-4 w-48 mx-auto mt-2" />
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <Skeleton className="h-10 w-full rounded-md mt-6" />
      </div>
    </div>
  </div>
);
