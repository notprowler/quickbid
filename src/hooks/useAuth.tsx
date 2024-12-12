import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  user_id: number;
  username: string;
  email: string;
  role: string; // Assuming the user object includes this field
}

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/verify", {
          withCredentials: true,
        });

        setAuthenticated(response.data.authenticated);

        // Save user data if authenticated
        if (response.data.authenticated && response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { authenticated, loading, user };
};
