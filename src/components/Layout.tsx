import { ReactNode, memo } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface LayoutProps {
  children: ReactNode;
}

const MainContent = memo(({ children }: { children: ReactNode }) => (
  <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 bg-muted/30 overflow-x-hidden safe-area-inset-bottom">
    <div className="animate-fade-in">
      {children}
    </div>
  </main>
));

MainContent.displayName = "MainContent";

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />
          <MainContent>{children}</MainContent>
        </div>
      </div>
    </SidebarProvider>
  );
}
