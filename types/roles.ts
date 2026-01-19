export type UserRole = "admin" | "employee" | "member";

export interface UserMetadata {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  role?: UserRole;
  [key: string]: unknown;
}
