import React, { useState, useEffect } from 'react';
import { useSubmit, useActionData, useLoaderData } from 'react-router';
import { createInvitation } from '../../services/profileService.server';
import { requireRole } from '../../lib/auth.server';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import Card from '../../components/ui/Card/Card';
import styles from './Invitations.module.css';

export async function loader({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  return null;
}

export async function action({ request }: { request: Request }) {
  const { user } = await requireRole(request, ['admin']);
  const formData = await request.formData();
  const phoneNumber = formData.get("phoneNumber") as string;
  const role = formData.get("role") as string;

  try {
    const result = await createInvitation(user.uid, phoneNumber, role);
    return { success: true, inviteCode: result.inviteCode };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

const Invitations: React.FC = () => {
  const actionData = useActionData() as { success: boolean, inviteCode?: string, error?: string };
  const submit = useSubmit();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('editor');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean, inviteCode?: string, error?: string } | null>(null);

  useEffect(() => {
    if (actionData) {
      setLoading(false);
      setResult(actionData);
      if (actionData.success) {
        setPhoneNumber('');
      }
    }
  }, [actionData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    submit(
      { phoneNumber, role },
      { method: 'post' }
    );
  };

  return (
    <div className={styles.container}>
      <h1>Manage Invitations</h1>
      <p className={styles.subtitle}>Invite new team members by their phone number.</p>

      <Card className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Phone Number"
            placeholder="+91..."
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          
          <div className={styles.field}>
            <label className={styles.label}>Assign Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className={styles.select}
            >
              <option value="editor">Editor</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <Button type="submit" loading={loading} style={{ marginTop: 'var(--spacing-4)' }}>
            Generate Invite Code
          </Button>
        </form>

        {result && (
          <div className={`${styles.result} ${result.success ? styles.success : styles.error}`}>
            {result.success ? (
              <>
                <p>Invite code generated successfully!</p>
                <div className={styles.codeWrapper}>
                  <code className={styles.code}>{result.inviteCode}</code>
                </div>
                <p className={styles.hint}>Share this code with the user to sign up.</p>
              </>
            ) : (
              <p>Error: {result.error}</p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Invitations;
