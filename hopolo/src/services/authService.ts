import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type ConfirmationResult,
  type UserCredential,
  signOut,
} from "firebase/auth";
import { auth } from "../lib/firebase";

export const signInWithPhone = async (
  phoneNumber: string,
  recaptchaContainerId: string
): Promise<ConfirmationResult> => {
  const recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
    size: "invisible",
  });

  return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
};

export const verifyOtp = async (
  confirmationResult: ConfirmationResult,
  otp: string
): Promise<UserCredential> => {
  return confirmationResult.confirm(otp);
};

export const signOutUser = async (): Promise<void> => {
  return signOut(auth);
};
