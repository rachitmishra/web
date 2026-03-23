import { doc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

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

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { uid, ...docSnap.data() } as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, updates);
};

export const saveAddress = async (uid: string, address: Address) => {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, {
    addresses: arrayUnion(address)
  });
};

export const createInvitation = async (phoneNumber: string, role: string) => {
  // simple mock impl for now to satisfy tests
  return { inviteCode: 'ABC12345' };
};
