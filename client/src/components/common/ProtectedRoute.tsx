import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSpinner } from "./LoadingSpinner";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner label="Checking your session" />;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
