import { useEffect, useState } from "react";
import api from "../api/axios";
import useAuth from "../hooks/useAuth.js";
import Navbar from "../components/Navbar.jsx";

export default function Profile() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  async function saveProfile(e) {
    e.preventDefault();
    setMsg("");
    setError("");
    if (!fullName || !email) {
      setError("Full name and email are required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }
    try {
      setLoading(true);
      const res = await api.put("/api/users/me", { fullName, email });
      setMsg(res.data.message || "Profile updated successfully");
    } catch (err) {
      const m = err?.response?.data?.error || "Update failed";
      setError(m);
    } finally {
      setLoading(false);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    setPwMsg("");
    setPwError("");
    if (!oldPassword || !newPassword) {
      setPwError("Old and new password are required");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters");
      return;
    }
    try {
      setPwLoading(true);
      const res = await api.put("/api/users/me/password", { oldPassword, newPassword });
      setPwMsg(res.data.message || "Password updated successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      const m = err?.response?.data?.error || "Password update failed";
      setPwError(m);
    } finally {
      setPwLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-6">
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">User Profile</h2>
          {msg && <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">{msg}</div>}
          {error && <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
          <form className="space-y-4" onSubmit={saveProfile}>
            <div>
              <label className="block text-sm font-medium mb-1">Full name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="flex items-center gap-2">
              <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-50">{loading ? "Saving..." : "Save"}</button>
              <button type="button" onClick={() => { setFullName(user?.fullName || ""); setEmail(user?.email || ""); setError(""); setMsg(""); }} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          {pwMsg && <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">{pwMsg}</div>}
          {pwError && <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{pwError}</div>}
          <form className="space-y-4" onSubmit={changePassword}>
            <div>
              <label className="block text-sm font-medium mb-1">Old password</label>
              <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button type="submit" disabled={pwLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-50">{pwLoading ? "Updating..." : "Update password"}</button>
          </form>
        </section>
      </main>
    </div>
  );
}

