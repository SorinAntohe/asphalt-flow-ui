import { LayoutDashboard, ListChecks, PackageCheck, Truck, BarChart3, ClipboardList, Package } from "lucide-react";
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

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Liste", url: "/liste", icon: ListChecks },
  { title: "Comenzi", url: "/comenzi", icon: ClipboardList },
  { title: "Stocuri", url: "/stocuri", icon: Package },
  { title: "Receptii", url: "/receptii", icon: PackageCheck },
  { title: "Livrari", url: "/livrari", icon: Truck },
  { title: "Consumuri", url: "/consumuri", icon: BarChart3 },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isDark, setIsDark] = useState(false);

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

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border py-3">
        <div className="flex items-center gap-3 px-3">
          {open ? (
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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold px-4 py-3 text-sidebar-foreground">
            Meniu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-sidebar-accent text-sidebar-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="w-5 h-5" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
