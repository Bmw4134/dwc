// Simple schema without external dependencies for now
export interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpsertUser {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}

export interface Subscription {
  id: string;
  userId: string;
  planType: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due';
  stripeSubscriptionId: string;
  currentPeriodEnd: Date;
  createdAt: Date;
}