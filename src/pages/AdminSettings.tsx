// src/pages/AdminSettings.tsx
import { useState } from "react";
import { AuthGuard } from "../components/login/AuthGuard";
import { fetchWithRetry } from "../utils/api";

const AdminSettings = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetchWithRetry(
        `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword }),
        }
      );

      if (response.ok) {
        setMessage("Heslo bylo úspěšně změněno");
        setNewPassword("");
      }
    } catch (error) {
      setError("Nepodařilo se změnit heslo");
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Admin nastavení</h1>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nové heslo
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            {message && <div className="text-green-600 text-sm">{message}</div>}
            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
            >
              Změnit heslo
            </button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
};

export default AdminSettings;
