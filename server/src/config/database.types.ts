export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bids: {
        Row: {
          bid_amount: number
          bid_deadline: string
          bid_id: number
          bid_status: Database["public"]["Enums"]["bid_status"]
          bidder_id: number
          created_at: string
          item_id: number
          updated_at: string | null
        }
        Insert: {
          bid_amount: number
          bid_deadline: string
          bid_id?: number
          bid_status: Database["public"]["Enums"]["bid_status"]
          bidder_id: number
          created_at?: string
          item_id: number
          updated_at?: string | null
        }
        Update: {
          bid_amount?: number
          bid_deadline?: string
          bid_id?: number
          bid_status?: Database["public"]["Enums"]["bid_status"]
          bidder_id?: number
          created_at?: string
          item_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bids_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["item_id"]
          },
        ]
      }
      comments: {
        Row: {
          comment: string | null
          comment_id: number
          created_at: string
          user_id: number
        }
        Insert: {
          comment?: string | null
          comment_id?: number
          created_at?: string
          user_id: number
        }
        Update: {
          comment?: string | null
          comment_id?: number
          created_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      listings: {
        Row: {
          created_at: string
          description: string
          item_id: number
          owner_id: number
          price: string
          status: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          description: string
          item_id?: number
          owner_id: number
          price: string
          status: string
          title: string
          type: string
        }
        Update: {
          created_at?: string
          description?: string
          item_id?: number
          owner_id?: number
          price?: string
          status?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ratings: {
        Row: {
          created_at: string
          five_ratings: number | null
          four_ratings: number | null
          one_ratings: number | null
          ratings_id: number
          three_ratings: number | null
          two_ratings: number | null
          user_id: number | null
        }
        Insert: {
          created_at?: string
          five_ratings?: number | null
          four_ratings?: number | null
          one_ratings?: number | null
          ratings_id?: number
          three_ratings?: number | null
          two_ratings?: number | null
          user_id?: number | null
        }
        Update: {
          created_at?: string
          five_ratings?: number | null
          four_ratings?: number | null
          one_ratings?: number | null
          ratings_id?: number
          three_ratings?: number | null
          two_ratings?: number | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      transactions: {
        Row: {
          buyer_id: number
          created_at: string
          discount_applied: boolean
          item_id: number
          seller_id: number
          transaction_amount: number
          transaction_date: string
          transaction_id: number
        }
        Insert: {
          buyer_id: number
          created_at?: string
          discount_applied: boolean
          item_id: number
          seller_id: number
          transaction_amount: number
          transaction_date?: string
          transaction_id?: number
        }
        Update: {
          buyer_id?: number
          created_at?: string
          discount_applied?: boolean
          item_id?: number
          seller_id?: number
          transaction_amount?: number
          transaction_date?: string
          transaction_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "transactions_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "transactions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          Address: string
          average_rating: Database["public"]["Enums"]["user_rating"] | null
          balance: number
          created_at: string
          email: string
          password_hash: string
          role: string
          status: string
          user_id: number
          username: string
          vip: boolean
        }
        Insert: {
          Address: string
          average_rating?: Database["public"]["Enums"]["user_rating"] | null
          balance?: number
          created_at?: string
          email: string
          password_hash: string
          role?: string
          status?: string
          user_id?: number
          username: string
          vip: boolean
        }
        Update: {
          Address?: string
          average_rating?: Database["public"]["Enums"]["user_rating"] | null
          balance?: number
          created_at?: string
          email?: string
          password_hash?: string
          role?: string
          status?: string
          user_id?: number
          username?: string
          vip?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_rating: {
        Args: {
          column_name: string
          user_id: number
        }
        Returns: Json
      }
    }
    Enums: {
      bid_status: "pending" | "accepted" | "rejected"
      status: "available" | "sold" | "rented"
      user_rating: "1" | "2" | "3" | "4" | "5"
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
