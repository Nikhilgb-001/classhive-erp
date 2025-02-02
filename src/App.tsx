import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import AdminSchools from "./pages/admin/Schools";
import AdminUsers from "./pages/admin/Users";
import AdminLicenses from "./pages/admin/Licenses";
import AdminOnboarding from "./pages/admin/Onboarding";
import NewSchoolOnboarding from "./pages/admin/NewSchoolOnboarding";
import AdminRoleAccess from "./pages/admin/RoleAccess";
import SchoolAdmin from "./pages/school-admin/SchoolAdmin";
import Classes from "./pages/school-admin/Classes";
import NewClass from "./pages/school-admin/NewClass";
import Teachers from "./pages/school-admin/Teachers";
import NewTeacher from "./pages/school-admin/NewTeacher";
import Students from "./pages/school-admin/Students";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/admin/schools" element={<AdminSchools />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/licenses" element={<AdminLicenses />} />
          <Route path="/admin/onboarding" element={<AdminOnboarding />} />
          <Route path="/admin/onboarding/new" element={<NewSchoolOnboarding />} />
          <Route path="/admin/role-access" element={<AdminRoleAccess />} />
          <Route path="/school-admin" element={<SchoolAdmin />} />
          <Route path="/school-admin/classes" element={<Classes />} />
          <Route path="/school-admin/classes/new" element={<NewClass />} />
          <Route path="/school-admin/teachers" element={<Teachers />} />
          <Route path="/school-admin/teachers/new" element={<NewTeacher />} />
          <Route path="/school-admin/students" element={<Students />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;