import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const signIn = async () => {
      try {
        console.log("Attempting to sign in...");
        const { error } = await supabase.auth.signInWithPassword({
          email: "developer@instaclass.in",
          password: "password",
        });

        if (error) throw error;

        console.log("Sign in successful");
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });

        navigate("/admin/onboarding/new");
      } catch (error) {
        console.error("Login error:", error);
        toast({
          title: "Login failed",
          description: error.message || "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    };

    signIn();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome to Instaclass</h1>
          <p className="text-gray-600">Signing you in automatically...</p>
        </div>
      </div>
    </div>
  );
}