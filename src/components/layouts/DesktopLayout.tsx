import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useUserRole } from "@/hooks/useUserRole";
import { 
  LayoutDashboard, School, BookOpen, GraduationCap, Users,
  Settings, LogOut, Bell
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin", color: "#60A5FA" },
  { icon: School, label: "School Management", href: "/admin/onboarding", color: "#34D399" },
  { icon: BookOpen, label: "Class Management", href: "/school-admin/classes", color: "#A78BFA" },
  { icon: GraduationCap, label: "Teacher Management", href: "/school-admin/teachers", color: "#F472B6" },
  { icon: Users, label: "Student Management", href: "/school-admin/students", color: "#FBBF24" },
  { icon: Settings, label: "Settings", href: "/settings", color: "#34D399" },
  { icon: LogOut, label: "Logout", href: "/logout", color: "#F87171" }
];

export const DesktopLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: userRole } = useUserRole();
  const isSuperAdmin = userRole === 'super_admin';

  const filteredMenuItems = isSuperAdmin 
    ? menuItems 
    : menuItems.filter(item => !item.href.includes('onboarding'));

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <div className="fixed inset-y-0 left-0 z-50">
          <Sidebar className="bg-primary border-r border-gray-200 h-screen w-64">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-white">Instaclass</h1>
            </div>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent className="[&_li]:list-none">
                  {filteredMenuItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild>
                        <a 
                          href={item.href} 
                          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary-600/50 transition-colors duration-200"
                        >
                          <item.icon className="h-5 w-5" style={{ color: item.color }} />
                          <span className="text-white">{item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </div>
        <div className="flex-1 ml-64 w-[calc(100%-16rem)]">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <h1 className="text-xl font-semibold text-gray-900">Nypunya</h1>
            <div className="flex items-center gap-4">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="text-gray-900">Anil</span>
            </div>
          </header>
          <main className="p-6 w-full bg-[#F1F1F1] min-h-[calc(100vh-4rem)]">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};