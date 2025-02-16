
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface VerificationFormProps {
  phone: string;
  onBack: () => void;
}

export function VerificationForm({ phone, onBack }: VerificationFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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
        onClick={onBack}
      >
        Back to Login
      </Button>
    </form>
  );
}
