import React, { useEffect } from 'react';
import { useLocation, useNavigate, useRouteLoaderData } from 'react-router-dom';
import { type StorefrontSettings } from '../../../services/storefrontService';

interface MaintenanceGuardProps {
  children: React.ReactNode;
}

const MaintenanceGuard: React.FC<MaintenanceGuardProps> = ({ children }) => {
  const rootData = useRouteLoaderData('root') as { 
    serverUser: any, 
    role: string, 
    settings: StorefrontSettings 
  } | undefined;
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!rootData) return;

    const isAdmin = rootData.role === 'admin';
    const isMaintenanceMode = rootData.settings?.isMaintenanceMode || false;
    const isMaintenancePage = location.pathname === '/maintenance';

    if (isMaintenanceMode && !isAdmin && !isMaintenancePage) {
      navigate('/maintenance', { replace: true });
    } else if (!isMaintenanceMode && isMaintenancePage) {
      navigate('/', { replace: true });
    }
  }, [rootData, location.pathname, navigate]);

  return <>{children}</>;
};

export default MaintenanceGuard;
