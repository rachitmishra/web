import React from 'react';
import { useDebug } from '../../../hooks/useDebug';
import styles from './DebugOverlay.module.css';

const DebugOverlay: React.FC = () => {
  const { isDebugMode, errors, clearDebugErrors } = useDebug();

  if (!isDebugMode || errors.length === 0) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.header}>
        <span>DEBUG MODE: {errors.length} ERRORS</span>
        <button onClick={clearDebugErrors} className={styles.clearBtn}>CLEAR ALL</button>
      </div>
      <div className={styles.errorList}>
        {errors.map((error) => (
          <div key={error.id} className={styles.errorItem}>
            <span className={styles.timestamp}>{error.timestamp.toLocaleTimeString()}</span>
            {error.source && <span className={styles.source}>[{error.source}]</span>}
            <span className={styles.message}>{error.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugOverlay;
