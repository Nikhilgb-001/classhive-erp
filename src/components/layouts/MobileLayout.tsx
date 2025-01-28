import { 
  LayoutDashboard, Users, GraduationCap, BookOpen, ClipboardCheck, 
  FileText, Megaphone, CalendarDays, Book, StickyNote, Clock, TestTube,
  Users2, MessageSquare, CalendarMinus, DollarSign, PartyPopper, Image,
  ChartBar, Library, Bell, BookOpen as Documentation, UserCog, School,
  Settings, LogOut, Menu 
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const mobileMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", color: "#60A5FA" },
  { icon: Users, label: "Students", href: "/students", color: "#34D399" },
  { icon: GraduationCap, label: "Teachers", href: "/teachers", color: "#F472B6" },
  { icon: BookOpen, label: "Classes", href: "/classes", color: "#A78BFA" },
  { icon: ClipboardCheck, label: "Attendance", href: "/attendance", color: "#FBBF24" },
  { icon: FileText, label: "Assignments", href: "/assignments", color: "#60A5FA" },
  { icon: Megaphone, label: "Circulars", href: "/circulars", color: "#F87171" },
  { icon: CalendarDays, label: "Calendar", href: "/calendar", color: "#34D399" },
  { icon: Book, label: "Homework", href: "/homework", color: "#A78BFA" },
  { icon: StickyNote, label: "Notice Board", href: "/notice-board", color: "#FBBF24" },
  { icon: Clock, label: "Time Table", href: "/time-table", color: "#F472B6" },
  { icon: TestTube, label: "Tests", href: "/tests", color: "#60A5FA" },
  { icon: Users2, label: "Meetings", href: "/meetings", color: "#34D399" },
  { icon: MessageSquare, label: "Chat with Staff", href: "/chat", color: "#F87171" },
  { icon: CalendarMinus, label: "Leave Request", href: "/leave-request", color: "#A78BFA" },
  { icon: DollarSign, label: "Fee Details", href: "/fee-details", color: "#FBBF24" },
  { icon: PartyPopper, label: "Events", href: "/events", color: "#F472B6" },
  { icon: Image, label: "Gallery", href: "/gallery", color: "#60A5FA" },
  { icon: ChartBar, label: "Results", href: "/results", color: "#34D399" },
  { icon: Library, label: "Library", href: "/library", color: "#F87171" },
  { icon: Bell, label: "Notifications", href: "/notifications", color: "#A78BFA" },
  { icon: Documentation, label: "Documentation", href: "/documentation", color: "#FBBF24" },
  { icon: UserCog, label: "Admin", href: "/admin", color: "#F472B6" },
  { icon: School, label: "School Admin", href: "/school-admin", color: "#60A5FA" },
  { icon: Settings, label: "Settings", href: "/settings", color: "#34D399" },
  { icon: LogOut, label: "Logout", href: "/logout", color: "#F87171" }
];

export const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="bg-[#1A1F2C] border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Instaclass</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2 text-white">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent className="bg-[#1A1F2C] border-l border-gray-800">
            <nav className="mt-8">
              {mobileMenuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 rounded-lg text-gray-200"
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="h-5 w-5" style={{ color: item.color }} />
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </header>
      <main className="p-4 bg-white">
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1A1F2C] border-t border-gray-800 py-2 px-6 flex justify-around">
        {mobileMenuItems.slice(0, 4).map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-white"
          >
            <item.icon className="h-6 w-6" style={{ color: item.color }} />
            <span className="text-xs">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};