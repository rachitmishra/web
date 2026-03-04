import React, { useState, useEffect } from 'react';
import { useLoaderData, useActionData, useSubmit, Form } from 'react-router';
import { requireRole } from '../../lib/auth.server';
import { getStorefrontSettings, updateStorefrontSettings, type StorefrontSettings, type CustomerReview } from '../../services/storefrontService';
import Button from '../../components/ui/Button/Button';
import Input from '../../components/ui/Input/Input';
import Card from '../../components/ui/Card/Card';
import styles from './Storefront.module.css';

export async function loader({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const settings = await getStorefrontSettings();
  return { settings };
}

export async function action({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const formData = await request.formData();
  
  const settings: Partial<StorefrontSettings> = {
    bannerText: formData.get('bannerText') as string,
    bannerColor: formData.get('bannerColor') as string,
    bannerLink: formData.get('bannerLink') as string,
    bannerVisible: formData.get('bannerVisible') === 'true',
    isMaintenanceMode: formData.get('isMaintenanceMode') === 'true',
    heroTitle: formData.get('heroTitle') as string,
    heroSubtitle: formData.get('heroSubtitle') as string,
    heroImage: formData.get('heroImage') as string,
    heroCtaText: formData.get('heroCtaText') as string,
  };

  const reviewsJson = formData.get('reviews') as string;
  if (reviewsJson) {
    try {
      settings.reviews = JSON.parse(reviewsJson);
    } catch (e) {
      console.error("Failed to parse reviews JSON", e);
    }
  }

  try {
    await updateStorefrontSettings(settings);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

const AdminStorefront: React.FC = () => {
  const { settings: initialSettings } = useLoaderData() as { settings: StorefrontSettings };
  const actionData = useActionData() as { success?: boolean; error?: string };
  const submit = useSubmit();

  const [settings, setSettings] = useState<StorefrontSettings>(initialSettings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (actionData) {
      setLoading(false);
    }
  }, [actionData]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('bannerText', settings.bannerText);
    formData.append('bannerColor', settings.bannerColor);
    formData.append('bannerLink', settings.bannerLink);
    formData.append('bannerVisible', String(settings.bannerVisible));
    formData.append('isMaintenanceMode', String(settings.isMaintenanceMode));
    formData.append('heroTitle', settings.heroTitle);
    formData.append('heroSubtitle', settings.heroSubtitle);
    formData.append('heroImage', settings.heroImage);
    formData.append('heroCtaText', settings.heroCtaText);
    formData.append('reviews', JSON.stringify(settings.reviews));

    submit(formData, { method: 'post' });
  };

  return (
    <div className={styles.container}>
      <h1>Storefront Settings</h1>
      
      <Card>
        <Form className={styles.form} onSubmit={handleSubmit} method="post">
          <section className={styles.section}>
            <h3>Promo Banner</h3>
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
            <h3>Hero Section</h3>
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
              <Button type="button" variant="secondary" onClick={handleAddReview} size="small">
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
            <h3>Site Status</h3>
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

          <Button type="submit" loading={loading}>
            Save Settings
          </Button>
        </Form>

        {actionData?.success && (
          <div className={`${styles.status} ${styles.success}`}>
            Settings saved successfully!
          </div>
        )}
        {actionData?.error && (
          <div className={`${styles.status} ${styles.error}`}>
            Error: {actionData.error}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminStorefront;
