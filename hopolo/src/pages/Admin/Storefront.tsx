import React, { useState, useEffect } from 'react';
import { getStorefrontSettings, updateStorefrontSettings, type StorefrontSettings, type CustomerReview, DEFAULT_SETTINGS } from '../../services/storefrontService';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import Card from '../../components/ui/Card/Card';
import styles from './Storefront.module.css';

const AdminStorefront: React.FC = () => {
  const [settings, setSettings] = useState<StorefrontSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getStorefrontSettings();
        setSettings(data);
      } catch (err) {
        console.error("Failed to load storefront settings", err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleAddReview = () => {
    setSettings({
      ...settings,
      reviews: [...settings.reviews, { name: '', emoji: '😊', text: '' }]
    });
  };

  const handleRemoveReview = (index: number) => {
    const newReviews = [...settings.reviews];
    newReviews.splice(index, 1);
    setSettings({ ...settings, reviews: newReviews });
  };

  const handleUpdateReview = (index: number, field: keyof CustomerReview, value: string) => {
    const newReviews = [...settings.reviews];
    newReviews[index] = { ...newReviews[index], [field]: value };
    setSettings({ ...settings, reviews: newReviews });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    
    try {
      await updateStorefrontSettings(settings);
      setStatus({ type: 'success', message: 'Settings saved successfully!' });
    } catch (error: any) {
      setStatus({ type: 'error', message: `Error: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.container}>Loading settings...</div>;

  return (
    <div className={styles.container}>
      <h1>Storefront Settings</h1>
      
      <Card>
        <form className={styles.form} onSubmit={handleSubmit}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Promo Banner</h3>
            </div>
            <Input
              name="bannerText"
              label="Banner Text"
              value={settings.bannerText}
              onChange={(e) => setSettings({ ...settings, bannerText: e.target.value })}
              required
            />
            <div className={styles.field}>
              <label htmlFor="bannerColor" className={styles.label}>Banner Color</label>
              <input
                id="bannerColor"
                name="bannerColor"
                type="color"
                value={settings.bannerColor}
                onChange={(e) => setSettings({ ...settings, bannerColor: e.target.value })}
                className={styles.colorInput}
              />
            </div>
            <Input
              name="bannerLink"
              label="Banner Link (URL)"
              value={settings.bannerLink}
              onChange={(e) => setSettings({ ...settings, bannerLink: e.target.value })}
            />
            <div className={styles.toggleField}>
              <input
                id="bannerVisible"
                name="bannerVisible"
                type="checkbox"
                checked={settings.bannerVisible}
                onChange={(e) => setSettings({ ...settings, bannerVisible: e.target.checked })}
              />
              <label htmlFor="bannerVisible" className={styles.label}>Show Banner</label>
            </div>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Hero Section</h3>
            </div>
            <Input
              name="heroTitle"
              label="Hero Title"
              value={settings.heroTitle}
              onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
              required
            />
            <Input
              name="heroSubtitle"
              label="Hero Subtitle"
              value={settings.heroSubtitle}
              onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
              required
            />
            <Input
              name="heroImage"
              label="Hero Image URL"
              value={settings.heroImage}
              onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
              required
            />
            <Input
              name="heroCtaText"
              label="CTA Text"
              value={settings.heroCtaText}
              onChange={(e) => setSettings({ ...settings, heroCtaText: e.target.value })}
              required
            />
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Customer Reviews</h3>
              <Button type="button" variant="secondary" onClick={handleAddReview} style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
                Add Review
              </Button>
            </div>
            
            <div className={styles.reviewsList}>
              {settings.reviews.map((review, index) => (
                <div key={index} className={styles.reviewItem}>
                  <div className={styles.reviewRow}>
                    <Input
                      label="Reviewer Name"
                      value={review.name}
                      onChange={(e) => handleUpdateReview(index, 'name', e.target.value)}
                      required
                    />
                    <Input
                      label="Emoji"
                      value={review.emoji}
                      onChange={(e) => handleUpdateReview(index, 'emoji', e.target.value)}
                      required
                      style={{ width: '80px' }}
                    />
                  </div>
                  <Input
                    label="Review Text"
                    value={review.text}
                    onChange={(e) => handleUpdateReview(index, 'text', e.target.value)}
                    required
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleRemoveReview(index)}
                    className={styles.removeBtn}
                  >
                    Remove Review
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <hr className={styles.divider} />

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Site Status</h3>
            </div>
            <div className={styles.toggleField}>
              <input
                id="isMaintenanceMode"
                name="isMaintenanceMode"
                type="checkbox"
                checked={settings.isMaintenanceMode}
                onChange={(e) => setSettings({ ...settings, isMaintenanceMode: e.target.checked })}
              />
              <label htmlFor="isMaintenanceMode" className={styles.label}>Maintenance Mode (Close Storefront)</label>
            </div>
            <p className={styles.hint}>
              When enabled, non-admin users will be redirected to a maintenance page.
            </p>
          </section>

          <Button type="submit" loading={saving}>
            Save Settings
          </Button>
        </form>

        {status && (
          <div className={`${styles.status} ${status.type === 'success' ? styles.success : styles.error}`}>
            {status.message}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminStorefront;
