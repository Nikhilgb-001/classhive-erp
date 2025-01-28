import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const signIn = async () => {
      try {
        console.log("Starting sign in process...");
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: "developer@instaclass.in",
          password: "password",
        });

        console.log("Sign in response:", { data, error });

        if (error) throw error;

        console.log("Sign in successful:", data);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });

        navigate("/admin/onboarding/new");
      } catch (error) {
        console.error("Login error details:", {
          message: error.message,
          code: error.code,
          status: error.status,
          details: error
        });
        
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