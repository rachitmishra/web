import { adminAuth } from './firebase-admin.server';

/**
 * Gets the authenticated user from the request.
 * For now, we'll implement a simple check for an 'Authorization' header 
 * or a 'session' cookie containing a Firebase ID Token.
 */
export async function getAuthenticatedUser(request: Request) {
  const cookieHeader = request.headers.get('Cookie');
  const sessionCookie = cookieHeader?.split('; ').find(row => row.startsWith('session='))?.split('=')[1];
  
  const authHeader = request.headers.get('Authorization');
  const idToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : sessionCookie;

  if (!idToken) return null;

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      phoneNumber: decodedToken.phone_number
    };
  } catch (error) {
    console.error('Failed to verify token:', error);
    return null;
  }
}

/**
 * Middleware-like function to require a specific role.
 * Throws a 403 response if the user doesn't have the required role.
 */
export async function requireRole(request: Request, allowedRoles: string[]) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }

  // We need to fetch the profile to get the role (server-side)
  // This is a bit circular since getSecureProfile is in another file,
  // but we can import it or use a raw Firestore check.
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