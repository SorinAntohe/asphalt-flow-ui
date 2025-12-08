import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  ShoppingCart,
  FileText,
  Users,
  Truck,
  Package,
  BookOpen,
  Calculator,
  UserCircle,
  Building,
  ArrowRight,
  Eye,
  Edit,
  ExternalLink,
  Command,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  fuzzyMatch,
  calculateRelevance,
  SearchResult,
  SearchResultType,
  searchTypeConfig,
} from "@/lib/searchUtils";

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  ShoppingCart,
  FileText,
  Users,
  Truck,
  Package,
  BookOpen,
  Calculator,
  UserCircle,
  Building,
};

// Mock data - in production, this would come from API
const mockSearchData: Omit<SearchResult, 'relevance'>[] = [
  // Comenzi
  { id: 'cmd-001', type: 'comenzi', title: 'CMD-2024-001', subtitle: 'Client: Costrucții Moderne SRL - BA 16 - 500t', route: '/comercial/comenzi?open=CMD-2024-001', icon: 'ShoppingCart', quickActions: [{ label: 'Deschide', action: 'open', icon: 'Eye' }, { label: 'Editează', action: 'edit', icon: 'Edit' }] },
  { id: 'cmd-002', type: 'comenzi', title: 'CMD-2024-002', subtitle: 'Client: Drumuri Nationale SA - MASF 16 - 1200t', route: '/comercial/comenzi?open=CMD-2024-002', icon: 'ShoppingCart', quickActions: [{ label: 'Deschide', action: 'open', icon: 'Eye' }, { label: 'Editează', action: 'edit', icon: 'Edit' }] },
  { id: 'cmd-003', type: 'comenzi', title: 'CMD-2024-003', subtitle: 'Client: Autostrada Transilvania - AB 16 - 800t', route: '/comercial/comenzi?open=CMD-2024-003', icon: 'ShoppingCart', quickActions: [{ label: 'Deschide', action: 'open', icon: 'Eye' }, { label: 'Editează', action: 'edit', icon: 'Edit' }] },
  { id: 'cmd-mp-001', type: 'comenzi', title: 'CMP-2024-001', subtitle: 'Furnizor: Petrom SA - Bitum 50/70 - 20t', route: '/comenzi?tab=materie-prima&open=CMP-2024-001', icon: 'ShoppingCart', quickActions: [{ label: 'Deschide', action: 'open', icon: 'Eye' }] },
  
  // Avize
  { id: 'avz-001', type: 'avize', title: 'AVZ-2024-1234', subtitle: 'Costrucții Moderne SRL - 25.5t BA 16', route: '/comercial/documente?tab=avize&open=AVZ-2024-1234', icon: 'FileText', quickActions: [{ label: 'Vizualizează', action: 'view', icon: 'Eye' }, { label: 'Descarcă PDF', action: 'download' }] },
  { id: 'avz-002', type: 'avize', title: 'AVZ-2024-1235', subtitle: 'Drumuri Nationale SA - 30t MASF 16', route: '/comercial/documente?tab=avize&open=AVZ-2024-1235', icon: 'FileText', quickActions: [{ label: 'Vizualizează', action: 'view', icon: 'Eye' }] },
  { id: 'avz-003', type: 'avize', title: 'AVZ-2024-1236', subtitle: 'Autostrada Transilvania - 28t AB 16', route: '/comercial/documente?tab=avize&open=AVZ-2024-1236', icon: 'FileText', quickActions: [{ label: 'Vizualizează', action: 'view', icon: 'Eye' }] },
  
  // Clienți
  { id: 'cli-001', type: 'clienti', title: 'Costrucții Moderne SRL', subtitle: 'CUI: RO12345678 • București, Sector 1', route: '/liste?tab=clienti&open=cli-001', icon: 'Users', quickActions: [{ label: 'Profil Client', action: 'profile', icon: 'Eye' }, { label: 'Comenzi Client', action: 'orders' }] },
  { id: 'cli-002', type: 'clienti', title: 'Drumuri Nationale SA', subtitle: 'CUI: RO87654321 • București, Sector 3', route: '/liste?tab=clienti&open=cli-002', icon: 'Users', quickActions: [{ label: 'Profil Client', action: 'profile', icon: 'Eye' }] },
  { id: 'cli-003', type: 'clienti', title: 'Autostrada Transilvania SRL', subtitle: 'CUI: RO11223344 • Cluj-Napoca', route: '/liste?tab=clienti&open=cli-003', icon: 'Users', quickActions: [{ label: 'Profil Client', action: 'profile', icon: 'Eye' }] },
  { id: 'cli-004', type: 'clienti', title: 'Șoseaua Vest Construct', subtitle: 'CUI: RO55667788 • Timișoara', route: '/liste?tab=clienti&open=cli-004', icon: 'Users', quickActions: [{ label: 'Profil Client', action: 'profile', icon: 'Eye' }] },
  
  // Vehicule
  { id: 'veh-001', type: 'vehicule', title: 'B-123-ABC', subtitle: 'Articulata • 40t • Propriu', route: '/liste?tab=autoturisme&open=veh-001', icon: 'Truck', quickActions: [{ label: 'Detalii', action: 'details', icon: 'Eye' }, { label: 'Istoric Curse', action: 'history' }] },
  { id: 'veh-002', type: 'vehicule', title: 'CJ-456-DEF', subtitle: '8X4 • 30t • Propriu', route: '/liste?tab=autoturisme&open=veh-002', icon: 'Truck', quickActions: [{ label: 'Detalii', action: 'details', icon: 'Eye' }] },
  { id: 'veh-003', type: 'vehicule', title: 'TM-789-GHI', subtitle: '4X2 • 12t • Închiriat', route: '/liste?tab=autoturisme&open=veh-003', icon: 'Truck', quickActions: [{ label: 'Detalii', action: 'details', icon: 'Eye' }] },
  
  // Loturi
  { id: 'lot-001', type: 'loturi', title: 'LOT-2024-0001', subtitle: 'BA 16 • 150t • QC: Aprobat', route: '/productie/loturi?open=LOT-2024-0001', icon: 'Package', quickActions: [{ label: 'Detalii Lot', action: 'details', icon: 'Eye' }, { label: 'Trasabilitate', action: 'trace' }] },
  { id: 'lot-002', type: 'loturi', title: 'LOT-2024-0002', subtitle: 'MASF 16 • 200t • QC: În așteptare', route: '/productie/loturi?open=LOT-2024-0002', icon: 'Package', quickActions: [{ label: 'Detalii Lot', action: 'details', icon: 'Eye' }] },
  { id: 'lot-003', type: 'loturi', title: 'LOT-2024-0003', subtitle: 'AB 16 • 180t • QC: Aprobat', route: '/productie/loturi?open=LOT-2024-0003', icon: 'Package', quickActions: [{ label: 'Detalii Lot', action: 'details', icon: 'Eye' }] },
  
  // Rețete
  { id: 'ret-001', type: 'retete', title: 'BA 16', subtitle: 'Beton asfaltic • 12 componente', route: '/productie/retete?open=BA16', icon: 'BookOpen', quickActions: [{ label: 'Vizualizează', action: 'view', icon: 'Eye' }, { label: 'Calculator Preț', action: 'calculator' }] },
  { id: 'ret-002', type: 'retete', title: 'MASF 16', subtitle: 'Mixtură asfaltică • 10 componente', route: '/productie/retete?open=MASF16', icon: 'BookOpen', quickActions: [{ label: 'Vizualizează', action: 'view', icon: 'Eye' }] },
  { id: 'ret-003', type: 'retete', title: 'AB 16', subtitle: 'Asfalt beton • 11 componente', route: '/productie/retete?open=AB16', icon: 'BookOpen', quickActions: [{ label: 'Vizualizează', action: 'view', icon: 'Eye' }] },
  { id: 'ret-004', type: 'retete', title: 'Emulsie Cationica', subtitle: 'Emulsie bituminoasă • 5 componente', route: '/productie/retete?open=EMC', icon: 'BookOpen', quickActions: [{ label: 'Vizualizează', action: 'view', icon: 'Eye' }] },
  
  // Costuri
  { id: 'cost-001', type: 'costuri', title: 'Calcul BA 16 - 500t', subtitle: 'Preț: 450 RON/t • Marjă: 15%', route: '/comercial/calculator', icon: 'Calculator', quickActions: [{ label: 'Recalculează', action: 'recalculate' }] },
  { id: 'cost-002', type: 'costuri', title: 'Calcul MASF 16 - 1000t', subtitle: 'Preț: 380 RON/t • Marjă: 12%', route: '/comercial/calculator', icon: 'Calculator', quickActions: [{ label: 'Recalculează', action: 'recalculate' }] },
  
  // Angajați
  { id: 'ang-001', type: 'angajati', title: 'Ion Popescu', subtitle: 'Operator Stație • Activ', route: '/liste?tab=angajati&open=ang-001', icon: 'UserCircle', quickActions: [{ label: 'Profil', action: 'profile', icon: 'Eye' }, { label: 'Pontaj', action: 'timesheet' }] },
  { id: 'ang-002', type: 'angajati', title: 'Maria Ionescu', subtitle: 'Șef Schimb • Activ', route: '/liste?tab=angajati&open=ang-002', icon: 'UserCircle', quickActions: [{ label: 'Profil', action: 'profile', icon: 'Eye' }] },
  { id: 'ang-003', type: 'angajati', title: 'Andrei Vasilescu', subtitle: 'Șofer • Activ', route: '/liste?tab=angajati&open=ang-003', icon: 'UserCircle', quickActions: [{ label: 'Profil', action: 'profile', icon: 'Eye' }] },
  
  // Furnizori
  { id: 'fur-001', type: 'furnizori', title: 'Petrom SA', subtitle: 'CUI: RO1234567890 • Bitum, Motorină', route: '/liste?tab=furnizori&open=fur-001', icon: 'Building', quickActions: [{ label: 'Profil', action: 'profile', icon: 'Eye' }, { label: 'Comenzi', action: 'orders' }] },
  { id: 'fur-002', type: 'furnizori', title: 'Cariere Vest SRL', subtitle: 'CUI: RO9876543210 • Agregate, Cribluri', route: '/liste?tab=furnizori&open=fur-002', icon: 'Building', quickActions: [{ label: 'Profil', action: 'profile', icon: 'Eye' }] },
  { id: 'fur-003', type: 'furnizori', title: 'Holcim Romania', subtitle: 'CUI: RO5544332211 • Filler, Ciment', route: '/liste?tab=furnizori&open=fur-003', icon: 'Building', quickActions: [{ label: 'Profil', action: 'profile', icon: 'Eye' }] },
];

