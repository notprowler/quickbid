import { useEffect, useState } from "react";
import axios from "axios";

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Sending request to /auth/verify...");
        const response = await axios.get("http://localhost:3000/auth/verify", {
          withCredentials: true,
        });
        console.log("Auth Response:", response.data);
        setAuthenticated(response.data.authenticated);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
        console.log("Auth Status:", authenticated);
      }
    };

    checkAuth();
  }, []);

  return { authenticated, loading };
};
