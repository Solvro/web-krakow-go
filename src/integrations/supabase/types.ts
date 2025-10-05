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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      AttendanceCertificate: {
        Row: {
          eventId: string
          id: string
          issuedAt: string
          points: number
          tasksCount: number
          volunteerId: string
        }
        Insert: {
          eventId: string
          id: string
          issuedAt?: string
          points: number
          tasksCount: number
          volunteerId: string
        }
        Update: {
          eventId?: string
          id?: string
          issuedAt?: string
          points?: number
          tasksCount?: number
          volunteerId?: string
        }
        Relationships: [
          {
            foreignKeyName: "AttendanceCertificate_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "AttendanceCertificate_volunteerId_fkey"
            columns: ["volunteerId"]
            isOneToOne: false
            referencedRelation: "Volunteer"
            referencedColumns: ["id"]
          },
        ]
      }
      Chat: {
        Row: {
          createdAt: string
          eventId: string | null
          id: string
          type: Database["public"]["Enums"]["ChatType"]
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          eventId?: string | null
          id: string
          type: Database["public"]["Enums"]["ChatType"]
          updatedAt: string
        }
        Update: {
          createdAt?: string
          eventId?: string | null
          id?: string
          type?: Database["public"]["Enums"]["ChatType"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Chat_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
        ]
      }
      ChatMessage: {
        Row: {
          chatId: string
          content: string
          createdAt: string
          id: string
          senderId: string
          updatedAt: string
        }
        Insert: {
          chatId: string
          content: string
          createdAt?: string
          id: string
          senderId: string
          updatedAt: string
        }
        Update: {
          chatId?: string
          content?: string
          createdAt?: string
          id?: string
          senderId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "ChatMessage_chatId_fkey"
            columns: ["chatId"]
            isOneToOne: false
            referencedRelation: "Chat"
            referencedColumns: ["id"]
          },
        ]
      }
      ChatParticipant: {
        Row: {
          chatId: string
          createdAt: string
          id: string
          organizationId: string | null
          volunteerId: string | null
        }
        Insert: {
          chatId: string
          createdAt?: string
          id: string
          organizationId?: string | null
          volunteerId?: string | null
        }
        Update: {
          chatId?: string
          createdAt?: string
          id?: string
          organizationId?: string | null
          volunteerId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ChatParticipant_chatId_fkey"
            columns: ["chatId"]
            isOneToOne: false
            referencedRelation: "Chat"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ChatParticipant_organizationId_fkey"
            columns: ["organizationId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ChatParticipant_volunteerId_fkey"
            columns: ["volunteerId"]
            isOneToOne: false
            referencedRelation: "Volunteer"
            referencedColumns: ["id"]
          },
        ]
      }
      Coordinator: {
        Row: {
          createdAt: string
          email: string
          id: string
          name: string
          schoolId: string | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          id: string
          name: string
          schoolId?: string | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: string
          name?: string
          schoolId?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Coordinator_schoolId_fkey"
            columns: ["schoolId"]
            isOneToOne: false
            referencedRelation: "School"
            referencedColumns: ["id"]
          },
        ]
      }
      Event: {
        Row: {
          createdAt: string
          description: string | null
          embedding: string | null
          endDate: string
          id: string
          latitude: number
          longitude: number
          organizationId: string
          placeName: string
          startDate: string
          title: string
          topic: Database["public"]["Enums"]["EventTopic"]
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          embedding?: string | null
          endDate: string
          id: string
          latitude: number
          longitude: number
          organizationId: string
          placeName: string
          startDate: string
          title: string
          topic: Database["public"]["Enums"]["EventTopic"]
          updatedAt: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          embedding?: string | null
          endDate?: string
          id?: string
          latitude?: number
          longitude?: number
          organizationId?: string
          placeName?: string
          startDate?: string
          title?: string
          topic?: Database["public"]["Enums"]["EventTopic"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Event_organizationId_fkey"
            columns: ["organizationId"]
            isOneToOne: false
            referencedRelation: "Organization"
            referencedColumns: ["id"]
          },
        ]
      }
      EventRecommendation: {
        Row: {
          coordinatorId: string
          createdAt: string
          eventId: string
          id: string
          message: string | null
          updatedAt: string
          volunteerId: string
        }
        Insert: {
          coordinatorId: string
          createdAt?: string
          eventId: string
          id: string
          message?: string | null
          updatedAt: string
          volunteerId: string
        }
        Update: {
          coordinatorId?: string
          createdAt?: string
          eventId?: string
          id?: string
          message?: string | null
          updatedAt?: string
          volunteerId?: string
        }
        Relationships: [
          {
            foreignKeyName: "EventRecommendation_coordinatorId_fkey"
            columns: ["coordinatorId"]
            isOneToOne: false
            referencedRelation: "Coordinator"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EventRecommendation_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EventRecommendation_volunteerId_fkey"
            columns: ["volunteerId"]
            isOneToOne: false
            referencedRelation: "Volunteer"
            referencedColumns: ["id"]
          },
        ]
      }
      Organization: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          name: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id: string
          name: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          name?: string
          updatedAt?: string
        }
        Relationships: []
      }
      School: {
        Row: {
          createdAt: string
          id: string
          name: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          name: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          id?: string
          name?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Submission: {
        Row: {
          createdAt: string
          description: string | null
          eventId: string
          id: string
          status: Database["public"]["Enums"]["SubmissionStatus"]
          updatedAt: string
          volunteerId: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          eventId: string
          id: string
          status?: Database["public"]["Enums"]["SubmissionStatus"]
          updatedAt: string
          volunteerId: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          eventId?: string
          id?: string
          status?: Database["public"]["Enums"]["SubmissionStatus"]
          updatedAt?: string
          volunteerId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Submission_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Submission_volunteerId_fkey"
            columns: ["volunteerId"]
            isOneToOne: false
            referencedRelation: "Volunteer"
            referencedColumns: ["id"]
          },
        ]
      }
      Task: {
        Row: {
          createdAt: string
          description: string | null
          endDate: string
          eventId: string
          id: string
          isCompleted: boolean
          startDate: string
          title: string
          updatedAt: string
          volunteerId: string | null
        }
        Insert: {
          createdAt?: string
          description?: string | null
          endDate: string
          eventId: string
          id: string
          isCompleted?: boolean
          startDate: string
          title: string
          updatedAt: string
          volunteerId?: string | null
        }
        Update: {
          createdAt?: string
          description?: string | null
          endDate?: string
          eventId?: string
          id?: string
          isCompleted?: boolean
          startDate?: string
          title?: string
          updatedAt?: string
          volunteerId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Task_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Task_volunteerId_fkey"
            columns: ["volunteerId"]
            isOneToOne: false
            referencedRelation: "Volunteer"
            referencedColumns: ["id"]
          },
        ]
      }
      Volunteer: {
        Row: {
          birthdate: string
          createdAt: string
          email: string
          id: string
          interests: string[] | null
          name: string
          past_events: string[] | null
          points: number
          preference_embedding: string | null
          schoolId: string | null
          skills: string[] | null
          updatedAt: string
        }
        Insert: {
          birthdate: string
          createdAt?: string
          email: string
          id: string
          interests?: string[] | null
          name: string
          past_events?: string[] | null
          points?: number
          preference_embedding?: string | null
          schoolId?: string | null
          skills?: string[] | null
          updatedAt: string
        }
        Update: {
          birthdate?: string
          createdAt?: string
          email?: string
          id?: string
          interests?: string[] | null
          name?: string
          past_events?: string[] | null
          points?: number
          preference_embedding?: string | null
          schoolId?: string | null
          skills?: string[] | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Volunteer_schoolId_fkey"
            columns: ["schoolId"]
            isOneToOne: false
            referencedRelation: "School"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_event_interactions: {
        Row: {
          created_at: string
          event_id: string
          id: string
          interaction_type: string
          volunteer_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          interaction_type: string
          volunteer_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          interaction_type?: string
          volunteer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_event_interactions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "Event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_event_interactions_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "Volunteer"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      ChatType: "EVENT" | "PRIVATE"
      EventTopic:
        | "ANIMALS"
        | "CHILDREN"
        | "ENVIRONMENT"
        | "ELDERLY"
        | "HEALTH"
        | "EDUCATION"
        | "COMMUNITY"
        | "TECH"
        | "OTHER"
      SubmissionStatus: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED"
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
      ChatType: ["EVENT", "PRIVATE"],
      EventTopic: [
        "ANIMALS",
        "CHILDREN",
        "ENVIRONMENT",
        "ELDERLY",
        "HEALTH",
        "EDUCATION",
        "COMMUNITY",
        "TECH",
        "OTHER",
      ],
      SubmissionStatus: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"],
    },
  },
} as const
