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

export const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">Instaclass</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent>
            <nav className="mt-8">
              {mobileMenuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg"
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  <span>{item.label}</span>
                </a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </header>
      <main className="p-4">
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-6 flex justify-around">
        {mobileMenuItems.slice(0, 4).map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-primary"
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};