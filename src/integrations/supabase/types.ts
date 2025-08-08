export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      about_carousel: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          sort_order: number | null
          user_id: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number | null
          user_id?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      about_hl: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: number
          title: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          title?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      about_hobbies: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: number
          title: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          title?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      about_info: {
        Row: {
          created_at: string
          id: number
          info: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          info?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          info?: string | null
        }
        Relationships: []
      }
      about_ttd: {
        Row: {
          description: string | null
          icon: string | null
          id: number
          title: string | null
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id?: number
          title?: string | null
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      book_link: {
        Row: {
          created_at: string
          id: number
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          url?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          caption: string | null
          certificate_image_card: string
          created_at: string
          id: string
          issued_by: string
          link: string | null
          name: string
          skills_covered: string[]
          title_color: string | null
          updated_at: string
          user_id: string | null
          year: string
        }
        Insert: {
          caption?: string | null
          certificate_image_card: string
          created_at?: string
          id?: string
          issued_by: string
          link?: string | null
          name: string
          skills_covered?: string[]
          title_color?: string | null
          updated_at?: string
          user_id?: string | null
          year: string
        }
        Update: {
          caption?: string | null
          certificate_image_card?: string
          created_at?: string
          id?: string
          issued_by?: string
          link?: string | null
          name?: string
          skills_covered?: string[]
          title_color?: string | null
          updated_at?: string
          user_id?: string | null
          year?: string
        }
        Relationships: []
      }
      client_testimonials: {
        Row: {
          caption: string | null
          code: string
          company: string | null
          company_censored: boolean | null
          created_at: string
          email: string | null
          email_censored: boolean | null
          feedback: string | null
          feedback_picture: string | null
          id: number
          image: string | null
          name: string | null
          name_censored: boolean | null
          rate: number | null
        }
        Insert: {
          caption?: string | null
          code: string
          company?: string | null
          company_censored?: boolean | null
          created_at?: string
          email?: string | null
          email_censored?: boolean | null
          feedback?: string | null
          feedback_picture?: string | null
          id?: number
          image?: string | null
          name?: string | null
          name_censored?: boolean | null
          rate?: number | null
        }
        Update: {
          caption?: string | null
          code?: string
          company?: string | null
          company_censored?: boolean | null
          created_at?: string
          email?: string | null
          email_censored?: boolean | null
          feedback?: string | null
          feedback_picture?: string | null
          id?: number
          image?: string | null
          name?: string | null
          name_censored?: boolean | null
          rate?: number | null
        }
        Relationships: []
      }
      get_in_touch: {
        Row: {
          caption: string
          created_at: string
          icon: string
          id: string
          social: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          caption: string
          created_at?: string
          icon: string
          id?: string
          social: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          caption?: string
          created_at?: string
          icon?: string
          id?: string
          social?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      key_service: {
        Row: {
          created_at: string
          id: number
          ks: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          ks?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          ks?: string | null
        }
        Relationships: []
      }
      port_skill_cat: {
        Row: {
          badge: string | null
          category_key: string
          created_at: string
          hidden: boolean
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          badge?: string | null
          category_key: string
          created_at?: string
          hidden?: boolean
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          badge?: string | null
          category_key?: string
          created_at?: string
          hidden?: boolean
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          name: string | null
          profile_image: string | null
          resume_filename: string | null
          resume_uploaded_at: string | null
          resume_url: string | null
          roles: string | null
          updated_at: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id: string
          name?: string | null
          profile_image?: string | null
          resume_filename?: string | null
          resume_uploaded_at?: string | null
          resume_url?: string | null
          roles?: string | null
          updated_at?: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          name?: string | null
          profile_image?: string | null
          resume_filename?: string | null
          resume_uploaded_at?: string | null
          resume_url?: string | null
          roles?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_carousel_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          project_id: string
          sort_order: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          project_id: string
          sort_order?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          project_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_carousel_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          caption: string
          category: string
          created_at: string
          detailed_process: string | null
          detailed_results: string | null
          id: string
          image_link: string | null
          link: string | null
          months: string
          project_card_image: string
          results: string
          skills_used: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          caption: string
          category: string
          created_at?: string
          detailed_process?: string | null
          detailed_results?: string | null
          id?: string
          image_link?: string | null
          link?: string | null
          months: string
          project_card_image: string
          results: string
          skills_used: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          caption?: string
          category?: string
          created_at?: string
          detailed_process?: string | null
          detailed_results?: string | null
          id?: string
          image_link?: string | null
          link?: string | null
          months?: string
          project_card_image?: string
          results?: string
          skills_used?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_projects_category"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "port_skill_cat"
            referencedColumns: ["category_key"]
          },
        ]
      }
      site_theme_settings: {
        Row: {
          about_bg_end_dark: string | null
          about_bg_end_light: string | null
          about_bg_start_dark: string | null
          about_bg_start_light: string | null
          about_text_primary_dark: string | null
          about_text_primary_light: string | null
          about_text_secondary_dark: string | null
          about_text_secondary_light: string | null
          config_bg_end_dark: string | null
          config_bg_end_light: string | null
          config_bg_start_dark: string | null
          config_bg_start_light: string | null
          config_button_purple_end_dark: string | null
          config_button_purple_end_light: string | null
          config_button_purple_start_dark: string | null
          config_button_purple_start_light: string | null
          config_text_primary_dark: string | null
          config_text_primary_light: string | null
          created_at: string
          created_by: string | null
          hero_bg_end_dark: string | null
          hero_bg_end_light: string | null
          hero_bg_mid_dark: string | null
          hero_bg_mid_light: string | null
          hero_bg_start_dark: string | null
          hero_bg_start_light: string | null
          hero_blob_1_dark: string | null
          hero_blob_1_light: string | null
          hero_blob_2_dark: string | null
          hero_blob_2_light: string | null
          hero_blob_3_dark: string | null
          hero_blob_3_light: string | null
          hero_text_primary_dark: string | null
          hero_text_primary_light: string | null
          hero_text_secondary_dark: string | null
          hero_text_secondary_light: string | null
          id: string
          is_active: boolean
          nav_bg_dark: string | null
          nav_bg_light: string | null
          nav_text_active_dark: string | null
          nav_text_active_light: string | null
          nav_text_dark: string | null
          nav_text_hover_dark: string | null
          nav_text_hover_light: string | null
          nav_text_light: string | null
          portfolio_bg_end_dark: string | null
          portfolio_bg_end_light: string | null
          portfolio_bg_start_dark: string | null
          portfolio_bg_start_light: string | null
          portfolio_text_primary_dark: string | null
          portfolio_text_primary_light: string | null
          skills_bg_end_dark: string | null
          skills_bg_end_light: string | null
          skills_bg_start_dark: string | null
          skills_bg_start_light: string | null
          skills_text_primary_dark: string | null
          skills_text_primary_light: string | null
          theme_name: string
          updated_at: string
        }
        Insert: {
          about_bg_end_dark?: string | null
          about_bg_end_light?: string | null
          about_bg_start_dark?: string | null
          about_bg_start_light?: string | null
          about_text_primary_dark?: string | null
          about_text_primary_light?: string | null
          about_text_secondary_dark?: string | null
          about_text_secondary_light?: string | null
          config_bg_end_dark?: string | null
          config_bg_end_light?: string | null
          config_bg_start_dark?: string | null
          config_bg_start_light?: string | null
          config_button_purple_end_dark?: string | null
          config_button_purple_end_light?: string | null
          config_button_purple_start_dark?: string | null
          config_button_purple_start_light?: string | null
          config_text_primary_dark?: string | null
          config_text_primary_light?: string | null
          created_at?: string
          created_by?: string | null
          hero_bg_end_dark?: string | null
          hero_bg_end_light?: string | null
          hero_bg_mid_dark?: string | null
          hero_bg_mid_light?: string | null
          hero_bg_start_dark?: string | null
          hero_bg_start_light?: string | null
          hero_blob_1_dark?: string | null
          hero_blob_1_light?: string | null
          hero_blob_2_dark?: string | null
          hero_blob_2_light?: string | null
          hero_blob_3_dark?: string | null
          hero_blob_3_light?: string | null
          hero_text_primary_dark?: string | null
          hero_text_primary_light?: string | null
          hero_text_secondary_dark?: string | null
          hero_text_secondary_light?: string | null
          id?: string
          is_active?: boolean
          nav_bg_dark?: string | null
          nav_bg_light?: string | null
          nav_text_active_dark?: string | null
          nav_text_active_light?: string | null
          nav_text_dark?: string | null
          nav_text_hover_dark?: string | null
          nav_text_hover_light?: string | null
          nav_text_light?: string | null
          portfolio_bg_end_dark?: string | null
          portfolio_bg_end_light?: string | null
          portfolio_bg_start_dark?: string | null
          portfolio_bg_start_light?: string | null
          portfolio_text_primary_dark?: string | null
          portfolio_text_primary_light?: string | null
          skills_bg_end_dark?: string | null
          skills_bg_end_light?: string | null
          skills_bg_start_dark?: string | null
          skills_bg_start_light?: string | null
          skills_text_primary_dark?: string | null
          skills_text_primary_light?: string | null
          theme_name?: string
          updated_at?: string
        }
        Update: {
          about_bg_end_dark?: string | null
          about_bg_end_light?: string | null
          about_bg_start_dark?: string | null
          about_bg_start_light?: string | null
          about_text_primary_dark?: string | null
          about_text_primary_light?: string | null
          about_text_secondary_dark?: string | null
          about_text_secondary_light?: string | null
          config_bg_end_dark?: string | null
          config_bg_end_light?: string | null
          config_bg_start_dark?: string | null
          config_bg_start_light?: string | null
          config_button_purple_end_dark?: string | null
          config_button_purple_end_light?: string | null
          config_button_purple_start_dark?: string | null
          config_button_purple_start_light?: string | null
          config_text_primary_dark?: string | null
          config_text_primary_light?: string | null
          created_at?: string
          created_by?: string | null
          hero_bg_end_dark?: string | null
          hero_bg_end_light?: string | null
          hero_bg_mid_dark?: string | null
          hero_bg_mid_light?: string | null
          hero_bg_start_dark?: string | null
          hero_bg_start_light?: string | null
          hero_blob_1_dark?: string | null
          hero_blob_1_light?: string | null
          hero_blob_2_dark?: string | null
          hero_blob_2_light?: string | null
          hero_blob_3_dark?: string | null
          hero_blob_3_light?: string | null
          hero_text_primary_dark?: string | null
          hero_text_primary_light?: string | null
          hero_text_secondary_dark?: string | null
          hero_text_secondary_light?: string | null
          id?: string
          is_active?: boolean
          nav_bg_dark?: string | null
          nav_bg_light?: string | null
          nav_text_active_dark?: string | null
          nav_text_active_light?: string | null
          nav_text_dark?: string | null
          nav_text_hover_dark?: string | null
          nav_text_hover_light?: string | null
          nav_text_light?: string | null
          portfolio_bg_end_dark?: string | null
          portfolio_bg_end_light?: string | null
          portfolio_bg_start_dark?: string | null
          portfolio_bg_start_light?: string | null
          portfolio_text_primary_dark?: string | null
          portfolio_text_primary_light?: string | null
          skills_bg_end_dark?: string | null
          skills_bg_end_light?: string | null
          skills_bg_start_dark?: string | null
          skills_bg_start_light?: string | null
          skills_text_primary_dark?: string | null
          skills_text_primary_light?: string | null
          theme_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      skills_expertise: {
        Row: {
          created_at: string
          details: string[] | null
          expertise_level: string | null
          id: string
          skill_id: string | null
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          created_at?: string
          details?: string[] | null
          expertise_level?: string | null
          id?: string
          skill_id?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          created_at?: string
          details?: string[] | null
          expertise_level?: string | null
          id?: string
          skill_id?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_expertise_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills_main"
            referencedColumns: ["id"]
          },
        ]
      }
      skills_main: {
        Row: {
          badge: string | null
          color: string | null
          created_at: string
          description: string | null
          hidden: boolean | null
          icon: string | null
          id: string
          keyservice_id: number | null
          skill_name: string
          updated_at: string
        }
        Insert: {
          badge?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          hidden?: boolean | null
          icon?: string | null
          id?: string
          keyservice_id?: number | null
          skill_name: string
          updated_at?: string
        }
        Update: {
          badge?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          hidden?: boolean | null
          icon?: string | null
          id?: string
          keyservice_id?: number | null
          skill_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_main_keyservice_id_fkey"
            columns: ["keyservice_id"]
            isOneToOne: false
            referencedRelation: "key_service"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          caption: string | null
          company: string | null
          company_censored: boolean | null
          created_at: string
          email: string | null
          email_censored: boolean | null
          feedback: string | null
          feedback_picture: string | null
          id: number
          image: string | null
          name: string | null
          name_censored: boolean | null
          rate: number | null
          user_id: string | null
        }
        Insert: {
          caption?: string | null
          company?: string | null
          company_censored?: boolean | null
          created_at?: string
          email?: string | null
          email_censored?: boolean | null
          feedback?: string | null
          feedback_picture?: string | null
          id?: number
          image?: string | null
          name?: string | null
          name_censored?: boolean | null
          rate?: number | null
          user_id?: string | null
        }
        Update: {
          caption?: string | null
          company?: string | null
          company_censored?: boolean | null
          created_at?: string
          email?: string | null
          email_censored?: boolean | null
          feedback?: string | null
          feedback_picture?: string | null
          id?: number
          image?: string | null
          name?: string | null
          name_censored?: boolean | null
          rate?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      tools: {
        Row: {
          category: string | null
          color: string
          created_at: string
          icon: string
          id: string
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          color: string
          created_at?: string
          icon: string
          id?: string
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          color?: string
          created_at?: string
          icon?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      why_choose_me: {
        Row: {
          caption: string
          created_at: string
          id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          caption: string
          created_at?: string
          id?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          caption?: string
          created_at?: string
          id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_random_code: {
        Args: { length?: number }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
