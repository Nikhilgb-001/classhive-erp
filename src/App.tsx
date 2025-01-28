import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";
import AdminSchools from "./pages/admin/Schools";
import AdminUsers from "./pages/admin/Users";
import AdminLicenses from "./pages/admin/Licenses";
import AdminOnboarding from "./pages/admin/Onboarding";
import AdminRoleAccess from "./pages/admin/RoleAccess";

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
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/admin/schools" element={<AdminSchools />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/licenses" element={<AdminLicenses />} />
          <Route path="/admin/onboarding" element={<AdminOnboarding />} />
          <Route path="/admin/role-access" element={<AdminRoleAccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;