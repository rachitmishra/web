import React, { useState } from 'react';
import { createInvitation } from '../../services/profileService';
import { auth } from '../../lib/firebase';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import Card from '../../components/ui/Card/Card';
import styles from './Invitations.module.css';

const Invitations: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('editor');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean, inviteCode?: string, error?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      // Note: We use the client-side profileService which calls the Cloud Function
      const data = await createInvitation(phoneNumber, role);
      setResult({ success: true, inviteCode: data.inviteCode });
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Invite New Admin</h1>
      <Card>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input 
            name="phoneNumber"
            label="Mobile Number" 
            placeholder="+919839098390" 
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
        </form>
      </Card>

      {result?.error && (
        <div style={{ color: 'var(--color-danger)', marginTop: 'var(--spacing-4)' }}>
          {result.error}
        </div>
      )}

      {result?.success && result.inviteCode && (
        <div className={styles.result}>
          <p>Invitation created! Share this code with the user:</p>
          <div className={styles.inviteCode}>{result.inviteCode}</div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            The role <strong>{role}</strong> will be assigned automatically when they sign up with {phoneNumber}.
          </p>
        </div>
      )}
    </div>
  );
};

export default Invitations;
