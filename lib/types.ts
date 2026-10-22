/** The shapes this app reads from the Axon API. Only the fields it actually shows. */

export interface Plan {
  id: string;
  key: string;
  name: string;
  dailyPromptLimit: number | null;
  priceAmount?: number | null;
  currency?: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  profilePic: string | null;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "BLOCKED";
  planId: string | null;
  plan?: Plan | null;
  subscriptionStatus:
    | "NONE"
    | "INCOMPLETE"
    | "TRIALING"
    | "ACTIVE"
    | "PAST_DUE"
    | "CANCELED"
    | "UNPAID";
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

/** GET /usage — today's quota. See QuotaStatus in the server. */
export interface Usage {
  planKey: string | null;
  planName: string | null;
  unlimited: boolean;
  limit: number | null;
  used: number;
  remaining: number | null;
  resetsAt: string;
}

/** POST /login, /register and /auth/extension/token all answer with this. */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user?: User;
}
