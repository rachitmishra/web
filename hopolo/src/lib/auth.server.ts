import { adminAuth } from './firebase-admin.server';

const SESSION_COOKIE_NAME = 'hopolo_session';
const FIVE_DAYS_IN_MS = 60 * 60 * 24 * 5 * 1000;

/**
 * Creates a secure Firebase Session Cookie from an ID Token.
 */
export async function createSessionCookie(idToken: string) {
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: FIVE_DAYS_IN_MS,
  });
  
  return {
    cookie: `${SESSION_COOKIE_NAME}=${sessionCookie}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${FIVE_DAYS_IN_MS / 1000}`,
    expires: FIVE_DAYS_IN_MS
  };
}

/**
 * Clears the session cookie.
 */
export function getSignOutCookie() {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Gets the authenticated user from the request using the Firebase Session Cookie.
 */
export async function getAuthenticatedUser(request: Request) {
  const cookieHeader = request.headers.get('Cookie');
  const sessionCookie = cookieHeader?.split('; ').find(row => row.trim().startsWith(`${SESSION_COOKIE_NAME}=`))?.split('=')[1];

  if (!sessionCookie) return null;

  try {
    // Verify the session cookie. checkRevoked: true is more secure but adds a network request.
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      phoneNumber: decodedClaims.phone_number
    };
  } catch (error: any) {
    // Session cookie might be expired or revoked
    return null;
  }
}

/**
 * Middleware-like function to require a specific role.
 */
export async function requireRole(request: Request, allowedRoles: string[]) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const { adminDb } = await import('./firebase-admin.server');
  const profileDoc = await adminDb.collection('profiles').doc(user.uid).get();
  
  if (!profileDoc.exists) {
    throw new Response("Profile not found", { status: 404 });
  }

  const role = profileDoc.data()?.role || 'user';
  
  if (!allowedRoles.includes(role)) {
    throw new Response("Forbidden", { status: 403 });
  }

  return { user, role };
}
