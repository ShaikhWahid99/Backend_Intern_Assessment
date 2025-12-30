import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar.jsx";
import Spinner from "../components/Spinner.jsx";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const [confirm, setConfirm] = useState({
    open: false,
    id: null,
    action: null,
  });

  const fetchUsers = useCallback(
    async (p) => {
      setError("");
      setMsg("");
      try {
        setLoading(true);
        const res = await api.get("/api/users", {
          params: { page: p, limit: 10 },
        });
        setUsers(res.data.users || []);
        setPage(p);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        const m = err?.response?.data?.error || "Failed to load users";
        setError(m);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchUsers(1);
  }, [fetchUsers]);

  function openConfirm(id, action) {
    setConfirm({ open: true, id, action });
  }

  function closeConfirm() {
    setConfirm({ open: false, id: null, action: null });
  }

  async function performAction() {
    if (!confirm.id || !confirm.action) return;
    setError("");
    setMsg("");
    try {
      setLoading(true);
      if (confirm.action === "activate") {
        await api.patch(`/api/users/${confirm.id}/activate`);
        setMsg("User activated successfully");
      } else {
        await api.patch(`/api/users/${confirm.id}/deactivate`);
        setMsg("User deactivated successfully");
      }
      await fetchUsers(page);
    } catch (err) {
      const m = err?.response?.data?.error || "Action failed";
      setError(m);
    } finally {
      setLoading(false);
      closeConfirm();
    }
  }

  function nextPage() {
    if (page < totalPages) fetchUsers(page + 1);
  }

  function prevPage() {
    if (page > 1) fetchUsers(page - 1);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Admin Dashboard</h2>
            {loading && <Spinner />}
          </div>

          {msg && (
            <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">
              {msg}
            </div>
          )}
          {error && (
            <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-3 py-2 text-center">Email</th>
                  <th className="px-3 py-2 text-center">Full name</th>
                  <th className="px-3 py-2 text-center">Role</th>
                  <th className="px-3 py-2 text-center">Status</th>
                  <th className="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-3 py-4 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}
                {users.map((u) => (
                  <tr key={u._id} className="border-t">
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2">{u.fullName}</td>
                    <td className="px-3 py-2">{u.role}</td>
                    <td className="px-3 py-2">
                      <span
                        className={
                          u.status === "active"
                            ? "text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded"
                            : "text-yellow-800 bg-yellow-50 border border-yellow-200 px-2 py-1 rounded"
                        }
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {u.role === "admin" ? (
                        u.status === "inactive" ? (
                          <button
                            onClick={() => openConfirm(u._id, "activate")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                          >
                            Activate
                          </button>
                        ) : (
                          <span className="text-gray-500">Protected</span>
                        )
                      ) : u.status === "inactive" ? (
                        <button
                          onClick={() => openConfirm(u._id, "activate")}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                        >
                          Activate
                        </button>
                      ) : (
                        <button
                          onClick={() => openConfirm(u._id, "deactivate")}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevPage}
                disabled={page === 1}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={nextPage}
                disabled={page === totalPages}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      {confirm.open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Confirm action</h3>
            <p className="text-sm text-gray-600 mb-4">
              {confirm.action === "activate"
                ? "Are you sure you want to activate this user?"
                : "Are you sure you want to deactivate this user?"}
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={closeConfirm}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={performAction}
                className={
                  confirm.action === "activate"
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                    : "bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                }
              >
                {confirm.action === "activate" ? "Activate" : "Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
