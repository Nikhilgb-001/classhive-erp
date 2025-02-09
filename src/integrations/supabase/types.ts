export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      class_configurations: {
        Row: {
          classes: string[]
          created_at: string
          id: string
          school_id: string
          sections: string[]
          subjects: string[]
          updated_at: string
        }
        Insert: {
          classes?: string[]
          created_at?: string
          id?: string
          school_id: string
          sections?: string[]
          subjects?: string[]
          updated_at?: string
        }
        Update: {
          classes?: string[]
          created_at?: string
          id?: string
          school_id?: string
          sections?: string[]
          subjects?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_configurations_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      licenses: {
        Row: {
          created_at: string
          expiry_date: string
          id: string
          school_id: string
          status: string | null
        }
        Insert: {
          created_at?: string
          expiry_date: string
          id?: string
          school_id: string
          status?: string | null
        }
        Update: {
          created_at?: string
          expiry_date?: string
          id?: string
          school_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "licenses_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          access_level: Database["public"]["Enums"]["feature_access"]
          created_at: string
          feature: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          access_level: Database["public"]["Enums"]["feature_access"]
          created_at?: string
          feature: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          access_level?: Database["public"]["Enums"]["feature_access"]
          created_at?: string
          feature?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      schools: {
        Row: {
          admin_email: string
          admin_name: string
          admin_phone: string
          billing_contact_name: string
          billing_email: string
          billing_phone: string
          created_at: string
          founder_name: string
          founder_phone: string
          id: string
          logo_url: string | null
          school_address: string
          school_app_id: string
          school_code: string
          school_name: string
          status: string | null
        }
        Insert: {
          admin_email: string
          admin_name: string
          admin_phone: string
          billing_contact_name: string
          billing_email: string
          billing_phone: string
          created_at?: string
          founder_name: string
          founder_phone: string
          id?: string
          logo_url?: string | null
          school_address: string
          school_app_id: string
          school_code: string
          school_name: string
          status?: string | null
        }
        Update: {
          admin_email?: string
          admin_name?: string
          admin_phone?: string
          billing_contact_name?: string
          billing_email?: string
          billing_phone?: string
          created_at?: string
          founder_name?: string
          founder_phone?: string
          id?: string
          logo_url?: string | null
          school_address?: string
          school_app_id?: string
          school_code?: string
          school_name?: string
          status?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          admission_number: string | null
          class: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          school_id: string
          section: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          admission_number?: string | null
          class?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          school_id: string
          section?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          admission_number?: string | null
          class?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          school_id?: string
          section?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          class: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          is_primary_teacher: boolean | null
          last_name: string
          phone: string
          primary_subject: string | null
          qualification: string
          school_id: string
          section: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          class?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_primary_teacher?: boolean | null
          last_name: string
          phone: string
          primary_subject?: string | null
          qualification: string
          school_id: string
          section?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          class?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_primary_teacher?: boolean | null
          last_name?: string
          phone?: string
          primary_subject?: string | null
          qualification?: string
          school_id?: string
          section?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_school_teachers"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teachers_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      user_details: {
        Row: {
          created_at: string
          id: string
          name: string | null
          phone: string | null
          school_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          phone?: string | null
          school_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          phone?: string | null
          school_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_details_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "auth_users_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_details_user_role_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_roles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          school_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          school_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          school_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "auth_users_view"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      auth_users_view: {
        Row: {
          email: string | null
          id: string | null
          raw_user_meta_data: Json | null
        }
        Insert: {
          email?: string | null
          id?: string | null
          raw_user_meta_data?: Json | null
        }
        Update: {
          email?: string | null
          id?: string | null
          raw_user_meta_data?: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "school_admin" | "teacher" | "student"
      feature_access: "no_access" | "read" | "write" | "full_access"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
