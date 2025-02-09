
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (roleError) throw roleError;

      // Store school_id in localStorage if it exists
      if (roleData.school_id) {
        localStorage.setItem('schoolId', roleData.school_id);
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      // Route based on role
      if (roleData.role === 'super_admin') {
        navigate("/admin/onboarding");
      } else if (roleData.role === 'school_admin') {
        navigate("/school-admin");
      }
    } catch (error: any) {
      console.error("Login error details:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First check if the phone number exists in teachers or students
      const { data: teacherData, error: teacherError } = await supabase
        .from('teachers')
        .select('id, school_id')
        .eq('phone', phone)
        .single();

      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('id, school_id')
        .eq('phone', phone)
        .single();

      if (teacherData) {
        // Teacher login logic
        localStorage.setItem('schoolId', teacherData.school_id);
        localStorage.setItem('userRole', 'teacher');
        toast({
          title: "Login successful",
          description: "Welcome back, teacher!",
        });
        navigate("/teacher");
      } else if (studentData) {
        // Student login logic
        localStorage.setItem('schoolId', studentData.school_id);
        localStorage.setItem('userRole', 'student');
        toast({
          title: "Login successful",
          description: "Welcome back, student!",
        });
        navigate("/student");
      } else {
        throw new Error("Phone number not found in our records");
      }
    } catch (error: any) {
      console.error("Login error details:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your phone number and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome to Instaclass</h1>
          <p className="text-gray-600">Please sign in to continue</p>
        </div>

        <Tabs defaultValue="admin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="admin">Admin Login</TabsTrigger>
            <TabsTrigger value="user">User Login</TabsTrigger>
          </TabsList>

          <TabsContent value="admin">
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="user">
            <form onSubmit={handleUserLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
