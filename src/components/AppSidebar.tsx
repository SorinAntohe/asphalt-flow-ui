import { LayoutDashboard, ListChecks, PackageCheck, Truck, BarChart3, ClipboardList, Package, FolderCog } from "lucide-react";
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
  { title: "Stocuri", url: "/stocuri", icon: Package },
  { title: "Receptii", url: "/receptii", icon: PackageCheck },
  { title: "Livrari", url: "/livrari", icon: Truck },
  { title: "Consumuri", url: "/consumuri", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isDark, setIsDark] = useState(false);
  const isOpen = state === "expanded";

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
  const [gestiuneOpen, setGestiuneOpen] = useState(isGestiuneActive);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border py-3">
        <div className="flex items-center gap-3 px-3">
          {isOpen ? (
            <>
              <img 
                src={logoDWhite} 
                alt="D" 
                className="h-10 w-10 object-contain flex-shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-sidebar-foreground font-bold text-lg leading-tight">DUOTIP</span>
                <span className="text-sidebar-foreground/70 text-sm leading-tight">ERP System</span>
              </div>
            </>
          ) : (
            <img 
              src={logoDWhite} 
              alt="D" 
              className="h-6 w-6 object-contain"
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
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-sidebar-accent text-sidebar-foreground"
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  >
                    <dashboardItem.icon className="w-5 h-5" />
                    {isOpen && <span>{dashboardItem.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Gestiune Dropdown */}
              <Collapsible open={gestiuneOpen} onOpenChange={setGestiuneOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 ease-in-out hover:bg-sidebar-accent text-sidebar-foreground"
                      style={{
                        background: gestiuneOpen ? 'hsl(var(--sidebar-accent))' : 'transparent',
                      }}
                    >
                      <FolderCog className="w-5 h-5" />
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
                    padding: gestiuneOpen ? (isOpen ? '6px' : '8px 4px') : '0',
                    marginTop: gestiuneOpen ? '4px' : '0',
                    marginLeft: isOpen ? '4px' : '0',
                    marginRight: isOpen ? '4px' : '0',
                    width: isOpen ? 'auto' : '100%',
                    maxWidth: isOpen ? 'none' : '48px',
                    boxShadow: gestiuneOpen ? 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                  }}
                >
                  <SidebarMenu className={isOpen ? "space-y-0.5" : "space-y-1.5"} style={{ width: '100%' }}>
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
                              isOpen ? 'gap-3 px-3 py-2' : 'justify-center px-0 py-2.5 w-full'
                            } ${
                              isActive(item.url) 
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold' 
                                : 'hover:bg-sidebar-accent/40'
                            }`}
                            title={!isOpen ? item.title : undefined}
                          >
                            <item.icon className={isOpen ? "w-4 h-4 flex-shrink-0" : "w-5 h-5 flex-shrink-0"} />
                            {isOpen && <span className="text-sm">{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
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
