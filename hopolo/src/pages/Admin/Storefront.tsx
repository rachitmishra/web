import React, { useState, useEffect } from 'react';
import { useLoaderData, useActionData, useSubmit, Form } from 'react-router';
import { requireRole } from '../../lib/auth.server';
import { getStorefrontSettings, updateStorefrontSettings, type StorefrontSettings } from '../../services/storefrontService';
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
  };

  try {
    await updateStorefrontSettings(settings);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

const AdminStorefront: React.FC = () => {
  const { settings: initialSettings } = useLoaderData() as { settings: StorefrontSettings | null };
  const actionData = useActionData() as { success?: boolean; error?: string };
  const submit = useSubmit();

  const [settings, setSettings] = useState<StorefrontSettings>(initialSettings || {
    bannerText: '',
    bannerColor: '#5D3FD3',
    bannerLink: '',
    bannerVisible: false,
    isMaintenanceMode: false,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (actionData) {
      setLoading(false);
    }
  }, [actionData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Convert boolean to string for formData compatibility if needed, 
    // or just pass the object to submit if using json submission.
    // RRv7 submit handles objects well if second arg is method: post.
    submit(
      { 
        ...settings, 
        bannerVisible: String(settings.bannerVisible),
        isMaintenanceMode: String(settings.isMaintenanceMode)
      }, 
      { method: 'post' }
    );
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
                style={{ width: '100%', height: '40px', padding: '2px', border: '1px solid #ddd', borderRadius: '4px' }}
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

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />

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
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '-8px' }}>
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
