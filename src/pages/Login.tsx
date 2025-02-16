
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<'login' | 'verify'>('login');
  const [verificationCode, setVerificationCode] = useState("");

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

      // Log the successful login attempt
      await supabase.functions.invoke('log-audit-event', {
        body: {
          event_type: 'login',
          details: {
            login_type: 'admin',
            email: email,
            role: roleData.role
          }
        }
      });

      // Store school_id in localStorage if it exists
      if (roleData.school_id) {
        localStorage.setItem('schoolId', roleData.school_id);
      }

      toast.success("Login successful!");

      // Route based on role
      if (roleData.role === 'super_admin') {
        navigate("/admin/onboarding");
      } else if (roleData.role === 'school_admin') {
        navigate("/school-admin");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please check your credentials.");
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
        .select('id, school_id, status')
        .eq('phone', phone)
        .eq('status', 'active')
        .maybeSingle();

      if (teacherError) throw teacherError;

      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('id, school_id, status')
        .eq('phone', phone)
        .eq('status', 'active')
        .maybeSingle();

      if (studentError) throw studentError;

      if (!teacherData && !studentData) {
        toast.error("Phone number not found or account is inactive");
        return;
      }

      // For demonstration, we're using a simple verification code
      // In production, this should be replaced with actual SMS verification
      setStep('verify');
      toast.info("Please enter the verification code sent to your phone");

    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Failed to verify phone number. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real application, verify the code with an SMS service
      // For demo purposes, we'll accept any 6-digit code
      if (verificationCode.length !== 6) {
        toast.error("Please enter a valid 6-digit code");
        return;
      }

      // Check user type and redirect accordingly
      const { data: teacherData } = await supabase
        .from('teachers')
        .select('id, school_id')
        .eq('phone', phone)
        .single();

      if (teacherData) {
        localStorage.setItem('schoolId', teacherData.school_id);
        localStorage.setItem('userRole', 'teacher');
        navigate("/teacher");
        return;
      }

      const { data: studentData } = await supabase
        .from('students')
        .select('id, school_id')
        .eq('phone', phone)
        .single();

      if (studentData) {
        localStorage.setItem('schoolId', studentData.school_id);
        localStorage.setItem('userRole', 'student');
        navigate("/student");
      }

      // Log the successful login
      await supabase.functions.invoke('log-audit-event', {
        body: {
          event_type: 'login',
          details: {
            login_type: 'user',
            phone: phone
          }
        }
      });

    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Login to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {step === 'login' ? (
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
                    {loading ? "Verifying..." : "Continue"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerification} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verificationCode">Verification Code</Label>
                    <Input
                      id="verificationCode"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Verifying..." : "Verify & Login"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep('login')}
                  >
                    Back to Login
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-gray-500 text-center">
            Having trouble logging in? Contact your school administrator
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
