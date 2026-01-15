import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { subscribeToStorefrontSettings } from '../../../services/storefrontService';
import { getUserProfile, type UserProfile } from '../../../services/profileService';
import { auth } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface MaintenanceGuardProps {
  children: React.ReactNode;
}

const MaintenanceGuard: React.FC<MaintenanceGuardProps> = ({ children }) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Subscribe to Storefront Settings
    const unsubscribeSettings = subscribeToStorefrontSettings((settings) => {
      setIsMaintenanceMode(settings?.isMaintenanceMode || false);
    });

    // 2. Subscribe to Auth State and Fetch Profile
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setAuthLoading(false);
    });

    return () => {
      unsubscribeSettings();
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    if (isMaintenanceMode === null || authLoading) return;

    const isAdmin = userProfile?.role === 'admin';
    const isMaintenancePage = location.pathname === '/maintenance';

    if (isMaintenanceMode && !isAdmin && !isMaintenancePage) {
      navigate('/maintenance', { replace: true });
    } else if (!isMaintenanceMode && isMaintenancePage) {
      navigate('/', { replace: true });
    }
  }, [isMaintenanceMode, userProfile, authLoading, location.pathname, navigate]);

  // Show a blank screen or a simple loader while checking state to prevent flickers
  if (isMaintenanceMode === null || authLoading) {
    return null; 
  }

  return <>{children}</>;
};

export default MaintenanceGuard;
