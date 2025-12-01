import { LayoutDashboard, ListChecks, PackageCheck, Truck, BarChart3, ClipboardList, Package, FolderCog, Users, UserCheck, CalendarClock, Briefcase, Factory, Wrench, FileText, FileCheck, ShoppingCart, CalendarDays, FileBox, FlaskConical, ClipboardCheck, Layers, Calendar, GitBranch, Settings, CalendarRange, HardHat, PieChart, LineChart } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logoFull from "@/assets/logo-full.png";
import logoDWhite from "@/assets/logo-d-white.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

const dashboardItem = { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard };

const gestiuneItems = [
  { title: "Liste", url: "/liste", icon: ListChecks },
  { title: "Comenzi", url: "/comenzi", icon: ClipboardList },
  { title: "Receptii", url: "/receptii", icon: PackageCheck },
  { title: "Livrari", url: "/livrari", icon: Truck },
  { title: "Consumuri", url: "/consumuri", icon: BarChart3 },
  { title: "Stocuri", url: "/stocuri", icon: Package },
];

const resurseUmaneItems = [
  { title: "Lista Angajați", url: "/angajati", icon: UserCheck },
  { title: "Pontaj", url: "/pontaj", icon: CalendarClock },
];

// Comercial module items
const comercialItems = [
  { title: "Oferte & Contracte", url: "/comercial/oferte-contracte", icon: FileCheck },
  { title: "Comenzi Client", url: "/comercial/comenzi", icon: ShoppingCart },
  { title: "Planificare Livrări", url: "/comercial/planificare-livrari", icon: CalendarDays },
  { title: "Documente", url: "/comercial/documente", icon: FileBox },
];

// Productie module items
const productieItems = [
  { title: "Rețete", url: "/productie/retete", icon: FlaskConical },
  { title: "Ordine Producție", url: "/productie/ordine", icon: ClipboardCheck },
  { title: "Loturi & Telemetrie", url: "/productie/loturi", icon: Layers },
  { title: "Calendar Producție", url: "/productie/calendar", icon: Calendar },
  { title: "Trasabilitate", url: "/productie/trasabilitate", icon: GitBranch },
];

// Mentenanta module items
const mentenantaItems = [
  { title: "Echipamente & Flotă", url: "/mentenanta/echipamente", icon: Settings },
  { title: "Plan Mentenanță", url: "/mentenanta/plan", icon: CalendarRange },
  { title: "Ordine de Lucru", url: "/mentenanta/interventii", icon: HardHat },
];

// Rapoarte module items
const rapoarteItems = [
  { title: "Galerie Rapoarte", url: "/rapoarte", icon: PieChart },
  { title: "Rapoarte Producție", url: "/rapoarte/productie", icon: LineChart },
  { title: "Rapoarte Comercial", url: "/rapoarte/comercial", icon: LineChart },
  { title: "Rapoarte Stocuri", url: "/rapoarte/stocuri", icon: LineChart },
  { title: "Rapoarte Calitate", url: "/rapoarte/calitate", icon: LineChart },
  { title: "Rapoarte Mentenanță", url: "/rapoarte/mentenanta", icon: LineChart },
];

