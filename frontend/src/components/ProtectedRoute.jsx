import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import Spinner from "./Spinner.jsx";

export default function ProtectedRoute({ children, role }) {
  const { token, user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  if (!token) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/login" replace />;
  return children;
}
