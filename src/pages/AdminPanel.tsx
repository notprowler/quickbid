import { useEffect, useState } from "react";
import axios from "axios";

interface PendingUser {
  id: number;
  username: string;
  email: string;
  address: string;
  created_at: string;
}

const AdminPanel = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/users/application/pending",
          {
            withCredentials: true,
          },
        );
        setPendingUsers(response.data);
      } catch (err) {
        console.error("Error fetching pending users:", err);
        setError("Failed to fetch pending users.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await axios.post(
        `http://localhost:3000/api/users/approve/${id}`,
        {},
        {
          withCredentials: true,
        },
      );
      setPendingUsers((prev) => prev.filter((user) => user.id !== id)); // Remove approved user
    } catch (err) {
      console.error("Error approving user:", err);
      setError("Failed to approve user.");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await axios.post(
        `http://localhost:3000/api/users/reject/${id}`,
        {},
        { withCredentials: true },
      );
      setPendingUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error rejecting user:", err);
      setError("Failed to reject user.");
    }
  };

  if (loading) {
    return <p>Loading pending users...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Admin Panel</h1>
      {pendingUsers.length === 0 ? (
        <p>No pending users to review.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Username</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Address</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((user) => (
              <tr key={user.id}>
                <td className="border border-gray-300 px-4 py-2">
                  {user.username}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.address}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleApprove(user.id)}
                    className="mr-2 rounded bg-[#3A5B22] px-4 py-2 text-white hover:bg-[#2F4A1A]"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(user.id)}
                    className="rounded bg-red-800 px-4 py-2 text-white"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
