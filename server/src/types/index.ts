export interface AuthenticatedUser {
  user_id: number;
  username?: string;
  email?: string;
  iat: number; // "Issued At" timestamp from the JWT
  exp: number; // "Expiration" timestamp from the JWT
  // add more if necessary
}
