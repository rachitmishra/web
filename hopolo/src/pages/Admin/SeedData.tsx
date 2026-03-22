import React, { useState, useEffect } from 'react';
import { useSubmit, useActionData } from 'react-router';
import { seedProducts, seedReviews, seedUserProfile } from '../../services/seederService.server';
import { requireRole } from '../../lib/auth.server';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import styles from './SeedData.module.css';

export async function loader({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  return null;
}

export async function action({ request }: { request: Request }) {
  const { user } = await requireRole(request, ['admin']);
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "seed-products") {
      await seedProducts();
      return { success: true, message: "Products seeded successfully." };
    }
    if (intent === "seed-reviews") {
      await seedReviews();
      return { success: true, message: "Reviews seeded successfully." };
    }
    if (intent === "seed-profile") {
      await seedUserProfile(user.uid);
      return { success: true, message: "Profile seeded successfully." };
    }
    return { success: false, error: "Unknown intent" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

const SeedData: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const actionData = useActionData() as { success: boolean, message?: string, error?: string };
  const submit = useSubmit();

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  useEffect(() => {
    if (actionData) {
      setLoading(false);
      if (actionData.success) {
        addLog(actionData.message || "Operation successful");
      } else {
        addLog(`Error: ${actionData.error}`);
      }
    }
  }, [actionData]);

  const handleSeed = (intent: string, name: string) => {
    setLoading(true);
    addLog(`Starting ${name}...`);
    submit({ intent }, { method: "post" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>System Seeder</h1>
        <p>Initialize your database with sample data for development.</p>
      </div>

      <div className={styles.grid}>
        <Card className={styles.actionCard}>
          <h3>Core Data</h3>
          <p>Seed categories and products into the database.</p>
          <Button onClick={() => handleSeed('seed-products', 'Seed Products')} disabled={loading}>
            Seed Products
          </Button>
        </Card>

        <Card className={styles.actionCard}>
          <h3>Social Data</h3>
          <p>Generate random product reviews.</p>
          <Button onClick={() => handleSeed('seed-reviews', 'Seed Reviews')} disabled={loading}>
            Seed Reviews
          </Button>
        </Card>

        <Card className={styles.actionCard}>
          <h3>My Profile</h3>
          <p>Initialize your personal profile with sample data.</p>
          <Button onClick={() => handleSeed('seed-profile', 'Seed My Profile')} disabled={loading}>
            Seed My Profile
          </Button>
        </Card>
      </div>

      <Card className={styles.logsCard}>
        <h3>Process Logs</h3>
        <div className={styles.logs}>
          {logs.map((log, i) => (
            <div key={i} className={styles.logLine}>{log}</div>
          ))}
          {logs.length === 0 && <p className={styles.empty}>No logs yet. Start a process above.</p>}
        </div>
      </Card>
    </div>
  );
};

export default SeedData;
