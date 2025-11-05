import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LandingPage = () => {
  const { auth, loading } = useAuth();

  if (loading) return <div>Loading...</div>; 

  if (!auth.role || !auth.username) {
    return <Navigate to="/login" />;
  }
  const role =
    typeof auth.role === "string" ? auth.role.toLowerCase() : "";
  if (!role) {
    return <Navigate to="/login" />;
  }
  return <Navigate to={`/${role}/dashboard`} />;
};

export default LandingPage;
