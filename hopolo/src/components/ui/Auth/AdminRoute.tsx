import React from 'react';
import { Navigate, useLocation, useRouteLoaderData } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const rootData = useRouteLoaderData('root') as { serverUser: any, role: string } | undefined;
  const location = useLocation();

  const isAdmin = rootData?.role === 'admin';
  const isLoading = !rootData && !isAdmin; // Basic heuristic

  // Note: loader in AdminLayout already handles server-side check.
  // This client-side check is for UX and avoiding flashes.
  
  if (!rootData) return null; // Wait for root loader

  if (!isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
