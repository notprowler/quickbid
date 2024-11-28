import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import TestImage from "../assets/cutedog.jpg";
import EditProfile from "../components/EditProfile";
import AddFunds from "../components/AddFunds";
import axios from "axios";

interface UserData {
  name: string;
  email: string;
  username: string;
  profilePicture: string;
  vipStatus: boolean;
  balance: number;
  ratings: {
    average: number;
    count: number;
  };
  listings: {
    id: number;
    title: string;
    price: number;
    sold: boolean;
  }[];
}

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth0();
  const [showListings, setShowListings] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    username: user?.nickname || "john_doe",
    profilePicture: user?.picture || "",
    vipStatus: true,
    balance: 0,
    ratings: { average: 4.5, count: 10 },
    listings: [
      { id: 1, title: "Vintage Bike", price: 120, sold: false },
      { id: 2, title: "Office Desk", price: 200, sold: true },
      { id: 3, title: "Antique Lamp", price: 75, sold: true },
      { id: 4, title: "Gaming Chair", price: 150, sold: false },
    ],
  });

  const handleProfileUpdate = (updatedData: Partial<UserData>) => {
    setUserData((prevData) => ({
      ...prevData,
      ...updatedData,
    }));
  };

  // function to get the clientSecret
  const handleOpenAddFunds = async (amount: number) => {
    try {
      // call backend to make payment intent
      const response = await axios.post(
        "http://localhost:4000/create-payment-intent",
        {
          amount: amount * 100, // need amount in cents
        },
      );

      setClientSecret(response.data.clientSecret);
      setIsAddFundsOpen(true);
    } catch (error) {
      console.error("Failed to create payment intent: ", error);
    }
  };

  const handlePaymentSuccess = (amount: number) => {
    setUserData((prevData) => ({
      ...prevData,
      balance: prevData.balance + amount,
    }));
    console.log("added funds:", amount);
  };

  if (!isAuthenticated) {
    return (
      <div className="mt-10 text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4 font-imprima">
      <h1 className="mb-4 text-3xl font-bold">Welcome, {userData.name}</h1>

      {/* User Information Card */}
      <div className="mb-6 flex items-center gap-4 rounded-lg px-8 py-4 shadow-md">
        <img
          src={user?.picture}
          alt="User Avatar"
          className="h-36 w-36 rounded-full object-cover"
        />
        <div>
          <div className="px-4">
            <h2 className="text-2xl font-bold">{userData.name}</h2>
            <p className="text-xl text-gray-600">{userData.email}</p>
            <span
              className={`mt-2 inline-block rounded-full px-3 py-1 text-white ${
                userData.vipStatus ? "bg-[#246fb6]" : "bg-gray-400"
              }`}
            >
              {userData.vipStatus ? "VIP Member 🏆" : "Regular User"}
            </span>
          </div>
          <div className="mt-4 flex gap-12 px-4">
            <div>
              <p className="text-sm font-semibold">Balance</p>
              <p className="text-xl font-bold">
                ${userData.balance.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold">Rating</p>
              <p className="text-xl font-bold">
                {userData.ratings.average} / 5
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold">Reviews</p>
              <p className="text-xl font-bold">{userData.ratings.count}</p>
            </div>
          </div>
          <div className="space-x-20">
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="mt-4 rounded-full px-4 py-2 font-semibold text-[#246fb6] transition duration-200 ease-in-out hover:bg-slate-200"
            >
              Edit Profile
            </button>

            <button
              onClick={() => setIsAddFundsOpen(true)}
              className="mt-4 rounded-full px-4 py-2 font-semibold text-[#246fb6] transition duration-200 ease-in-out hover:bg-slate-200"
            >
              Add Funds
            </button>
          </div>
        </div>
      </div>

      {/* Listings Toggle Section */}
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={() => setShowListings(!showListings)}
          className="flex w-full items-center justify-between rounded-lg px-4 py-3"
        >
          <span className="text-2xl font-bold">View Your Listings</span>
          <span className="text-xl">{showListings ? "▲" : "▼"}</span>
        </button>
      </div>
      <hr className="mb-4" />

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showListings ? "max-h-fit opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {userData.listings.map((item) => (
          <div
            key={item.id}
            className="relative mb-4 flex items-center gap-4 rounded-lg p-4 shadow-md"
          >
            {item.sold && (
              <span className="absolute right-2 top-2 rounded-full px-3 py-1 font-semibold">
                SOLD
              </span>
            )}
            <img
              src={TestImage}
              alt={item.title}
              className="h-32 w-32 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{item.title}</h3>
              <p className="mb-2 text-lg text-gray-700">Price: ${item.price}</p>
              <hr className="my-2" />
              <div className="flex gap-2">
                <button className="rounded-full px-6 py-1 font-semibold text-[#246fb6] transition duration-200 ease-in-out hover:bg-slate-200">
                  View
                </button>
                {!item.sold && (
                  <button className="rounded-full px-4 py-1 font-semibold text-red-800 transition duration-200 ease-in-out hover:bg-slate-200">
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Profile Window */}
      <EditProfile
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        userData={userData}
        onUpdate={handleProfileUpdate}
      />

      <AddFunds
        isOpen={isAddFundsOpen}
        onClose={() => {
          setIsAddFundsOpen(false);
          setClientSecret(null); // Reset clientSecret for the next transaction
        }}
        clientSecret={clientSecret}
        onPaymentSuccess={handlePaymentSuccess}
        onRequestPayment={handleOpenAddFunds}
      />

      {/* Logout Button */}
      <button
        className="mt-6 rounded-full bg-red-800 px-4 py-2 font-semibold text-white hover:opacity-70"
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Log Out
      </button>
    </div>
  );
}
