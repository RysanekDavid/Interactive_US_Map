import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    const checkExpiry = () => {
      const token = localStorage.getItem("authToken");
      const expiry = localStorage.getItem("tokenExpiry");
      const now = new Date();
      const expiryDate = expiry ? new Date(expiry) : null;

      if (!token || !expiry || !expiryDate || expiryDate <= now) {
        setIsValid(false);
        localStorage.removeItem("authToken");
        localStorage.removeItem("tokenExpiry");
      }
    };

    // Kontrola při načtení
    checkExpiry();

    // Kontrola každou sekundu
    const interval = setInterval(checkExpiry, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isValid) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
