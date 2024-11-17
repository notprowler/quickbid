import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="p-4">
      <h2>Welcome, {user?.name}</h2>
      <p>Email: {user?.email}</p>
      <img
        src={user?.picture}
        alt="Profile"
        className="w-16 h-16 rounded-full"
      />
    </div>
  );
}
