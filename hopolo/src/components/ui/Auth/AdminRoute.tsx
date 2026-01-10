import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProfile } from '../../../services/profileService';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        setIsAdmin(profile?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Checking authorization...</div>;

  if (!isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
