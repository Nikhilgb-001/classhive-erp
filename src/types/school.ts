export interface School {
  id: string;
  school_name: string;
  school_code: string;
  school_app_id: string;
  school_address: string;
  admin_name: string;
  admin_email: string;
  admin_phone: string;
  billing_contact_name: string;
  billing_phone: string;
  billing_email: string;
  founder_name: string;
  founder_phone: string;
  status: string | null;
  created_at: string;
  logo_url?: string;
}

export interface SchoolFormData {
  schoolName: string;
  schoolCode: string;
  schoolAddress: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  billingContactName: string;
  billingPhone: string;
  billingEmail: string;
  founderName: string;
  founderPhone: string;
  logoUrl?: string;
}