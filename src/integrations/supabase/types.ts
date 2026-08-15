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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          color: string | null
          created_at: string
          id: string
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      delivery_prices: {
        Row: {
          created_at: string
          home_price: number
          id: string
          office_price: number
          updated_at: string
          wilaya: string
        }
        Insert: {
          created_at?: string
          home_price?: number
          id?: string
          office_price?: number
          updated_at?: string
          wilaya: string
        }
        Update: {
          created_at?: string
          home_price?: number
          id?: string
          office_price?: number
          updated_at?: string
          wilaya?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          address_detail: string | null
          commune: string
          confirmed_at: string | null
          created_at: string
          customer_name: string
          delivery_price: number | null
          delivery_type: string
          id: string
          notes: string | null
          phone: string
          product_id: string | null
          product_name: string
          quantity: number | null
          selected_color: string | null
          selected_shoe_size: string | null
          selected_size: string | null
          status: string
          total_price: number
          updated_at: string
          wilaya: string
        }
        Insert: {
          address_detail?: string | null
          commune: string
          confirmed_at?: string | null
          created_at?: string
          customer_name: string
          delivery_price?: number | null
          delivery_type: string
          id?: string
          notes?: string | null
          phone: string
          product_id?: string | null
          product_name: string
          quantity?: number | null
          selected_color?: string | null
          selected_shoe_size?: string | null
          selected_size?: string | null
          status?: string
          total_price: number
          updated_at?: string
          wilaya: string
        }
        Update: {
          address_detail?: string | null
          commune?: string
          confirmed_at?: string | null
          created_at?: string
          customer_name?: string
          delivery_price?: number | null
          delivery_type?: string
          id?: string
          notes?: string | null
          phone?: string
          product_id?: string | null
          product_name?: string
          quantity?: number | null
          selected_color?: string | null
          selected_shoe_size?: string | null
          selected_size?: string | null
          status?: string
          total_price?: number
          updated_at?: string
          wilaya?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          position: number
          product_id: string
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          position?: number
          product_id: string
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          position?: number
          product_id?: string
          question?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_faqs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string
          customer_name: string
          id: string
          order_id: string | null
          product_id: string
          rating: number
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_name?: string
          id?: string
          order_id?: string | null
          product_id: string
          rating: number
          updated_at?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_name?: string
          id?: string
          order_id?: string | null
          product_id?: string
          rating?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          color: string
          created_at: string
          id: string
          product_id: string
          size: string
          stock: number
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          id?: string
          product_id: string
          size: string
          stock?: number
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          product_id?: string
          size?: string
          stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          colors: string[] | null
          created_at: string
          id: string
          images: string[] | null
          name: string
          new_price: number
          notes: string | null
          old_price: number
          shoe_sizes: string[] | null
          show_notes: boolean | null
          show_quantity: boolean | null
          sizes: string[] | null
          stock: number | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category_id?: string | null
          colors?: string[] | null
          created_at?: string
          id?: string
          images?: string[] | null
          name: string
          new_price: number
          notes?: string | null
          old_price: number
          shoe_sizes?: string[] | null
          show_notes?: boolean | null
          show_quantity?: boolean | null
          sizes?: string[] | null
          stock?: number | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category_id?: string | null
          colors?: string[] | null
          created_at?: string
          id?: string
          images?: string[] | null
          name?: string
          new_price?: number
          notes?: string | null
          old_price?: number
          shoe_sizes?: string[] | null
          show_notes?: boolean | null
          show_quantity?: boolean | null
          sizes?: string[] | null
          stock?: number | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
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
