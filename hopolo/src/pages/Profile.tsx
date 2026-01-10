import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { getUserProfile, updateUserProfile, UserProfile } from '../services/profileService';
import Button from '../components/ui/Button/Button';
import Card from '../components/ui/Card/Card';
import Input from '../components/ui/Input/Input';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const data = await getUserProfile(user.uid);
        if (data) {
          setProfile(data);
          setDisplayName(data.displayName || '');
          setEmoji(data.emoji || '');
        }
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      setSaving(true);
      try {
        await updateUserProfile(user.uid, { displayName, emoji });
        setProfile(prev => prev ? { ...prev, displayName, emoji } : null);
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className={styles.container}>
      <h1>Your Profile</h1>

      <Card>
        <form className={styles.form} onSubmit={handleSave}>
          <Input 
            label="Display Name" 
            value={displayName} 
            onChange={(e) => setDisplayName(e.target.value)} 
          />
          <Input 
            label="Profile Emoji" 
            value={emoji} 
            onChange={(e) => setEmoji(e.target.value)} 
            placeholder="e.g. 👋"
          />
          <Button type="submit" loading={saving}>Save Changes</Button>
        </form>
      </Card>

      <section className={styles.section}>
        <h2>Address Book</h2>
        <div className={styles.addressList}>
          {profile?.addresses && profile.addresses.length > 0 ? (
            profile.addresses.map((addr, i) => (
              <div key={i} className={styles.addressCard}>
                {addr.street}, {addr.city}
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--color-text-muted)' }}>No addresses saved yet.</p>
          )}
          <Button variant="outline" style={{ width: 'fit-content' }}>Add New Address</Button>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Order History</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>No orders found.</p>
      </section>
    </div>
  );
};

export default Profile;
