export const fetchWithRetry = async (url: string, options?: RequestInit) => {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
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