const filterTabs: { value: SearchResultType | 'all'; label: string }[] = [
  { value: 'all', label: 'Toate' },
  { value: 'comenzi', label: 'Comenzi' },
  { value: 'avize', label: 'Avize' },
  { value: 'clienti', label: 'Clienți' },
  { value: 'vehicule', label: 'Vehicule' },
  { value: 'loturi', label: 'Loturi' },
  { value: 'retete', label: 'Rețete' },
  { value: 'costuri', label: 'Costuri' },
];

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<SearchResultType | 'all'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  // Search and filter results
  const searchResults = useMemo(() => {
    if (query.length < 2) return [];

    setIsSearching(true);
    
    const results = mockSearchData
      .filter(item => {
        // Type filter
        if (activeFilter !== 'all' && item.type !== activeFilter) return false;
        
        // Fuzzy search on title and subtitle
        const searchText = `${item.title} ${item.subtitle}`;
        return fuzzyMatch(query, searchText);
      })
      .map(item => ({
        ...item,
        relevance: calculateRelevance(query, `${item.title} ${item.subtitle}`, item.id.includes('2024')),
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 15);

    setTimeout(() => setIsSearching(false), 100);
    return results;
  }, [query, activeFilter]);

  // Group results by type
  const groupedResults = useMemo(() => {
    const groups: Record<SearchResultType, SearchResult[]> = {
      comenzi: [],
      avize: [],
      clienti: [],
      vehicule: [],
      loturi: [],
      retete: [],
      costuri: [],
      angajati: [],
      furnizori: [],
    };

    searchResults.forEach(result => {
      groups[result.type].push(result);
    });

    return Object.entries(groups).filter(([_, items]) => items.length > 0);
  }, [searchResults]);

  // Flatten results for keyboard navigation
  const flatResults = useMemo(() => {
    return groupedResults.flatMap(([_, items]) => items);
  }, [groupedResults]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, flatResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (flatResults[selectedIndex]) {
          handleSelectResult(flatResults[selectedIndex]);
        }
        break;
      case 'Escape':
        onOpenChange(false);
        break;
    }
  }, [flatResults, selectedIndex, onOpenChange]);

  // Handle result selection
  const handleSelectResult = (result: SearchResult) => {
    navigate(result.route);
    onOpenChange(false);
    setQuery("");
  };

  // Handle quick action
  const handleQuickAction = (e: React.MouseEvent, result: SearchResult, action: string) => {
    e.stopPropagation();
    
    // Build proper route based on action type
    let targetRoute = result.route;
    
    switch (action) {
      case 'open':
      case 'view':
      case 'details':
      case 'profile':
        // These actions should open the detail dialog - use result.route which already has ?open=xxx
        targetRoute = result.route;
        break;
      case 'edit':
        // Add edit action parameter
        targetRoute = result.route.includes('?') 
          ? `${result.route}&action=edit` 
          : `${result.route}?action=edit`;
        break;
      case 'calculator':
        // Navigate to calculator with recipe pre-selected
        targetRoute = `/comercial/calculator?reteta=${result.id.replace('ret-', '')}`;
        break;
      case 'trace':
        // Navigate to trasabilitate with lot code
        targetRoute = `/productie/trasabilitate?lot=${result.title}`;
        break;
      case 'timesheet':
        // Navigate to pontaj for employee
        targetRoute = `/pontare?angajat=${result.id}`;
        break;
      case 'orders':
        // Navigate to comenzi filtered by client/supplier
        if (result.type === 'clienti') {
          targetRoute = `/comercial/comenzi?client=${encodeURIComponent(result.title)}`;
        } else if (result.type === 'furnizori') {
          targetRoute = `/comenzi?tab=materie-prima&furnizor=${encodeURIComponent(result.title)}`;
        }
        break;
      case 'history':
        // Navigate to vehicle history
        targetRoute = `/liste?tab=autoturisme&open=${result.id}&view=history`;
        break;
      case 'recalculate':
        // Go to calculator
        targetRoute = '/comercial/calculator';
        break;
      case 'download':
        // For document download - still navigate to see the document
        targetRoute = result.route;
        break;
      default:
        targetRoute = result.route;
    }
    
    navigate(targetRoute);
    onOpenChange(false);
    setQuery("");
  };

  // Close and reset on dialog close
  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveFilter('all');
      setSelectedIndex(0);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-2xl sm:max-w-2xl max-w-[calc(100vw-1rem)] p-0 gap-0 overflow-hidden"
        hideCloseButton
      >
        <DialogTitle className="sr-only">Căutare Globală</DialogTitle>
        
        {/* Search Input */}
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Caută comenzi, clienți, vehicule..."
            className="flex-1 border-0 shadow-none focus-visible:ring-0 text-sm sm:text-base placeholder:text-muted-foreground/60 h-9 sm:h-10"
            autoFocus
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setQuery("")}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-4 py-1.5 sm:py-2 border-b border-border overflow-x-auto scrollbar-none">
          {filterTabs.map(tab => (
            <Button
              key={tab.value}
              variant={activeFilter === tab.value ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-6 sm:h-7 text-[10px] sm:text-xs whitespace-nowrap px-2 sm:px-3",
                activeFilter === tab.value && "bg-primary text-primary-foreground"
              )}
              onClick={() => setActiveFilter(tab.value)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Results */}
        <ScrollArea className="max-h-[50vh] sm:max-h-[400px]">
          <div className="p-1.5 sm:p-2">
            {query.length < 2 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Introduceți cel puțin 2 caractere pentru a căuta</p>
                <p className="text-xs mt-1 opacity-70">Căutarea tolerează diacritice și typo-uri</p>
              </div>
            ) : isSearching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">Niciun rezultat pentru "{query}"</p>
                <p className="text-xs mt-1 opacity-70">Încercați alte cuvinte cheie</p>
              </div>
            ) : (
              groupedResults.map(([type, items]) => {
                const config = searchTypeConfig[type as SearchResultType];
                const IconComponent = iconMap[config.icon];

                return (
                  <div key={type} className="mb-3 last:mb-0">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      <IconComponent className={cn("w-3.5 h-3.5", config.color)} />
                      {config.label}
                      <Badge variant="secondary" className="h-4 text-[10px] px-1.5">
                        {items.length}
                      </Badge>
                    </div>
                    
                    {items.map((result, idx) => {
                      const globalIdx = flatResults.indexOf(result);
                      const isSelected = globalIdx === selectedIndex;
                      const ResultIcon = iconMap[result.icon];

                      return (
                        <div
                          key={result.id}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors group",
                            isSelected ? "bg-accent" : "hover:bg-accent/50"
                          )}
                          onClick={() => handleSelectResult(result)}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                        >
                          <div className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                            "bg-muted/80"
                          )}>
                            <ResultIcon className={cn("w-4 h-4", config.color)} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{result.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                          </div>

                          {/* Quick Actions */}
                          <div className={cn(
                            "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
                            isSelected && "opacity-100"
                          )}>
                            {result.quickActions?.slice(0, 2).map((action, actionIdx) => (
                              <Button
                                key={actionIdx}
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs px-2"
                                onClick={(e) => handleQuickAction(e, result, action.action)}
                              >
                                {action.icon === 'Eye' && <Eye className="w-3 h-3 mr-1" />}
                                {action.icon === 'Edit' && <Edit className="w-3 h-3 mr-1" />}
                                {action.label}
                              </Button>
                            ))}
                            <ArrowRight className="w-4 h-4 text-muted-foreground ml-1" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        {searchResults.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/30 text-xs text-muted-foreground">
            <span>{searchResults.length} rezultate</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">↓</kbd>
                navigare
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">↵</kbd>
                selectare
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border">esc</kbd>
                închide
              </span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
