import { useState, useEffect } from "react";
import AddFunds from "../components/AddFunds";
import Rating from "../components/Rate";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface UserData {
  user_id: number;
  username: string;
  email: string;
  vip: boolean;
  balance: number;
  average_rating: number;
  termination_request: boolean;
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
  rated: boolean;
}

export default function ProfilePage() {
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [userListings, setUserListings] = useState<UserListings[]>([]);
  const [showListings, setShowListings] = useState(false);
  const [userTransactions, setUserTransactions] = useState<
    UserTransactions[] | null
  >(null);
  const [showSoldProducts, setShowSoldProducts] = useState(false);

  
  const [_buyerTransactions, setBuyerTransactions] = useState<
    UserTransactions[] | null
  >(null);

  const [showRate, setShowRate] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<UserTransactions | null>(
    null,
  );
  const [refreshData, setRefreshData] = useState<number>(0); // State to track refresh

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);

  const [isTerminationModalOpen, setIsTerminationModalOpen] = useState(false);
  const [showGoodbyeMessage, setShowGoodbyeMessage] = useState(false);

  const handleOpenAddFunds = async (amount: number) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/payments/create-payment-intent",
        { amount: amount * 100 },
        { withCredentials: true },
      );

      setClientSecret(response.data.clientSecret);
      setIsAddFundsOpen(true);
    } catch (error) {
      console.error("Failed to create payment intent: ", error);
    }
  };

  const handlePaymentSuccess = (amount: number) => {
    setUserData((prevData) =>
      prevData ? { ...prevData, balance: prevData.balance + amount } : null,
    );
  };

  async function fetchUserData(): Promise<void> {
    try {
      console.log("Fetching user data...");
      const res = await axios.get("http://localhost:3000/api/users/profile", {
        withCredentials: true,
      });

      if (!res.data) {
        throw new Error(`No user data returned. HTTP Status: ${res.status}`);
      }

      setUserData({
        user_id: res.data.user_id || 0,
        username: res.data.username || "Guest",
        email: res.data.email || "No Email",
        vip: res.data.vip || false,
        balance: res.data.balance || 0,
        average_rating: res.data.average_rating || 0,
        termination_request: res.data.termination_request || false,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }

  async function fetchListingData(): Promise<void> {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/listings/profile/user",
        { withCredentials: true },
      );

      if (!res.data) {
        throw new Error(
          `No listings returned for user. HTTP Status: ${res.status}`,
        );
      }
      setUserListings(res.data);
    } catch (error) {
      console.error("Error fetching listings data:", error);
      setError("Failed to fetch listings data");
    }
  }

  async function fetchTransactionData(): Promise<void> {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/transactions/profile/user",
        { withCredentials: true },
      );

      if (!res.data) {
        throw new Error(
          `No transactions returned for user. HTTP Status: ${res.status}`,
        );
      }

      setUserTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transaction data:", error);
      setError("Failed to fetch transaction data");
    }
  }

  async function fetchBuyerTransactions(): Promise<void> {
    try {
      console.log("Fetching buyer transactions...");
      const res = await axios.get(
        "http://localhost:3000/api/transactions/buyer/user",
        { withCredentials: true },
      );

      if (!res.data) {
        throw new Error(`No transactions returned. HTTP Status: ${res.status}`);
      }

      setBuyerTransactions(res.data);
      console.log("Buyer transactions fetched successfully");
    } catch (error) {
      console.error("Error fetching buyer transactions:", error);
      throw error;
    }
  }

  async function handleApproveListing(itemId: number): Promise<void> {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/listings/${itemId}/approve`,
        {},
        { withCredentials: true },
      );

      if (response.status === 200) {
        alert("Listing approved successfully!");
        setRefreshData((prev) => prev + 1);
      } else {
        throw new Error(`Approval failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error approving listing:", error);
      alert("Failed to approve listing.");
    }
  }

  async function handleRejectListing(itemId: number): Promise<void> {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/listings/${itemId}/reject`,
        {},
        { withCredentials: true },
      );

      if (response.status === 200) {
        alert("Listing rejected successfully!");
        setRefreshData((prev) => prev + 1);
      } else {
        throw new Error(`Rejection failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error rejecting listing:", error);
      alert("Failed to reject listing.");
    }
  }

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        console.log("Starting data fetch...");
        await fetchUserData();
        console.log("User data fetched successfully");
        await fetchListingData();
        console.log("Listing data fetched successfully");
        await fetchTransactionData();
        console.log("Transaction data fetched successfully");
        await fetchBuyerTransactions();
        console.log("Buyer transactions fetched successfully");
      } catch (e: any) {
        if (e.response) {
          console.error("API Error:", e.response.data.error);
          setError(e.response.data.error || "Unexpected API error occurred.");
        } else if (e.request) {
          console.error("No response from server:", e.request);
          setError("Failed to connect to the server. Please try again later.");
        }
      }
    };

    fetchData();
  }, [refreshData]);

  const handleRatingCompleted = () => {
    setRefreshData((prev) => prev + 1); // Increment refreshData to trigger re-render
  };

  async function handleRemoveListing(
    discardProduct: UserListings,
  ): Promise<void> {
    try {
      await axios.delete(
        "http://localhost:3000/api/listings/removeProduct/${discardProduct.item_id}",
        { withCredentials: true },
      );
      setUserListings(
        userListings.filter((item) => item.item_id !== discardProduct.item_id),
      );
    } catch (e) {
      if (e instanceof Error) {
        setError("You caught us lacking");
      }
    }
  }

  async function handleTerminationRequest(): Promise<void> {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/users/termination/${userData?.user_id}`,
        {},
        { withCredentials: true },
      );

      if (!res.data) {
        throw error;
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(`${e.message}`);
      }
    }
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
        <h1 className="text-2xl font-bold">Fetching Your Data...</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-4 font-imprima">
      <h1 className="mb-4 text-3xl font-bold">Welcome, {userData.username}</h1>

      {/* User Information Card */}
      <div className="mb-6 flex items-center gap-4 rounded-lg px-6 py-4 shadow-md">
        <div className="flex h-36 w-36 items-center justify-center rounded-full bg-gray-200">
          <FaUser className="text-6xl text-gray-500" />
        </div>
        <div>
          <div className="px-4">
            <h2 className="text-2xl font-bold">{userData.username}</h2>
            <p className="text-xl text-gray-600">{userData.email}</p>
            <span
              className={`mt-2 inline-block rounded-full px-3 py-1 text-white ${
                userData.vip ? "bg-[#246fb6]" : "bg-gray-400"
              }`}
            >
              {userData.vip ? "VIP Member 🏆" : "Regular User"}
            </span>
          </div>
          <div className="mt-4 flex gap-12 px-4">
            <div>
              <p className="text-sm font-semibold">Balance</p>
              <p className="text-xl font-bold">
                ${userData.balance ? userData.balance.toFixed(2) : "0.00"}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold">Rating</p>
              <p className="text-xl font-bold">
                {userData?.average_rating.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="space-x-60">
            <button
              onClick={() => handleOpenAddFunds(50)}
              className="mt-4 rounded-full px-4 py-2 font-semibold text-[#246fb6] transition hover:bg-slate-200"
            >
              Add Funds
            </button>
            <button
              onClick={() => setIsTerminationModalOpen(true)}
              className="mt-4 rounded-full px-4 py-2 font-semibold text-red-500 transition hover:bg-slate-200"
            >
              Terminate Account
            </button>
          </div>
        </div>
      </div>

      <div className="mb-2">
        <button
          onClick={() => setShowListings(!showListings)}
          className="w-full px-4 py-2 text-left"
        >
          <span className="flex justify-between text-2xl font-bold">
            {showListings ? "Hide Listings" : "View Listings"}
            <span className="text-xl">{showListings ? "▲" : "▼"}</span>
          </span>
        </button>
      </div>

      <hr className="mb-4" />
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showListings ? "max-h-fit opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {userListings
          .filter(
            (item) => item.status === "active" || item.status === "pending",
          )
          .map((item) => (
            <div
              key={item.item_id}
              className="relative mb-4 flex items-center gap-4 rounded-lg p-4 shadow-md"
            >
              <span
                className={`absolute right-4 top-2 rounded-full px-3 py-1 font-semibold ${
                  item.status === "active"
                    ? "bg-blue-500 text-white"
                    : "bg-yellow-500 text-black"
                }`}
              >
                {item.status.toUpperCase()}
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

                <div className="flex gap-2">
                  <button
                    className="rounded-full px-6 py-1 font-semibold text-[#246fb6] transition duration-200 ease-in-out hover:bg-slate-200"
                    onClick={() => navigate(`/item/${item.item_id}`)}
                  >
                    View
                  </button>
                  <button
                    className="rounded-full px-4 py-1 font-semibold text-red-800 transition duration-200 ease-in-out hover:bg-slate-200"
                    onClick={() => handleRemoveListing(item)}
                  >
                    Remove
                  </button>
                  {item.status === "pending" && (
                    <div className="flex">
                      <button
                        className="rounded-full px-6 py-1 font-semibold text-green-800 transition duration-200 ease-in-out hover:bg-slate-200"
                        onClick={() => handleApproveListing(item.item_id)}
                      >
                        Approve
                      </button>
                      <button
                        className="rounded-full px-6 py-1 font-semibold text-red-800 transition duration-200 ease-in-out hover:bg-slate-200"
                        onClick={() => handleRejectListing(item.item_id)}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

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
        {userTransactions
          ?.filter((tx) => ["sold"].includes(tx.listings?.status))
          .map((tx) => (
            <div
              key={tx.transaction_id}
              className="relative mb-4 flex items-center gap-4 rounded-lg p-4 shadow-md"
            >
              <span
                className={`absolute right-4 top-2 rounded-full px-3 py-1 font-semibold ${
                  tx.listings.status === "sold"
                    ? "bg-red-500 text-white"
                    : "bg-yellow-500 text-black"
                }`}
              >
                {tx.listings.status.toUpperCase()}
              </span>
              <img
                src={tx.listings.image}
                alt={tx.listings.title}
                className="h-32 w-32 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{tx.listings.title}</h3>
                <p className="mb-2 text-lg text-gray-700">
                  Price: ${tx.listings.price}
                </p>
                <hr className="my-2" />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <button
                      className="rounded-full px-6 py-1 font-semibold text-[#246fb6] transition duration-200 ease-in-out hover:bg-slate-200"
                      onClick={() => navigate(`/item/${tx.item_id}`)}
                    >
                      View Item
                    </button>
                    {!tx.rated && (
                      <button
                        className="rounded-full px-4 py-1 font-semibold text-[#246fb6] transition duration-200 ease-in-out hover:bg-slate-200"
                        onClick={() => {
                          setShowRate(true);
                          setSelectedItem(tx);
                        }}
                      >
                        Rate Transaction
                      </button>
                    )}
                  </div>
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
                (transaction) => transaction.item_id === selectedItem.item_id,
              )
              .find((transaction) => transaction.buyer_id)?.buyer_id
          }
          transactionID={
            userTransactions
              .filter(
                (transaction) => transaction.item_id == selectedItem.item_id,
              )
              .find((transaction) => transaction.buyer_id)?.transaction_id
          }
          img={selectedItem.listings.image}
          toggleRateForm={setShowRate}
          onRatingCompleted={handleRatingCompleted} // Pass callback
        />
      )}

      {isTerminationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-center text-2xl font-bold">
              Confirm Account Termination
            </h2>
            <p className="mb-6 text-center text-gray-600">
              Are you sure you want to terminate your account? This action is
              irreversible.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setIsTerminationModalOpen(false)}
                className="rounded-full border border-gray-500 px-6 py-2 text-gray-500 transition hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleTerminationRequest();
                  setIsTerminationModalOpen(false);
                  setShowGoodbyeMessage(true);
                  setTimeout(() => setShowGoodbyeMessage(false), 3000);
                }}
                className="rounded-full bg-red-400 px-6 py-2 text-white transition hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showGoodbyeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800">
              We have submitted your request! We are sorry to see you leave
              us...
            </h2>
          </div>
        </div>
      )}

      <AddFunds
        isOpen={isAddFundsOpen}
        onClose={() => {
          setIsAddFundsOpen(false);
          setClientSecret(null);
        }}
        clientSecret={clientSecret}
        onPaymentSuccess={handlePaymentSuccess}
        onRequestPayment={handleOpenAddFunds}
      />
    </div>
  );
}
