import { CheckCircle, XCircle } from "./Icons";

interface Feedback {
  type: "success" | "error";
  msg: string;
  newWords?: { word: string; meaning: string }[];
}

interface FeedbackToastProps {
  feedback: Feedback | null;
  explanation?: string;
}

export default function FeedbackToast({ feedback, explanation }: FeedbackToastProps) {
  return (
    <div className={`feedback-toast ${feedback ? "show" : ""}`}>
      {feedback && (
        <div
          className={`toast-content ${
            feedback.type === "success" ? "toast-success" : "toast-error"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="shrink-0" />
          ) : (
            <XCircle className="shrink-0" />
          )}
          <div>
            <p className="toast-title">
              {feedback.type === "success"
                ? "Sari! (Correct)"
                : "Tappu! (Wrong)"}
            </p>
            <p className="toast-msg">{feedback.msg}</p>
            {feedback.newWords && feedback.newWords.length > 0 && (
                <div className="explanation-box">
                  <strong>Explanation:</strong> {explanation}
                  {feedback.newWords && (
                      <div>
                          {feedback.newWords.map((word: { word: string, meaning: string }, i: number) => (
                              <p key={i} className="new-word-item">
                                  <strong>{word.word}:</strong> {word.meaning}
                              </p>
                          ))}
                      </div>
                  )}
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
