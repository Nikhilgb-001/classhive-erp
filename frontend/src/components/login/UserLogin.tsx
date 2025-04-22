
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { VerificationForm } from "./VerificationForm";

export function UserLogin() {
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<'login' | 'verify'>('login');

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

  if (step === 'verify') {
    return <VerificationForm phone={phone} onBack={() => setStep('login')} />;
  }

  return (
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
  );
}
