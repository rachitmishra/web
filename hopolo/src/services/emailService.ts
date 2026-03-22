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
