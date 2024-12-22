// src/pages/Login.tsx
import { useState } from "react";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Attempting login with:", password);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        localStorage.setItem("authToken", data.token);
        // Nastavíme expiry na 1 minutu synchronně s BE tokenem
        localStorage.setItem(
          "tokenExpiry",
          new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 1 den
        );
        window.location.reload(); // Místo přesměrování refreshneme stránku
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        setError(errorData.message || "Nesprávné heslo");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Chyba při přihlašování");
    }
  };

  // Kontrola existujícího tokenu
  const token = localStorage.getItem("authToken");
  const expiry = localStorage.getItem("tokenExpiry");
  if (token && expiry && new Date(expiry) > new Date()) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold">Přihlášení</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input
            type="password"
            placeholder="Heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Přihlásit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