export function AppSidebar() {
  const { state, isMobile } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isDark, setIsDark] = useState(false);
  const isOpen = isMobile ? true : state === "expanded";

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  const isActive = (path: string) => currentPath === path;
  const isGestiuneActive = gestiuneItems.some((item) => isActive(item.url));
  const isResurseUmaneActive = resurseUmaneItems.some((item) => isActive(item.url));
  const isComercialActive = comercialItems.some((item) => isActive(item.url));
  const isProductieActive = productieItems.some((item) => isActive(item.url));
  const isMentenantaActive = mentenantaItems.some((item) => isActive(item.url));
  const isRapoarteActive = rapoarteItems.some((item) => isActive(item.url));
  
  const [gestiuneOpen, setGestiuneOpen] = useState(isGestiuneActive);
  const [resurseUmaneOpen, setResurseUmaneOpen] = useState(isResurseUmaneActive);
  const [comercialOpen, setComercialOpen] = useState(isComercialActive);
  const [productieOpen, setProductieOpen] = useState(isProductieActive);
  const [mentenantaOpen, setMentenantaOpen] = useState(isMentenantaActive);
  const [rapoarteOpen, setRapoarteOpen] = useState(isRapoarteActive);

  return (
    <Sidebar collapsible={isMobile ? "offcanvas" : "icon"} className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border h-14 sm:h-16">
        <div className="flex items-center justify-center h-full px-3">
          {isOpen ? (
            <div className="flex items-center gap-3">
              <img 
                src={logoDWhite} 
                alt="D" 
                className="h-10 w-10 object-contain flex-shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-sidebar-foreground font-bold text-lg leading-tight">DUOTIP</span>
                <span className="text-sidebar-foreground/70 text-sm leading-tight">ERP System</span>
              </div>
            </div>
          ) : (
            <img 
              src={logoDWhite} 
              alt="D" 
              className="w-5 h-5 flex-shrink-0 object-contain"
            />
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive(dashboardItem.url)}>
                  <NavLink
                    to={dashboardItem.url}
                    className={`flex items-center rounded-lg transition-colors hover:bg-sidebar-accent text-sidebar-foreground ${
                      isOpen ? 'gap-3 px-4 py-2.5' : 'justify-center py-2.5 w-full'
                    }`}
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    title={!isOpen ? dashboardItem.title : undefined}
                  >
                    <dashboardItem.icon className="w-5 h-5 flex-shrink-0" />
                    {isOpen && <span>{dashboardItem.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Gestiune Dropdown */}
              <Collapsible open={gestiuneOpen} onOpenChange={setGestiuneOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      className={`flex items-center rounded-lg transition-all duration-300 ease-in-out hover:bg-sidebar-accent text-sidebar-foreground ${
                        isOpen ? 'gap-3 px-4 py-2.5' : 'justify-center py-2.5 w-full'
                      }`}
                      style={{
                        background: gestiuneOpen ? 'hsl(var(--sidebar-accent))' : 'transparent',
                      }}
                      title={!isOpen ? 'Gestionare' : undefined}
                    >
                      <FolderCog className="w-5 h-5 flex-shrink-0" />
                      {isOpen && (
                        <>
                          <span className="flex-1">Gestionare</span>
                          <ChevronDown 
                            className="w-4 h-4 transition-transform duration-300" 
                            style={{
                              transform: gestiuneOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}
                          />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent 
                  className="overflow-hidden rounded-md"
                  style={{
                    transition: 'all 0.3s ease',
                    opacity: gestiuneOpen ? 1 : 0,
                    visibility: gestiuneOpen ? 'visible' : 'hidden',
                    transform: gestiuneOpen ? 'translateY(0)' : 'translateY(-10px)',
                    background: gestiuneOpen ? 'hsl(var(--sidebar-accent) / 0.5)' : 'transparent',
                    padding: gestiuneOpen ? (isOpen ? '6px' : '4px 0') : '0',
                    marginTop: gestiuneOpen ? '4px' : '0',
                    marginLeft: '0',
                    marginRight: '0',
                    width: '100%',
                    maxWidth: 'none',
                    boxShadow: gestiuneOpen ? 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                  }}
                >
                  <SidebarMenu className={isOpen ? "space-y-0.5" : "space-y-1"} style={{ width: '100%' }}>
                    {gestiuneItems.map((item, index) => (
                      <SidebarMenuItem 
                        key={item.title}
                        style={{
                          transition: 'opacity 0.3s ease, transform 0.3s ease',
                          transitionDelay: `${index * 50}ms`,
                          width: '100%'
                        }}
                      >
                        <SidebarMenuButton asChild isActive={isActive(item.url)} style={{ width: '100%' }}>
                          <NavLink
                            to={item.url}
                            className={`flex items-center rounded-md transition-all duration-200 text-sidebar-foreground ${
                              isOpen ? 'gap-3 px-3 py-2' : 'justify-center py-2.5 w-full'
                            } ${
                              isActive(item.url) 
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold' 
                                : 'hover:bg-sidebar-accent/40'
                            }`}
                            title={!isOpen ? item.title : undefined}
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {isOpen && <span className="text-sm">{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>

              {/* Resurse Umane Dropdown */}
              <Collapsible open={resurseUmaneOpen} onOpenChange={setResurseUmaneOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      className={`flex items-center rounded-lg transition-all duration-300 ease-in-out hover:bg-sidebar-accent text-sidebar-foreground ${
                        isOpen ? 'gap-3 px-4 py-2.5' : 'justify-center py-2.5 w-full'
                      }`}
                      style={{
                        background: resurseUmaneOpen ? 'hsl(var(--sidebar-accent))' : 'transparent',
                      }}
                      title={!isOpen ? 'Resurse Umane' : undefined}
                    >
                      <Users className="w-5 h-5 flex-shrink-0" />
                      {isOpen && (
                        <>
                          <span className="flex-1">Resurse Umane</span>
                          <ChevronDown 
                            className="w-4 h-4 transition-transform duration-300" 
                            style={{
                              transform: resurseUmaneOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}
                          />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent 
                  className="overflow-hidden rounded-md"
                  style={{
                    transition: 'all 0.3s ease',
                    opacity: resurseUmaneOpen ? 1 : 0,
                    visibility: resurseUmaneOpen ? 'visible' : 'hidden',
                    transform: resurseUmaneOpen ? 'translateY(0)' : 'translateY(-10px)',
                    background: resurseUmaneOpen ? 'hsl(var(--sidebar-accent) / 0.5)' : 'transparent',
                    padding: resurseUmaneOpen ? (isOpen ? '6px' : '4px 0') : '0',
                    marginTop: resurseUmaneOpen ? '4px' : '0',
                    marginLeft: '0',
                    marginRight: '0',
                    width: '100%',
                    maxWidth: 'none',
                    boxShadow: resurseUmaneOpen ? 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                  }}
                >
                  <SidebarMenu className={isOpen ? "space-y-0.5" : "space-y-1"} style={{ width: '100%' }}>
                    {resurseUmaneItems.map((item, index) => (
                      <SidebarMenuItem 
                        key={item.title}
                        style={{
                          transition: 'opacity 0.3s ease, transform 0.3s ease',
                          transitionDelay: `${index * 50}ms`,
                          width: '100%'
                        }}
                      >
                        <SidebarMenuButton asChild isActive={isActive(item.url)} style={{ width: '100%' }}>
                          <NavLink
                            to={item.url}
                            className={`flex items-center rounded-md transition-all duration-200 text-sidebar-foreground ${
                              isOpen ? 'gap-3 px-3 py-2' : 'justify-center py-2.5 w-full'
                            } ${
                              isActive(item.url) 
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold' 
                                : 'hover:bg-sidebar-accent/40'
                            }`}
                            title={!isOpen ? item.title : undefined}
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {isOpen && <span className="text-sm">{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>

              {/* Comercial Dropdown */}
              <Collapsible open={comercialOpen} onOpenChange={setComercialOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      className={`flex items-center rounded-lg transition-all duration-300 ease-in-out hover:bg-sidebar-accent text-sidebar-foreground ${
                        isOpen ? 'gap-3 px-4 py-2.5' : 'justify-center py-2.5 w-full'
                      }`}
                      style={{
                        background: comercialOpen ? 'hsl(var(--sidebar-accent))' : 'transparent',
                      }}
                      title={!isOpen ? 'Comercial' : undefined}
                    >
                      <Briefcase className="w-5 h-5 flex-shrink-0" />
                      {isOpen && (
                        <>
                          <span className="flex-1">Comercial</span>
                          <ChevronDown 
                            className="w-4 h-4 transition-transform duration-300" 
                            style={{
                              transform: comercialOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}
                          />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent 
                  className="overflow-hidden rounded-md"
                  style={{
                    transition: 'all 0.3s ease',
                    opacity: comercialOpen ? 1 : 0,
                    visibility: comercialOpen ? 'visible' : 'hidden',
                    transform: comercialOpen ? 'translateY(0)' : 'translateY(-10px)',
                    background: comercialOpen ? 'hsl(var(--sidebar-accent) / 0.5)' : 'transparent',
                    padding: comercialOpen ? (isOpen ? '6px' : '4px 0') : '0',
                    marginTop: comercialOpen ? '4px' : '0',
                    marginLeft: '0',
                    marginRight: '0',
                    width: '100%',
                    maxWidth: 'none',
                    boxShadow: comercialOpen ? 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                  }}
                >
                  <SidebarMenu className={isOpen ? "space-y-0.5" : "space-y-1"} style={{ width: '100%' }}>
                    {comercialItems.length > 0 ? comercialItems.map((item, index) => (
                      <SidebarMenuItem 
                        key={item.title}
                        style={{
                          transition: 'opacity 0.3s ease, transform 0.3s ease',
                          transitionDelay: `${index * 50}ms`,
                          width: '100%'
                        }}
                      >
                        <SidebarMenuButton asChild isActive={isActive(item.url)} style={{ width: '100%' }}>
                          <NavLink
                            to={item.url}
                            className={`flex items-center rounded-md transition-all duration-200 text-sidebar-foreground ${
                              isOpen ? 'gap-3 px-3 py-2' : 'justify-center py-2.5 w-full'
                            } ${
                              isActive(item.url) 
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold' 
                                : 'hover:bg-sidebar-accent/40'
                            }`}
                            title={!isOpen ? item.title : undefined}
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {isOpen && <span className="text-sm">{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )) : (
                      <SidebarMenuItem>
                        <span className={`text-sidebar-foreground/50 text-xs ${isOpen ? 'px-3 py-2' : 'py-2 text-center'}`}>
                          {isOpen ? 'În curând...' : '...'}
                        </span>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>

              {/* Productie Dropdown */}
              <Collapsible open={productieOpen} onOpenChange={setProductieOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      className={`flex items-center rounded-lg transition-all duration-300 ease-in-out hover:bg-sidebar-accent text-sidebar-foreground ${
                        isOpen ? 'gap-3 px-4 py-2.5' : 'justify-center py-2.5 w-full'
                      }`}
                      style={{
                        background: productieOpen ? 'hsl(var(--sidebar-accent))' : 'transparent',
                      }}
                      title={!isOpen ? 'Producție' : undefined}
                    >
                      <Factory className="w-5 h-5 flex-shrink-0" />
                      {isOpen && (
                        <>
                          <span className="flex-1">Producție</span>
                          <ChevronDown 
                            className="w-4 h-4 transition-transform duration-300" 
                            style={{
                              transform: productieOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}
                          />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent 
                  className="overflow-hidden rounded-md"
                  style={{
                    transition: 'all 0.3s ease',
                    opacity: productieOpen ? 1 : 0,
                    visibility: productieOpen ? 'visible' : 'hidden',
                    transform: productieOpen ? 'translateY(0)' : 'translateY(-10px)',
                    background: productieOpen ? 'hsl(var(--sidebar-accent) / 0.5)' : 'transparent',
                    padding: productieOpen ? (isOpen ? '6px' : '4px 0') : '0',
                    marginTop: productieOpen ? '4px' : '0',
                    marginLeft: '0',
                    marginRight: '0',
                    width: '100%',
                    maxWidth: 'none',
                    boxShadow: productieOpen ? 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                  }}
                >
                  <SidebarMenu className={isOpen ? "space-y-0.5" : "space-y-1"} style={{ width: '100%' }}>
                    {productieItems.length > 0 ? productieItems.map((item, index) => (
                      <SidebarMenuItem 
                        key={item.title}
                        style={{
                          transition: 'opacity 0.3s ease, transform 0.3s ease',
                          transitionDelay: `${index * 50}ms`,
                          width: '100%'
                        }}
                      >
                        <SidebarMenuButton asChild isActive={isActive(item.url)} style={{ width: '100%' }}>
                          <NavLink
                            to={item.url}
                            className={`flex items-center rounded-md transition-all duration-200 text-sidebar-foreground ${
                              isOpen ? 'gap-3 px-3 py-2' : 'justify-center py-2.5 w-full'
                            } ${
                              isActive(item.url) 
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold' 
                                : 'hover:bg-sidebar-accent/40'
                            }`}
                            title={!isOpen ? item.title : undefined}
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {isOpen && <span className="text-sm">{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )) : (
                      <SidebarMenuItem>
                        <span className={`text-sidebar-foreground/50 text-xs ${isOpen ? 'px-3 py-2' : 'py-2 text-center'}`}>
                          {isOpen ? 'În curând...' : '...'}
                        </span>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>

              {/* Mentenanta Dropdown */}
              <Collapsible open={mentenantaOpen} onOpenChange={setMentenantaOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      className={`flex items-center rounded-lg transition-all duration-300 ease-in-out hover:bg-sidebar-accent text-sidebar-foreground ${
                        isOpen ? 'gap-3 px-4 py-2.5' : 'justify-center py-2.5 w-full'
                      }`}
                      style={{
                        background: mentenantaOpen ? 'hsl(var(--sidebar-accent))' : 'transparent',
                      }}
                      title={!isOpen ? 'Mentenanță' : undefined}
                    >
                      <Wrench className="w-5 h-5 flex-shrink-0" />
                      {isOpen && (
                        <>
                          <span className="flex-1">Mentenanță</span>
                          <ChevronDown 
                            className="w-4 h-4 transition-transform duration-300" 
                            style={{
                              transform: mentenantaOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}
                          />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent 
                  className="overflow-hidden rounded-md"
                  style={{
                    transition: 'all 0.3s ease',
                    opacity: mentenantaOpen ? 1 : 0,
                    visibility: mentenantaOpen ? 'visible' : 'hidden',
                    transform: mentenantaOpen ? 'translateY(0)' : 'translateY(-10px)',
                    background: mentenantaOpen ? 'hsl(var(--sidebar-accent) / 0.5)' : 'transparent',
                    padding: mentenantaOpen ? (isOpen ? '6px' : '4px 0') : '0',
                    marginTop: mentenantaOpen ? '4px' : '0',
                    marginLeft: '0',
                    marginRight: '0',
                    width: '100%',
                    maxWidth: 'none',
                    boxShadow: mentenantaOpen ? 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                  }}
                >
                  <SidebarMenu className={isOpen ? "space-y-0.5" : "space-y-1"} style={{ width: '100%' }}>
                    {mentenantaItems.length > 0 ? mentenantaItems.map((item, index) => (
                      <SidebarMenuItem 
                        key={item.title}
                        style={{
                          transition: 'opacity 0.3s ease, transform 0.3s ease',
                          transitionDelay: `${index * 50}ms`,
                          width: '100%'
                        }}
                      >
                        <SidebarMenuButton asChild isActive={isActive(item.url)} style={{ width: '100%' }}>
                          <NavLink
                            to={item.url}
                            className={`flex items-center rounded-md transition-all duration-200 text-sidebar-foreground ${
                              isOpen ? 'gap-3 px-3 py-2' : 'justify-center py-2.5 w-full'
                            } ${
                              isActive(item.url) 
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold' 
                                : 'hover:bg-sidebar-accent/40'
                            }`}
                            title={!isOpen ? item.title : undefined}
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {isOpen && <span className="text-sm">{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )) : (
                      <SidebarMenuItem>
                        <span className={`text-sidebar-foreground/50 text-xs ${isOpen ? 'px-3 py-2' : 'py-2 text-center'}`}>
                          {isOpen ? 'În curând...' : '...'}
                        </span>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>

              {/* Rapoarte Dropdown */}
              <Collapsible open={rapoarteOpen} onOpenChange={setRapoarteOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      className={`flex items-center rounded-lg transition-all duration-300 ease-in-out hover:bg-sidebar-accent text-sidebar-foreground ${
                        isOpen ? 'gap-3 px-4 py-2.5' : 'justify-center py-2.5 w-full'
                      }`}
                      style={{
                        background: rapoarteOpen ? 'hsl(var(--sidebar-accent))' : 'transparent',
                      }}
                      title={!isOpen ? 'Rapoarte' : undefined}
                    >
                      <FileText className="w-5 h-5 flex-shrink-0" />
                      {isOpen && (
                        <>
                          <span className="flex-1">Rapoarte</span>
                          <ChevronDown 
                            className="w-4 h-4 transition-transform duration-300" 
                            style={{
                              transform: rapoarteOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}
                          />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent 
                  className="overflow-hidden rounded-md"
                  style={{
                    transition: 'all 0.3s ease',
                    opacity: rapoarteOpen ? 1 : 0,
                    visibility: rapoarteOpen ? 'visible' : 'hidden',
                    transform: rapoarteOpen ? 'translateY(0)' : 'translateY(-10px)',
                    background: rapoarteOpen ? 'hsl(var(--sidebar-accent) / 0.5)' : 'transparent',
                    padding: rapoarteOpen ? (isOpen ? '6px' : '4px 0') : '0',
                    marginTop: rapoarteOpen ? '4px' : '0',
                    marginLeft: '0',
                    marginRight: '0',
                    width: '100%',
                    maxWidth: 'none',
                    boxShadow: rapoarteOpen ? 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                  }}
                >
                  <SidebarMenu className={isOpen ? "space-y-0.5" : "space-y-1"} style={{ width: '100%' }}>
                    {rapoarteItems.length > 0 ? rapoarteItems.map((item, index) => (
                      <SidebarMenuItem 
                        key={item.title}
                        style={{
                          transition: 'opacity 0.3s ease, transform 0.3s ease',
                          transitionDelay: `${index * 50}ms`,
                          width: '100%'
                        }}
                      >
                        <SidebarMenuButton asChild isActive={isActive(item.url)} style={{ width: '100%' }}>
                          <NavLink
                            to={item.url}
                            className={`flex items-center rounded-md transition-all duration-200 text-sidebar-foreground ${
                              isOpen ? 'gap-3 px-3 py-2' : 'justify-center py-2.5 w-full'
                            } ${
                              isActive(item.url) 
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold' 
                                : 'hover:bg-sidebar-accent/40'
                            }`}
                            title={!isOpen ? item.title : undefined}
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {isOpen && <span className="text-sm">{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )) : (
                      <SidebarMenuItem>
                        <span className={`text-sidebar-foreground/50 text-xs ${isOpen ? 'px-3 py-2' : 'py-2 text-center'}`}>
                          {isOpen ? 'În curând...' : '...'}
                        </span>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenu>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
