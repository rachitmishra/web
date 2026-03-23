import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Resend } from 'resend';

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  status: 'success' | 'failed';
  error?: string;
  createdAt: any;
}

export const sendEmail = async (params: EmailParams) => {
  const apiKey = process.env.VITE_RESEND_API_KEY || import.meta.env.VITE_RESEND_API_KEY;
  const resend = new Resend(apiKey);

  const response = await resend.emails.send({
    from: "Hopolo <onboarding@resend.dev>",
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  if (response.error) {
    await addDoc(collection(db, 'mail_logs'), {
      to: params.to,
      subject: params.subject,
      status: "failed",
      error: response.error.message,
      createdAt: serverTimestamp()
    });
    throw new Error(`Resend error: ${response.error.message}`);
  }

  await addDoc(collection(db, 'mail_logs'), {
    to: params.to,
    subject: params.subject,
    status: "success",
    id: response.data.id,
    createdAt: serverTimestamp()
  });

  return response.data;
};
