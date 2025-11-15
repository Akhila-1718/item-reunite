export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      found_items: {
        Row: {
          category: Database["public"]["Enums"]["item_category"]
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          date_found: string
          description: string
          found_location: string
          id: string
          image_url: string | null
          item_name: string
          status: Database["public"]["Enums"]["item_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["item_category"]
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          date_found: string
          description: string
          found_location: string
          id?: string
          image_url?: string | null
          item_name: string
          status?: Database["public"]["Enums"]["item_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["item_category"]
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          date_found?: string
          description?: string
          found_location?: string
          id?: string
          image_url?: string | null
          item_name?: string
          status?: Database["public"]["Enums"]["item_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      item_matches: {
        Row: {
          created_at: string | null
          found_item_id: string | null
          id: string
          lost_item_id: string | null
          match_score: number | null
        }
        Insert: {
          created_at?: string | null
          found_item_id?: string | null
          id?: string
          lost_item_id?: string | null
          match_score?: number | null
        }
        Update: {
          created_at?: string | null
          found_item_id?: string | null
          id?: string
          lost_item_id?: string | null
          match_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "item_matches_found_item_id_fkey"
            columns: ["found_item_id"]
            isOneToOne: false
            referencedRelation: "found_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_matches_lost_item_id_fkey"
            columns: ["lost_item_id"]
            isOneToOne: false
            referencedRelation: "lost_items"
            referencedColumns: ["id"]
          },
        ]
      }
      lost_items: {
        Row: {
          category: Database["public"]["Enums"]["item_category"]
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string | null
          date_lost: string
          description: string
          id: string
          image_url: string | null
          item_name: string
          last_seen_location: string
          status: Database["public"]["Enums"]["item_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["item_category"]
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string | null
          date_lost: string
          description: string
          id?: string
          image_url?: string | null
          item_name: string
          last_seen_location: string
          status?: Database["public"]["Enums"]["item_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["item_category"]
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string | null
          date_lost?: string
          description?: string
          id?: string
          image_url?: string | null
          item_name?: string
          last_seen_location?: string
          status?: Database["public"]["Enums"]["item_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      item_category:
        | "electronics"
        | "clothing"
        | "accessories"
        | "bags"
        | "documents"
        | "keys"
        | "jewelry"
        | "other"
      item_status: "active" | "matched" | "claimed" | "expired"
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
    Enums: {
      item_category: [
        "electronics",
        "clothing",
        "accessories",
        "bags",
        "documents",
        "keys",
        "jewelry",
        "other",
      ],
      item_status: ["active", "matched", "claimed", "expired"],
    },
  },
} as const
