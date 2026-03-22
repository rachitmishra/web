import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
  useLocation,
} from "react-router";
import { useEffect } from "react";
import MainLayout from "../src/components/layout/MainLayout";
import "../src/index.css";
import "../src/App.css";
import { getAuthenticatedUser } from "../src/lib/auth.server";
import { getSecureProfile } from "../src/services/profileService.server";
import { getStorefrontSettings } from "../src/services/storefrontService.server";
import { DEFAULT_SETTINGS, type StorefrontSettings } from "../src/services/storefrontService";
import { auth } from "../src/lib/firebase";
import { signOutUser } from "../src/services/authService";

import { getSessionIdFromRequest, SESSION_COOKIE_NAME } from "../src/lib/session";
import { v4 as uuidv4 } from 'uuid';

export async function loader({ request }: { request: Request }) {
  const user = await getAuthenticatedUser(request);
  const existingSessionId = getSessionIdFromRequest(request);
  
  const [profile, settings] = await Promise.all([
    user ? getSecureProfile(user.uid) : Promise.resolve(null),
    getStorefrontSettings()
  ]);

  const sessionId = existingSessionId || uuidv4();
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  
  if (!existingSessionId) {
    headers.append("Set-Cookie", `${SESSION_COOKIE_NAME}=${sessionId}; Path=/; Max-Age=${60 * 60 * 24 * 5}; SameSite=Lax`);
  }

  return new Response(JSON.stringify({ 
    serverUser: user, 
    role: profile?.role || 'user',
    settings: settings || DEFAULT_SETTINGS
  }), {
    headers
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <MainLayout>
          {children}
        </MainLayout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { serverUser } = useLoaderData() as { serverUser: any };
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Sync check:
    // If the server says we're authenticated, but the client-side Firebase is NOT,
    // that's fine (SSR works).
    // If the server says we're NOT authenticated, but the client-side Firebase IS,
    // we should sign out the client to stay in sync.
    const unsubscribe = auth.onAuthStateChanged(async (clientUser) => {
      // If we are currently on the login page, don't clear the client session
      // because we are likely in the middle of a login process where the server
      // session (cookie) hasn't been set yet but the client Firebase session IS set.
      if (location.pathname === "/login") {
        return;
      }

      if (!serverUser && clientUser) {
        console.warn("[AuthSync] Client session found without server session. Clearing client.");
        await signOutUser();
        // No need to redirect here, the page will naturally be in logged-out state
      }
    });

    return () => unsubscribe();
  }, [serverUser, location.pathname]);

  return <Outlet />;
}
