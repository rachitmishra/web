import React, { useState } from 'react';
import { createInvitation } from '../../services/profileService';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import Card from '../../components/ui/Card/Card';
import styles from './Invitations.module.css';

const Invitations: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('editor');
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInviteCode(null);

    try {
      const result = await createInvitation(phoneNumber, role);
      setInviteCode(result.inviteCode);
    } catch (err: any) {
      setError(err.message || 'Failed to create invitation.');
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
            label="Mobile Number" 
            placeholder="+1234567890" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            required 
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Role</label>
            <select 
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

      {error && (
        <div style={{ color: 'var(--color-danger)', marginTop: 'var(--spacing-4)' }}>
          {error}
        </div>
      )}

      {inviteCode && (
        <div className={styles.result}>
          <p>Invitation created! Share this code with the user:</p>
          <div className={styles.inviteCode}>{inviteCode}</div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            The role <strong>{role}</strong> will be assigned automatically when they sign up with {phoneNumber}.
          </p>
        </div>
      )}
    </div>
  );
};

export default Invitations;
