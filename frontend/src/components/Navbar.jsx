import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  return (
    <header className="w-full bg-white border-b shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-indigo-600 font-semibold">PurpleMerit</span>
          <span className="text-sm text-gray-500">| {user.fullName} ({user.role})</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link
            to="/profile"
            className={`text-sm ${location.pathname === "/profile" ? "text-indigo-600" : "text-gray-700"}`}
          >
            Profile
          </Link>
          {user.role === "admin" && (
            <Link
              to="/dashboard"
              className={`text-sm ${location.pathname === "/dashboard" ? "text-indigo-600" : "text-gray-700"}`}
            >
              Admin Dashboard
            </Link>
          )}
          <button
            onClick={logout}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

