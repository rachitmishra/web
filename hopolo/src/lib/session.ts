import { v4 as uuidv4 } from 'uuid';

const SESSION_STORAGE_KEY = 'hopolo_session_id';

export const getSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  
  return sessionId;
};
