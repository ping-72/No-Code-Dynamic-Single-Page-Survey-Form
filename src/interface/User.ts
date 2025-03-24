export interface UserData {
  userId: string; // Unique, generated as uuid during sign up
  name: string;
  email: string;
  photo?: string;
  token?: string;
  exp?: number; // Expiry timestamp (Unix epoch seconds)
}
