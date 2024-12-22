export const fetchWithRetry = async (url: string, options?: RequestInit) => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  // Přidáme auth token do headers
  const token = localStorage.getItem("authToken");
  const headers = {
    ...options?.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await fetch(url, { ...options, headers });
      if (response.ok) {
        return response;
      }
      // Pokud dostaneme 401, přesměrujeme na login
      if (response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("tokenExpiry");
        window.location.href = "/login";
        break;
      }
      // Pokud server není OK, čekáme a zkoušíme znovu
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    } catch (error) {
      if (i === MAX_RETRIES - 1) throw error;
      // Čekáme před dalším pokusem
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
  throw new Error("Server není dostupný ani po několika pokusech");
};
