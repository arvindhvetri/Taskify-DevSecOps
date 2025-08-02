import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

export const useUserAuth = () => {
  const { user, loading, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // Wait until loading is complete
    if (!user) {
      clearUser();        // Clear any stale token or user info
      navigate("/login"); // Redirect to login
    }
  }, [user, loading, clearUser, navigate]);
};
