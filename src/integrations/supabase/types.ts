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
      financial_records: {
        Row: {
          amazon_sales: number | null
          average_order_value: number | null
          cogs: number | null
          contribution_margin: number | null
          created_at: string
          date: string
          debt_repayment_cash_out: number | null
          dominant_sales_channel: string | null
          fixed_cost_allocation: number | null
          flipkart_profit: number | null
          flipkart_sales: number | null
          gross_profit: number | null
          gross_sales: number | null
          id: string
          marketing_efficiency_label: string | null
          marketing_efficiency_ratio: number | null
          marketing_spend_digital: number | null
          marketing_spend_offline: number | null
          meesho_profit: number | null
          meesho_sales: number | null
          myntra_profit: number | null
          myntra_sales: number | null
          net_cash_flow: number | null
          net_profit_loss: number | null
          net_sales: number | null
          offline_sales: number | null
          performance_category: string | null
          platform_fees: number | null
          profitability_label: string | null
          returns: number | null
          total_marketing_spend: number | null
          total_orders: number | null
          updated_at: string
          user_id: string
          website_sales: number | null
        }
        Insert: {
          amazon_sales?: number | null
          average_order_value?: number | null
          cogs?: number | null
          contribution_margin?: number | null
          created_at?: string
          date: string
          debt_repayment_cash_out?: number | null
          dominant_sales_channel?: string | null
          fixed_cost_allocation?: number | null
          flipkart_profit?: number | null
          flipkart_sales?: number | null
          gross_profit?: number | null
          gross_sales?: number | null
          id?: string
          marketing_efficiency_label?: string | null
          marketing_efficiency_ratio?: number | null
          marketing_spend_digital?: number | null
          marketing_spend_offline?: number | null
          meesho_profit?: number | null
          meesho_sales?: number | null
          myntra_profit?: number | null
          myntra_sales?: number | null
          net_cash_flow?: number | null
          net_profit_loss?: number | null
          net_sales?: number | null
          offline_sales?: number | null
          performance_category?: string | null
          platform_fees?: number | null
          profitability_label?: string | null
          returns?: number | null
          total_marketing_spend?: number | null
          total_orders?: number | null
          updated_at?: string
          user_id: string
          website_sales?: number | null
        }
        Update: {
          amazon_sales?: number | null
          average_order_value?: number | null
          cogs?: number | null
          contribution_margin?: number | null
          created_at?: string
          date?: string
          debt_repayment_cash_out?: number | null
          dominant_sales_channel?: string | null
          fixed_cost_allocation?: number | null
          flipkart_profit?: number | null
          flipkart_sales?: number | null
          gross_profit?: number | null
          gross_sales?: number | null
          id?: string
          marketing_efficiency_label?: string | null
          marketing_efficiency_ratio?: number | null
          marketing_spend_digital?: number | null
          marketing_spend_offline?: number | null
          meesho_profit?: number | null
          meesho_sales?: number | null
          myntra_profit?: number | null
          myntra_sales?: number | null
          net_cash_flow?: number | null
          net_profit_loss?: number | null
          net_sales?: number | null
          offline_sales?: number | null
          performance_category?: string | null
          platform_fees?: number | null
          profitability_label?: string | null
          returns?: number | null
          total_marketing_spend?: number | null
          total_orders?: number | null
          updated_at?: string
          user_id?: string
          website_sales?: number | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          client_name: string
          created_at: string
          date: string
          due_date: string
          id: string
          invoice_number: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          client_name: string
          created_at?: string
          date: string
          due_date: string
          id?: string
          invoice_number: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          client_name?: string
          created_at?: string
          date?: string
          due_date?: string
          id?: string
          invoice_number?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loans: {
        Row: {
          created_at: string
          end_date: string
          id: string
          interest_rate: number
          loan_name: string
          monthly_payment: number
          principal_amount: number
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          interest_rate: number
          loan_name: string
          monthly_payment: number
          principal_amount: number
          start_date: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          interest_rate?: number
          loan_name?: string
          monthly_payment?: number
          principal_amount?: number
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          id: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date: string
          description: string
          id?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          type?: string
          updated_at?: string
          user_id?: string
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
