import { Resend } from 'resend';
import { addDoc, collection, serverTimestamp, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

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

export const fetchEmailLogs = async (): Promise<EmailLog[]> => {
  const q = query(collection(db, 'mail_logs'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as EmailLog[];
};

export const sendEmail = async (params: EmailParams) => {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY;
  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Hopolo <onboarding@resend.dev>',
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      await addDoc(collection(db, 'mail_logs'), {
        to: params.to,
        subject: params.subject,
        status: 'failed',
        error: error.message,
        createdAt: serverTimestamp(),
      });
      throw new Error(`Resend error: ${error.message}`);
    }

    await addDoc(collection(db, 'mail_logs'), {
      to: params.to,
      subject: params.subject,
      status: 'success',
      id: data?.id,
      createdAt: serverTimestamp(),
    });

    return data;
  } catch (err: any) {
    // If it wasn't already logged (e.g. network error before resend call completed)
    // we might want to log it here, but the specific requirement was about the resend result.
    // However, if the `resend.emails.send` throws, we should catch it.
    // The previous implementation threw explicitly on `if (error)`.
    // Let's ensure we rethrow.
    
    // Check if it's the error we threw above
    if (err.message.startsWith('Resend error:')) {
      throw err;
    }

    // Unexpected error
    await addDoc(collection(db, 'mail_logs'), {
      to: params.to,
      subject: params.subject,
      status: 'failed',
      error: err.message || 'Unknown error',
      createdAt: serverTimestamp(),
    });
    throw err;
  }
};
