export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      roles: {
        Row: {
          id: string;
          name: string;
          key: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          key: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          key?: string;
          description?: string | null;
        };
      };
      users: {
        Row: {
          id: string;
          role_id: string | null;
          member_id: string | null;
          email: string;
          display_name: string | null;
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role_id?: string | null;
          member_id?: string | null;
          email: string;
          display_name?: string | null;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          role_id?: string | null;
          member_id?: string | null;
          email?: string;
          display_name?: string | null;
          is_approved?: boolean;
          updated_at?: string;
        };
      };
      members: {
        Row: {
          id: string;
          user_id: string | null;
          profile_image: string | null;
          full_name: string;
          gender: string | null;
          date_of_birth: string | null;
          phone_number: string | null;
          email: string;
          whatsapp: string | null;
          telegram: string | null;
          village_in_myanmar: string | null;
          current_city_in_india: string | null;
          state_in_india: string | null;
          university: string | null;
          major: string | null;
          batch: string | null;
          year_joined: number | null;
          current_position: string | null;
          bio: string | null;
          status: "active" | "inactive" | "alumni";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          profile_image?: string | null;
          full_name: string;
          gender?: string | null;
          date_of_birth?: string | null;
          phone_number?: string | null;
          email: string;
          whatsapp?: string | null;
          telegram?: string | null;
          village_in_myanmar?: string | null;
          current_city_in_india?: string | null;
          state_in_india?: string | null;
          university?: string | null;
          major?: string | null;
          batch?: string | null;
          year_joined?: number | null;
          current_position?: string | null;
          bio?: string | null;
          status?: "active" | "inactive" | "alumni";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string | null;
          profile_image?: string | null;
          full_name?: string;
          gender?: string | null;
          date_of_birth?: string | null;
          phone_number?: string | null;
          email?: string;
          whatsapp?: string | null;
          telegram?: string | null;
          village_in_myanmar?: string | null;
          current_city_in_india?: string | null;
          state_in_india?: string | null;
          university?: string | null;
          major?: string | null;
          batch?: string | null;
          year_joined?: number | null;
          current_position?: string | null;
          bio?: string | null;
          status?: "active" | "inactive" | "alumni";
          updated_at?: string;
        };
      };
      leadership_records: {
        Row: {
          id: string;
          member_id: string;
          leadership_position: string;
          term_start: string;
          term_end: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          leadership_position: string;
          term_start: string;
          term_end?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          member_id?: string;
          leadership_position?: string;
          term_start?: string;
          term_end?: string | null;
          description?: string | null;
        };
      };
      graduates: {
        Row: {
          id: string;
          member_id: string;
          degree: string;
          graduation_date: string | null;
          graduation_year: number;
          university: string;
          current_job: string | null;
          current_country: string | null;
          current_city: string | null;
          company: string | null;
          linkedin_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          degree: string;
          graduation_date?: string | null;
          graduation_year: number;
          university: string;
          current_job?: string | null;
          current_country?: string | null;
          current_city?: string | null;
          company?: string | null;
          linkedin_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          member_id?: string;
          degree?: string;
          graduation_date?: string | null;
          graduation_year?: number;
          university?: string;
          current_job?: string | null;
          current_country?: string | null;
          current_city?: string | null;
          company?: string | null;
          linkedin_url?: string | null;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: "constitution" | "reports" | "minutes" | "events" | "other";
          file_path: string;
          file_name: string;
          file_size: number | null;
          mime_type: string | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category: "constitution" | "reports" | "minutes" | "events" | "other";
          file_path: string;
          file_name: string;
          file_size?: number | null;
          mime_type?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          category?: "constitution" | "reports" | "minutes" | "events" | "other";
          file_path?: string;
          file_name?: string;
          file_size?: number | null;
          mime_type?: string | null;
        };
      };
      activities: {
        Row: {
          id: string;
          actor_user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          actor_user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          metadata?: Json | null;
        };
      };
    };
  };
};
