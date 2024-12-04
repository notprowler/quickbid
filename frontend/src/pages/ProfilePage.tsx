import { useState, useEffect } from "react";
import EditProfile from "../components/EditProfile";
import AddFunds from "../components/AddFunds";
import Rating from "../components/Rate";
import axios from "axios";

interface UserData {
  user_id: number;
  created_at: Date;
  username: string;
  email: string;
  address: string;
  password_hash: string;
  vip: boolean;
  balance: number;
  status: string;
  role: string;
  average_rating: number;
}

interface UserListings {
  item_id: number;
  owner_id: number;
  type: string;
  title: string;
  description: string;
  price: string;
  status: string;
  created_at: string;
  image: string;
  category: string;
}

interface UserTransactions {
  transaction_id: number;
  created_at: Date;
  buyer_id: number;
  item_id: number;
  transaction_amount: number;
  discount_applied: boolean;
  listings: UserListings;
}

export default function ProfilePage() {
  // const { user, isAuthenticated, logout } = useAuth0();

  /* profile update states */
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  /* user info, listings, and transactions state */
  const [userListings, setUserListings] = useState<UserListings[]>([]);
  const [showListings, setShowListings] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userTransactions, setUserTransactions] = useState<
    UserTransactions[] | null
  >(null);
  const [showSoldProducts, setShowSoldProducts] = useState(false);

  /* rate buyer form state */
  const [showRate, setShowRate] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<UserListings | null>(null);

  // const handleProfileUpdate = (updatedData: Partial<UserData>) => {
  //   setUserData((prevData) => ({
  //     ...prevData,
  //     ...updatedData,
  //   }));
  // };

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

  // const handlePaymentSuccess = (amount: number) => {
  //   setUserData((prevData) => ({
  //     ...prevData,
  //     balance: prevData.balance + amount,
  //   }));
  //   console.log("added funds:", amount);
  // };

  // if (!isAuthenticated) {
  //   return (
  //     <div className="mt-10 text-center">
  //       <h1 className="text-2xl font-bold">Access Denied</h1>
  //       <p>Please log in to view your profile.</p>
  //     </div>
  //   );
  // }

  async function fetchUserData(): Promise<void> {
    const res = await fetch("http://localhost:3000/api/users/104");
    if (!res.ok) {
      throw new Error(`No data returned for user. HTTP Status: ${res.status}`);
    }

    const user = await res.json();

    setUserData(user);
  }

  async function fetchListingData(): Promise<void> {
    const res = await fetch("http://localhost:3000/api/listings/104");

    if (!res.ok) {
      throw new Error(
        `No listings returned for user. HTTP Status: ${res.status}`,
      );
    }

    const listings = await res.json();

    setUserListings(listings);
  }

  async function fetchTransactionData(): Promise<void> {
    const res = await fetch(
      "http://localhost:3000/api/transactions/seller/104",
    );

    if (!res.ok) {
      throw new Error(
        `No transactions returned for user. HTTP Status: ${res.status}`,
      );
    }

    const transactions = await res.json();
    console.log(transactions);
    setUserTransactions(transactions);
  }

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        await fetchUserData();
        await fetchListingData();
        fetchTransactionData();
      } catch (e) {
        if (e instanceof Error) {
          console.error(`error: ${e.message}`);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <div className="mx-auto max-w-3xl p-4 font-imprima">
      <h1 className="mb-4 text-3xl font-bold">Welcome, {userData?.username}</h1>

      {/* User Information Card */}
      <div className="mb-6 flex items-center gap-4 rounded-lg px-8 py-4 shadow-md">
        <img
          src="https://static.wikia.nocookie.net/among-us-wiki/images/8/84/Among_Us.png/revision/latest?cb=20240408020746"
          alt="User Avatar"
          className="h-36 w-36 rounded-full object-cover"
        />
        <div>
          <div className="px-4">
            <h2 className="text-2xl font-bold">{userData?.username}</h2>
            <p className="text-xl text-gray-600">{userData?.email}</p>
            <span
              className={`mt-2 inline-block rounded-full px-3 py-1 text-white ${
                userData?.vip ? "bg-[#246fb6]" : "bg-gray-400"
              }`}
            >
              {userData?.vip ? "VIP Member 🏆" : "Regular User"}
            </span>
          </div>
          <div className="mt-4 flex gap-12 px-4">
            <div>
              <p className="text-sm font-semibold">Balance</p>
              <p className="text-xl font-bold">
                ${userData?.balance.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold">Rating</p>
              <p className="text-xl font-bold">{userData?.average_rating}</p>
            </div>
            {/* <div>
              <p className="text-sm font-semibold">Reviews</p>
              <p className="text-xl font-bold">{userData.ratings.count}</p>
            </div> */}
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
        {userListings
          .filter((item) => item.status == "active")
          .map((item) => (
            <div
              key={item.item_id}
              className="relative mb-4 flex items-center gap-4 rounded-lg p-4 shadow-md"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-32 w-32 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="mb-2 text-lg text-gray-700">
                  Price: ${item.price}
                </p>
                <hr className="my-2" />
                <div className="flex gap-2">
                  <button className="rounded-full px-6 py-1 font-semibold text-[#246fb6] transition duration-200 ease-in-out hover:bg-slate-200">
                    View
                  </button>
                  <button className="rounded-full px-4 py-1 font-semibold text-red-800 transition duration-200 ease-in-out hover:bg-slate-200">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Sold Items Section */}
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={() => {
            setShowSoldProducts(!showSoldProducts);
          }}
          className="flex w-full items-center justify-between rounded-lg px-4 py-3"
        >
          <span className="text-2xl font-bold">View Your Sold Products</span>
          <span className="text-xl">{showSoldProducts ? "▲" : "▼"}</span>
        </button>
      </div>
      <hr className="mb-4" />

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showSoldProducts ? "max-h-fit opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {userListings
          .filter((item) => item.status == "sold")
          .map((item) => (
            <div
              key={item.item_id}
              className="relative mb-4 flex items-center gap-4 rounded-lg p-4 shadow-md"
            >
              <span className="absolute right-4 top-2 rounded-full px-3 py-1 font-semibold">
                SOLD
              </span>
              <img
                src={item.image}
                alt={item.title}
                className="h-32 w-32 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="mb-2 text-lg text-gray-700">
                  Price: ${item.price}
                </p>
                <hr className="my-2" />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <button className="rounded-full px-6 py-1 font-semibold text-[#246fb6] transition duration-200 ease-in-out hover:bg-slate-200">
                      View
                    </button>
                    <button className="rounded-full px-4 py-1 font-semibold text-red-800 transition duration-200 ease-in-out hover:bg-slate-200">
                      Remove
                    </button>
                  </div>
                  <button
                    className="rounded-full px-4 py-1 font-semibold transition duration-200 ease-in-out hover:bg-slate-200"
                    onClick={() => {
                      setShowRate(true);
                      setSelectedItem(item);
                    }}
                  >
                    Rate
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
      {showRate && selectedItem && userTransactions && (
        <Rating
          buyerID={
            userTransactions
              .filter(
                (transaction) => transaction.item_id == selectedItem.item_id,
              )
              .find((transaction) => transaction.buyer_id)?.buyer_id
          }
          img={selectedItem.image}
          toggleRateForm={setShowRate}
        />
      )}

      {/* Edit Profile Window
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
      /> */}

      {/* Logout Button
      <button
        className="mt-6 rounded-full bg-red-800 px-4 py-2 font-semibold text-white hover:opacity-70"
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Log Out
      </button> */}
    </div>
  );
}
