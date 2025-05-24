export interface Root {
  details: UserDetails;
  message: string;
}

export interface UserDetails {
  created_at: string;
  dob: string;
  email: string;
  id: number;
  role: string;
  team_id: number;
  tokens: Tokens;
  updated_at: string;
  username: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}
