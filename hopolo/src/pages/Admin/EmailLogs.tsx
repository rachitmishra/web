import React, { useEffect, useState } from "react";
import { fetchEmailLogs, type EmailLog } from "../../services/emailService";
import Card from "../../components/ui/Card/Card";
import Button from "../../components/ui/Button/Button";
import { useNavigate } from "react-router-dom";
import styles from "./EmailLogs.module.css";

const EmailLogs: React.FC = () => {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await fetchEmailLogs();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, []);

  if (loading) return <div className={styles.container}>Loading logs...</div>;

  return (
    <div className={styles.container}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Email Logs</h1>
        <Button variant="secondary" onClick={() => navigate("/admin")}>
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Date</th>
              <th className={styles.th}>To</th>
              <th className={styles.th}>Subject</th>
              <th className={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className={styles.td}>
                  {log.createdAt?.toDate
                    ? log.createdAt.toDate().toLocaleString()
                    : "N/A"}
                </td>
                <td className={styles.td}>{log.to}</td>
                <td className={styles.td}>{log.subject}</td>
                <td className={styles.td}>
                  <span
                    className={`${styles.status} ${
                      styles[`status_${log.status}`]
                    }`}
                  >
                    {log.status}
                  </span>
                  {log.error && <div className={styles.error}>{log.error}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "var(--spacing-8)",
              color: "var(--color-text-muted)",
            }}
          >
            No logs found.
          </div>
        )}
      </Card>
    </div>
  );
};

export default EmailLogs;
