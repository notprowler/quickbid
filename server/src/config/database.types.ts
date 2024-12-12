export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      bids: {
        Row: {
          bid_amount: number;
          bid_deadline: string;
          bid_id: number;
          bid_status: Database["public"]["Enums"]["bid_status"];
          bidder_id: number | null;
          created_at: string;
          item_id: number;
          updated_at: string | null;
        };
        Insert: {
          bid_amount: number;
          bid_deadline: string;
          bid_id?: number;
          bid_status: Database["public"]["Enums"]["bid_status"];
          bidder_id?: number | null;
          created_at?: string;
          item_id: number;
          updated_at?: string | null;
        };
        Update: {
          bid_amount?: number;
          bid_deadline?: string;
          bid_id?: number;
          bid_status?: Database["public"]["Enums"]["bid_status"];
          bidder_id?: number | null;
          created_at?: string;
          item_id?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bids_bidder_id_fkey";
            columns: ["bidder_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "bids_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["item_id"];
          }
        ];
      };
      comments: {
        Row: {
          comment_id: number;
          comments: string | null;
          created_at: string;
          listing_id: number;
        };
        Insert: {
          comment_id?: number;
          comments?: string | null;
          created_at?: string;
          listing_id: number;
        };
        Update: {
          comment_id?: number;
          comments?: string | null;
          created_at?: string;
          listing_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "comments_listing_id_fkey";
            columns: ["listing_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["item_id"];
          }
        ];
      };
      complaints: {
        Row: {
          buyer_id: number;
          complaints: string;
          complaints_id: number;
          created_at: string;
          seller_id: number;
          status: string;
          transaction_id: number;
        };
        Insert: {
          buyer_id: number;
          complaints?: string;
          complaints_id?: number;
          created_at?: string;
          seller_id: number;
          status: string;
          transaction_id: number;
        };
        Update: {
          buyer_id?: number;
          complaints?: string;
          complaints_id?: number;
          created_at?: string;
          seller_id?: number;
          status?: string;
          transaction_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "complaints_buyer_id_fkey";
            columns: ["buyer_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "complaints_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "complaints_transaction_id_fkey";
            columns: ["transaction_id"];
            isOneToOne: false;
            referencedRelation: "transactions";
            referencedColumns: ["transaction_id"];
          }
        ];
      };
      listings: {
        Row: {
          bid_deadline: string | null;
          category: string | null;
          created_at: string;
          description: string;
          image: string[] | null;
          item_id: number;
          owner_id: number;
          price: number;
          status: string;
          title: string;
          type: string;
        };
        Insert: {
          bid_deadline?: string | null;
          category?: string | null;
          created_at?: string;
          description: string;
          image?: string[] | null;
          item_id?: number;
          owner_id: number;
          price: number;
          status: string;
          title: string;
          type: string;
        };
        Update: {
          bid_deadline?: string | null;
          category?: string | null;
          created_at?: string;
          description?: string;
          image?: string[] | null;
          item_id?: number;
          owner_id?: number;
          price?: number;
          status?: string;
          title?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "listings_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      pending_users: {
        Row: {
          address: string;
          created_at: string | null;
          email: string;
          full_name: string;
          id: number;
          password_hash: string;
          status: string;
          username: string;
        };
        Insert: {
          address: string;
          created_at?: string | null;
          email: string;
          full_name: string;
          id?: number;
          password_hash: string;
          status?: string;
          username: string;
        };
        Update: {
          address?: string;
          created_at?: string | null;
          email?: string;
          full_name?: string;
          id?: number;
          password_hash?: string;
          status?: string;
          username?: string;
        };
        Relationships: [];
      };
      ratings: {
        Row: {
          created_at: string;
          five_ratings: number | null;
          four_ratings: number | null;
          one_ratings: number | null;
          ratings_id: number;
          three_ratings: number | null;
          two_ratings: number | null;
          user_id: number | null;
        };
        Insert: {
          created_at?: string;
          five_ratings?: number | null;
          four_ratings?: number | null;
          one_ratings?: number | null;
          ratings_id?: number;
          three_ratings?: number | null;
          two_ratings?: number | null;
          user_id?: number | null;
        };
        Update: {
          created_at?: string;
          five_ratings?: number | null;
          four_ratings?: number | null;
          one_ratings?: number | null;
          ratings_id?: number;
          three_ratings?: number | null;
          two_ratings?: number | null;
          user_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "ratings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      transactions: {
        Row: {
          buyer_id: number;
          created_at: string;
          discount_applied: boolean;
          item_id: number;
          rated: boolean | null;
          seller_id: number;
          status: string;
          transaction_amount: number;
          transaction_id: number;
        };
        Insert: {
          buyer_id: number;
          created_at?: string;
          discount_applied: boolean;
          item_id: number;
          rated?: boolean | null;
          seller_id: number;
          status?: string;
          transaction_amount: number;
          transaction_id?: number;
        };
        Update: {
          buyer_id?: number;
          created_at?: string;
          discount_applied?: boolean;
          item_id?: number;
          rated?: boolean | null;
          seller_id?: number;
          status?: string;
          transaction_amount?: number;
          transaction_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_buyer_id_fkey";
            columns: ["buyer_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "transactions_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "listings";
            referencedColumns: ["item_id"];
          },
          {
            foreignKeyName: "transactions_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          }
        ];
      };
      users: {
        Row: {
          address: string;
          average_rating: number | null;
          balance: number;
          created_at: string;
          email: string;
          full_name: string | null;
          password_hash: string;
          role: string;
          status: string;
          suspension_count: number | null;
          termination_request: boolean | null;
          user_id: number;
          username: string;
          vip: boolean;
        };
        Insert: {
          address: string;
          average_rating?: number | null;
          balance?: number;
          created_at?: string;
          email: string;
          full_name?: string | null;
          password_hash: string;
          role?: string;
          status?: string;
          suspension_count?: number | null;
          termination_request?: boolean | null;
          user_id?: number;
          username: string;
          vip: boolean;
        };
        Update: {
          address?: string;
          average_rating?: number | null;
          balance?: number;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          password_hash?: string;
          role?: string;
          status?: string;
          suspension_count?: number | null;
          termination_request?: boolean | null;
          user_id?: number;
          username?: string;
          vip?: boolean;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_rating: {
        Args: {
          column_name: string;
          user_id: number;
        };
        Returns: Json;
      };
    };
    Enums: {
      bid_status: "pending" | "accepted" | "rejected";
      complaints_status: "pending" | "resolved";
      status: "available" | "sold" | "rented";
      user_rating: "1" | "2" | "3" | "4" | "5";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
