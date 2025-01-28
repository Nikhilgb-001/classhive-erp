import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, Users, GraduationCap, BookOpen, ClipboardCheck, 
  FileText, Megaphone, CalendarDays, Book, StickyNote, Clock, TestTube,
  Users2, MessageSquare, CalendarMinus, DollarSign, PartyPopper, Image,
  ChartBar, Library, Bell, BookOpen as Documentation, UserCog, School,
  Settings, LogOut
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Students", href: "/students" },
  { icon: GraduationCap, label: "Teachers", href: "/teachers" },
  { icon: BookOpen, label: "Classes", href: "/classes" },
  { icon: ClipboardCheck, label: "Attendance", href: "/attendance" },
  { icon: FileText, label: "Assignments", href: "/assignments" },
  { icon: Megaphone, label: "Circulars", href: "/circulars" },
  { icon: CalendarDays, label: "Calendar", href: "/calendar" },
  { icon: Book, label: "Homework", href: "/homework" },
  { icon: StickyNote, label: "Notice Board", href: "/notice-board" },
  { icon: Clock, label: "Time Table", href: "/time-table" },
  { icon: TestTube, label: "Tests", href: "/tests" },
  { icon: Users2, label: "Meetings", href: "/meetings" },
  { icon: MessageSquare, label: "Chat with Staff", href: "/chat" },
  { icon: CalendarMinus, label: "Leave Request", href: "/leave-request" },
  { icon: DollarSign, label: "Fee Details", href: "/fee-details" },
  { icon: PartyPopper, label: "Events", href: "/events" },
  { icon: Image, label: "Gallery", href: "/gallery" },
  { icon: ChartBar, label: "Results", href: "/results" },
  { icon: Library, label: "Library", href: "/library" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Documentation, label: "Documentation", href: "/documentation" },
  { icon: UserCog, label: "Admin", href: "/admin" },
  { icon: School, label: "School Admin", href: "/school-admin" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: LogOut, label: "Logout", href: "/logout" }
];

export const DesktopLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="bg-[#1A1F2C]">
          <div className="px-6 py-4 border-b border-gray-800">
            <h1 className="text-2xl font-bold text-white">Instaclass</h1>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <a 
                        href={item.href} 
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-200"
                      >
                        <item.icon className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-200">{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-8 overflow-auto bg-white">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};