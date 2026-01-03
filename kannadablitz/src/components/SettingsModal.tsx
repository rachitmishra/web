import { X } from "./Icons";
import Button from "./Button";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedbackDuration: number;
  setFeedbackDuration: (duration: number) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  feedbackDuration,
  setFeedbackDuration,
}: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="habit-nudge-overlay" onClick={onClose}>
      <div className="habit-nudge-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 className="habit-nudge-title" style={{ margin: 0 }}>Settings</h2>
            <button onClick={onClose} className="btn--icon">
                <X size={24} />
            </button>
        </div>

        <div style={{ textAlign: "left" }}>
          <label style={{ display: "block", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-title)" }}>
            Feedback Speed
          </label>
          <p style={{ fontSize: "0.875rem", color: "var(--muted-text)", marginBottom: "1rem" }}>
            How long to show the result before moving to the next question.
          </p>
          
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button 
                onClick={() => setFeedbackDuration(2000)} 
                variant={feedbackDuration === 2000 ? "primary" : "surface"}
                className={feedbackDuration === 2000 ? "" : "btn--surface"}
                style={{ flex: 1 }}
            >
              Fast (2s)
            </Button>
            <Button 
                onClick={() => setFeedbackDuration(4000)} 
                variant={feedbackDuration === 4000 ? "primary" : "surface"}
                className={feedbackDuration === 4000 ? "" : "btn--surface"}
                style={{ flex: 1 }}
            >
              Normal (4s)
            </Button>
            <Button 
                onClick={() => setFeedbackDuration(6000)} 
                variant={feedbackDuration === 6000 ? "primary" : "surface"}
                className={feedbackDuration === 6000 ? "" : "btn--surface"}
                style={{ flex: 1 }}
            >
              Slow (6s)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
