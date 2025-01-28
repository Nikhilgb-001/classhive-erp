import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, Users, GraduationCap, BookOpen, ClipboardCheck, 
  FileText, Megaphone, CalendarDays, Book, StickyNote, Clock, TestTube,
  Users2, MessageSquare, CalendarMinus, DollarSign, PartyPopper, Image,
  ChartBar, Library, Bell, BookOpen as Documentation, UserCog, School,
  Settings, LogOut
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", color: "#60A5FA" }, // Blue
  { icon: Users, label: "Students", href: "/students", color: "#34D399" }, // Green
  { icon: GraduationCap, label: "Teachers", href: "/teachers", color: "#F472B6" }, // Pink
  { icon: BookOpen, label: "Classes", href: "/classes", color: "#A78BFA" }, // Purple
  { icon: ClipboardCheck, label: "Attendance", href: "/attendance", color: "#FBBF24" }, // Yellow
  { icon: FileText, label: "Assignments", href: "/assignments", color: "#60A5FA" }, // Blue
  { icon: Megaphone, label: "Circulars", href: "/circulars", color: "#F87171" }, // Red
  { icon: CalendarDays, label: "Calendar", href: "/calendar", color: "#34D399" }, // Green
  { icon: Book, label: "Homework", href: "/homework", color: "#A78BFA" }, // Purple
  { icon: StickyNote, label: "Notice Board", href: "/notice-board", color: "#FBBF24" }, // Yellow
  { icon: Clock, label: "Time Table", href: "/time-table", color: "#F472B6" }, // Pink
  { icon: TestTube, label: "Tests", href: "/tests", color: "#60A5FA" }, // Blue
  { icon: Users2, label: "Meetings", href: "/meetings", color: "#34D399" }, // Green
  { icon: MessageSquare, label: "Chat with Staff", href: "/chat", color: "#F87171" }, // Red
  { icon: CalendarMinus, label: "Leave Request", href: "/leave-request", color: "#A78BFA" }, // Purple
  { icon: DollarSign, label: "Fee Details", href: "/fee-details", color: "#FBBF24" }, // Yellow
  { icon: PartyPopper, label: "Events", href: "/events", color: "#F472B6" }, // Pink
  { icon: Image, label: "Gallery", href: "/gallery", color: "#60A5FA" }, // Blue
  { icon: ChartBar, label: "Results", href: "/results", color: "#34D399" }, // Green
  { icon: Library, label: "Library", href: "/library", color: "#F87171" }, // Red
  { icon: Bell, label: "Notifications", href: "/notifications", color: "#A78BFA" }, // Purple
  { icon: Documentation, label: "Documentation", href: "/documentation", color: "#FBBF24" }, // Yellow
  { icon: UserCog, label: "Admin", href: "/admin", color: "#F472B6" }, // Pink
  { icon: School, label: "School Admin", href: "/school-admin", color: "#60A5FA" }, // Blue
  { icon: Settings, label: "Settings", href: "/settings", color: "#34D399" }, // Green
  { icon: LogOut, label: "Logout", href: "/logout", color: "#F87171" } // Red
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
              <SidebarGroupContent className="[&_li]:list-none">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <a 
                        href={item.href} 
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-800/50 transition-colors duration-200"
                      >
                        <item.icon className="h-5 w-5" style={{ color: item.color }} />
                        <span className="text-gray-200">{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between fixed top-0 right-0 left-[280px] z-10">
            <h1 className="text-xl font-semibold text-gray-900">Nypunya</h1>
            <div className="flex items-center gap-4">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">Anil</span>
            </div>
          </header>
          <main className="flex-1 p-8 overflow-auto bg-white mt-[73px]">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};