import { useEffect, useState } from "react";
import axios from "axios";

import EditProfile from "../components/EditProfile";
import AddFunds from "../components/AddFunds";

import TestImage from "../assets/cutedog.jpg";

interface UserData {
  user_id: number;
  email: string;
  username: string;
  profilePicture?: string; // Optional
  vip: boolean;
  balance: number;
  average_rating: number | null;
  listings: {
    id: number;
    title: string;
    price: number;
    sold: boolean;
  }[];
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showListings, setShowListings] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/users/profile", {
          withCredentials: true,
          validateStatus: (status) => status < 500,
        });

        console.log("Backend Response Data:", response.data);

        if (response.status === 200 || response.status === 304) {
          setUserData({
            user_id: response.data.user_id || 0,
            username: response.data.username || "Guest",
            email: response.data.email || "No Email",
            profilePicture: response.data.profilePicture || TestImage,
            vip: response.data.vip || false,
            balance: response.data.balance || 0,
            average_rating: response.data.average_rating || 0,
            listings: response.data.listings || [],
          });
          console.log("User Data State Set:", userData);
        } else {
          setError("Failed to load profile data.");
          console.error("API Error Response:", response);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Update profile data after editing
  const handleProfileUpdate = (updatedData: Partial<UserData>) => {
    setUserData((prevData) =>
      prevData ? { ...prevData, ...updatedData } : null,
    );
  };

  // Handle Stripe payment intent creation
  const handleOpenAddFunds = async (amount: number) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/create-payment-intent",
        { amount: amount * 100 }, // Amount in cents
        { withCredentials: true },
      );

      setClientSecret(response.data.clientSecret);
      setIsAddFundsOpen(true);
    } catch (error) {
      console.error("Failed to create payment intent: ", error);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = (amount: number) => {
    setUserData((prevData) =>
      prevData ? { ...prevData, balance: prevData.balance + amount } : null,
    );
    console.log("Added funds:", amount);
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="mt-10 text-center">
        <h1 className="text-2xl font-bold">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="mt-10 text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4 font-imprima">
      <h1 className="mb-4 text-3xl font-bold">Welcome, {userData.username}</h1>

      {/* User Information Card */}
      <div className="mb-6 flex items-center gap-4 rounded-lg px-8 py-4 shadow-md">
        <img
          src={userData.profilePicture || TestImage}
          alt="User Avatar"
          className="h-36 w-36 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{userData.username}</h2>
          <p className="text-xl text-gray-600">{userData.email}</p>
          <span
            className={`mt-2 inline-block rounded-full px-3 py-1 text-white ${
              userData.vip ? "bg-[#246fb6]" : "bg-gray-400"
            }`}
          >
            {userData.vip ? "VIP Member 🏆" : "Regular User"}
          </span>

          <div className="mt-4 flex gap-12">
            <div>
              <p className="text-sm font-semibold">Balance</p>
              <p className="text-xl font-bold">
                ${userData.balance ? userData.balance.toFixed(2) : "0.00"}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold">Rating</p>
              <p className="text-xl font-bold">
                {userData.average_rating !== null
                  ? userData.average_rating
                  : "No ratings yet"}{" "}
                / 5
              </p>
            </div>
          </div>

          <div className="space-x-20">
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="mt-4 rounded-full px-4 py-2 font-semibold text-[#246fb6] transition hover:bg-slate-200"
            >
              Edit Profile
            </button>

            <button
              onClick={() => handleOpenAddFunds(50)} // Example amount
              className="mt-4 rounded-full px-4 py-2 font-semibold text-[#246fb6] transition hover:bg-slate-200"
            >
              Add Funds
            </button>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="mb-2">
        <button
          onClick={() => setShowListings(!showListings)}
          className="w-full px-4 py-2 text-left"
        >
          <span className="text-2xl font-bold">
            {showListings ? "Hide Listings" : "View Listings"}
          </span>
        </button>
      </div>

      {showListings && (
        <div>
          {userData.listings.length > 0 ? (
            userData.listings.map((item) => (
              <div key={item.id} className="mb-4 rounded p-4 shadow">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-lg">Price: ${item.price}</p>
                {item.sold && (
                  <span className="font-semibold text-green-600">Sold</span>
                )}
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-600">No listings found.</p>
          )}
        </div>
      )}

      {/* Edit Profile Window */}
      <EditProfile
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        userData={{
          name: userData.username,
          email: userData.email,
          username: userData.username,
          profilePicture: userData.profilePicture || "",
        }}
        onUpdate={(updatedData) => {
          setUserData((prev) => (prev ? { ...prev, ...updatedData } : prev));
        }}
      />

      {/* Add Funds Modal */}
      <AddFunds
        isOpen={isAddFundsOpen}
        onClose={() => {
          setIsAddFundsOpen(false);
          setClientSecret(null); // Reset clientSecret for next transaction
        }}
        clientSecret={clientSecret}
        onPaymentSuccess={handlePaymentSuccess}
        onRequestPayment={handleOpenAddFunds}
      />
    </div>
  );
}
