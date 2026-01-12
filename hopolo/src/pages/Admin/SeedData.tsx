import React, { useState } from 'react';
import { seedProducts, seedReviews, seedUserProfile } from '../../services/seederService';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import { useNavigate } from 'react-router-dom';
import styles from './SeedData.module.css';

const SeedData: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleSeed = async (name: string, fn: () => Promise<void>) => {
    setLoading(true);
    addLog(`Starting ${name}...`);
    try {
      await fn();
      addLog(`${name} completed successfully.`);
    } catch (err: any) {
      console.error(err);
      addLog(`Error in ${name}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Seed Database</h1>
        <Button variant="secondary" onClick={() => navigate('/admin')}>Back to Dashboard</Button>
      </div>

      <Card>
        <p style={{ marginBottom: 'var(--spacing-4)', color: 'var(--color-text-muted)' }}>
          Populate Firestore with dummy data for testing. Note: This may create duplicates if run multiple times.
        </p>
        <div className={styles.actions}>
          <Button onClick={() => handleSeed('Seed Products', seedProducts)} disabled={loading}>
            Seed Products (Includes Categories)
          </Button>
          <Button onClick={() => handleSeed('Seed Reviews', seedReviews)} disabled={loading}>
            Seed Reviews
          </Button>
          <Button onClick={() => handleSeed('Seed My Profile', seedUserProfile)} disabled={loading}>
            Seed My Profile (Promote to Admin)
          </Button>
        </div>
      </Card>

      {logs.length > 0 && (
        <div className={styles.logs}>
          {logs.map((log, i) => <div key={i}>{log}</div>)}
        </div>
      )}
    </div>
  );
};

export default SeedData;
