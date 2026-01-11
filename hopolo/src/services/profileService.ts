import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
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
  role?: 'user' | 'admin';
}

const getUserRef = (uid: string) => doc(db, 'users', uid);

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userDoc = await getDoc(getUserRef(uid));
  if (userDoc.exists()) {
    return { uid, ...userDoc.data() } as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  const userRef = getUserRef(uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    await setDoc(userRef, updates);
  } else {
    await updateDoc(userRef, updates);
  }
};

export const saveAddress = async (uid: string, address: Address): Promise<void> => {
  const profile = await getUserProfile(uid);
  const addresses = profile?.addresses || [];
  
  // For MVP, we just add or replace primary. 
  // Here we'll append.
  await updateUserProfile(uid, {
    addresses: [...addresses, address]
  });
};

export const deleteAddress = async (uid: string, index: number): Promise<void> => {
  const profile = await getUserProfile(uid);
  if (profile?.addresses) {
    const newAddresses = [...profile.addresses];
    newAddresses.splice(index, 1);
    await updateUserProfile(uid, { addresses: newAddresses });
  }
};
