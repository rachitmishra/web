import { v4 as uuidv4 } from 'uuid';

export const SESSION_COOKIE_NAME = 'hopolo_cart_id';

export const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';

  // Try to get from cookie
  const cookieMatch = document.cookie.match(new RegExp('(^| )' + SESSION_COOKIE_NAME + '=([^;]+)'));
  if (cookieMatch) return cookieMatch[2];

  // Fallback to localStorage for backward compatibility or persistence
  let sessionId = localStorage.getItem('hopolo_session_id');
  
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('hopolo_session_id', sessionId);
  }

  // Set/Refresh cookie (5 days)
  document.cookie = `${SESSION_COOKIE_NAME}=${sessionId}; path=/; max-age=${60 * 60 * 24 * 5}; SameSite=Lax`;
  
  return sessionId;
};

/**
 * Gets the session ID from a Request object (server-side).
 */
export function getSessionIdFromRequest(request: Request): string {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return '';
  
  const cartId = cookieHeader
    .split(';')
    .find(row => row.trim().startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.split('=')[1]
    ?.trim();
    
  return cartId || '';
}
