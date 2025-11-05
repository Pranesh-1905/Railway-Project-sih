import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoutes = ({ role }) => {
  const { auth, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!auth?.role) {
    return <Navigate to="/login" replace />;
  }

  if (role && auth.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />; 
};

export default ProtectedRoutes;
