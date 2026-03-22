import { Resend } from 'resend';
import { adminDb, FieldValue } from '../lib/firebase-admin.server';
import { type EmailLog, type EmailParams } from './emailService';

export const fetchEmailLogs = async (): Promise<EmailLog[]> => {
  const snapshot = await adminDb.collection('mail_logs')
    .orderBy('createdAt', 'desc')
    .get();
    
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as EmailLog[];
};

export const sendEmail = async (params: EmailParams) => {
  const apiKey = process.env.VITE_RESEND_API_KEY;
  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Hopolo <onboarding@resend.dev>',
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      await adminDb.collection('mail_logs').add({
        to: params.to,
        subject: params.subject,
        status: 'failed',
        error: error.message,
        createdAt: FieldValue.serverTimestamp(),
      });
      throw new Error(`Resend error: ${error.message}`);
    }

    await adminDb.collection('mail_logs').add({
      to: params.to,
      subject: params.subject,
      status: 'success',
      emailId: data?.id,
      createdAt: FieldValue.serverTimestamp(),
    });

    return data;
  } catch (err: any) {
    if (err.message?.startsWith('Resend error:')) {
      throw err;
    }

    await adminDb.collection('mail_logs').add({
      to: params.to,
      subject: params.subject,
      status: 'failed',
      error: err.message || 'Unknown error',
      createdAt: FieldValue.serverTimestamp(),
    });
    throw err;
  }
};
