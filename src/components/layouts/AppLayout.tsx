import { useIsMobile } from "@/hooks/use-mobile";
import { DesktopLayout } from "./DesktopLayout";
import { MobileLayout } from "./MobileLayout";
import { Sidebar } from "@/components/ui/sidebar";
import { useUserRole } from "@/hooks/useUserRole";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const { data: userRole } = useUserRole();
  const isSuperAdmin = userRole === 'super_admin';
  
  const navigationItems = [
    {
      title: "Dashboard",
      href: "/admin",
    },
    {
      title: "School Management",
      href: "/admin/onboarding",
    },
    {
      title: "Class Management",
      href: "/school-admin/classes",
    },
    {
      title: "Teacher Management",
      href: "/school-admin/teachers",
    },
    {
      title: "Student Management",
      href: "/school-admin/students",
    },
  ];

  const filteredNavigation = isSuperAdmin 
    ? navigationItems 
    : navigationItems.filter(item => !item.href.includes('onboarding'));
  
  return isMobile ? (
    <MobileLayout>
      <div className="flex min-h-screen">
        <Sidebar items={filteredNavigation} />
        <main className="flex-1">{children}</main>
      </div>
    </MobileLayout>
  ) : (
    <DesktopLayout>
      <div className="flex min-h-screen">
        <Sidebar items={filteredNavigation} />
        <main className="flex-1">{children}</main>
      </div>
    </DesktopLayout>
  );
};