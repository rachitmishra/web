import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { getUserProfile, updateUserProfile, UserProfile, saveAddress, deleteAddress, Address } from '../services/profileService';
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

  // Address form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newZip, setNewZip] = useState('');

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

  useEffect(() => {
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

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      setSaving(true);
      try {
        await saveAddress(user.uid, { street: newStreet, city: newCity, zip: newZip });
        await loadProfile();
        setShowAddressForm(false);
        setNewStreet('');
        setNewCity('');
        setNewZip('');
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDeleteAddress = async (index: number) => {
    const user = auth.currentUser;
    if (user) {
      try {
        await deleteAddress(user.uid, index);
        await loadProfile();
      } catch (err) {
        console.error(err);
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
                <div className={styles.addressDetails}>
                  <strong>{addr.street}</strong>
                  <span>{addr.city}, {addr.zip}</span>
                </div>
                <div className={styles.addressActions}>
                  <Button variant="outline" style={{ padding: '4px 8px', fontSize: '0.75rem' }} onClick={() => handleDeleteAddress(i)}>Delete</Button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--color-text-muted)' }}>No addresses saved yet.</p>
          )}
          
          {!showAddressForm ? (
            <Button variant="outline" style={{ width: 'fit-content' }} onClick={() => setShowAddressForm(true)}>Add New Address</Button>
          ) : (
            <form className={styles.addressForm} onSubmit={handleAddAddress}>
              <Input label="Street" value={newStreet} onChange={(e) => setNewStreet(e.target.value)} required />
              <Input label="City" value={newCity} onChange={(e) => setNewCity(e.target.value)} required />
              <Input label="Zip" value={newZip} onChange={(e) => setNewZip(e.target.value)} required />
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button type="submit" loading={saving}>Save Address</Button>
                <Button variant="secondary" onClick={() => setShowAddressForm(false)}>Cancel</Button>
              </div>
            </form>
          )}
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
