import { Resend } from 'resend';

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (params: EmailParams) => {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY;
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: 'Hopolo <onboarding@resend.dev>', // Using Resend's default testing domain
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return data;
};
