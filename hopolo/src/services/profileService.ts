export interface Address {
  street: string;
  city: string;
  state?: string;
  zip?: string;
}

export interface UserProfile {
  uid: string;
  displayName?: string;
  emoji?: string;
  addresses?: Address[];
  role?: 'user' | 'editor' | 'manager' | 'admin';
}
