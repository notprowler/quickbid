import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface PrivateRouteProps {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { authenticated, loading } = useAuth();

  console.log("PrivateRoute - Authenticated:", authenticated);
  console.log("PrivateRoute - Loading:", loading);

  if (loading) return <div>Loading...</div>;

  return authenticated ? children : <Navigate to="/login" />;
}
