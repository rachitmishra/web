import React, { useState, useEffect } from 'react';
import { useActionData, useSubmit, Form } from 'react-router';
import { getAuthenticatedUser } from '../../../lib/auth.server';
import { createInvitation } from '../../../services/profileService.server';
import Button from '../../../components/ui/Button/Button';
import Input from '../../../components/ui/Input/Input';
import Card from '../../../components/ui/Card/Card';
import styles from './Invitations.module.css';

export async function action({ request }: { request: Request }) {
  const user = await getAuthenticatedUser(request);
  if (!user) throw new Response("Unauthorized", { status: 401 });

  const formData = await request.formData();
  const phoneNumber = formData.get("phoneNumber") as string;
  const role = formData.get("role") as string;

  try {
    const { inviteCode } = await createInvitation(user.uid, phoneNumber, role);
    return { success: true, inviteCode, phoneNumber, role };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

const Invitations: React.FC = () => {
  const actionData = useActionData() as { success?: boolean; inviteCode?: string; phoneNumber?: string; role?: string; error?: string };
  const submit = useSubmit();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('editor');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (actionData) {
      setLoading(false);
    }
  }, [actionData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    submit({ phoneNumber, role }, { method: "post" });
  };

  return (
    <div className={styles.container}>
      <h1>Invite New Admin</h1>
      <Card>
        <Form className={styles.form} onSubmit={handleSubmit} method="post">
          <Input 
            name="phoneNumber"
            label="Mobile Number" 
            placeholder="+1234567890" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            required 
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Role</label>
            <select 
              name="role"
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="editor">Editor (Inventory)</option>
              <option value="manager">Manager (Orders/Refunds)</option>
              <option value="admin">Admin (Full Access)</option>
            </select>
          </div>
          <Button type="submit" loading={loading} style={{ marginTop: 'var(--spacing-4)' }}>
            Generate Invitation
          </Button>
        </Form>
      </Card>

      {actionData?.error && (
        <div style={{ color: 'var(--color-danger)', marginTop: 'var(--spacing-4)' }}>
          {actionData.error}
        </div>
      )}

      {actionData?.success && actionData.inviteCode && (
        <div className={styles.result}>
          <p>Invitation created! Share this code with the user:</p>
          <div className={styles.inviteCode}>{actionData.inviteCode}</div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            The role <strong>{actionData.role}</strong> will be assigned automatically when they sign up with {actionData.phoneNumber}.
          </p>
        </div>
      )}
    </div>
  );
};

export default Invitations;