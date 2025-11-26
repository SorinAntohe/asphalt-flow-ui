import { LayoutDashboard, ListChecks, PackageCheck, Truck, BarChart3 } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logoFull from "@/assets/logo-full.png";
import logoIconDark from "@/assets/logo-icon-dark.png";
import logoIconLight from "@/assets/logo-icon-light.png";
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
      <SidebarHeader className="border-b border-sidebar-border py-2">
        <div className="flex items-center px-2">
          {open ? (
            <img 
              src={logoFull} 
              alt="Duotip Solutions" 
              className="h-10 object-contain"
            />
          ) : (
            <img 
              src={isDark ? logoIconLight : logoIconDark} 
              alt="D" 
              className="h-8 w-8 object-contain"
            />
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold px-4 py-3">
            Meniu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-sidebar-accent"
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
