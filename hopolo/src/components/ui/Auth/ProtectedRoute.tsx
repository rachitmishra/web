import React from "react";
import { Navigate, useLocation, useRouteLoaderData } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const rootData = useRouteLoaderData('root') as { serverUser: any } | undefined;
  const location = useLocation();

  if (!rootData) return null;

  if (!rootData.serverUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
