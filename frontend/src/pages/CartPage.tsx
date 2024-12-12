import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Rating from "../components/Rate";
import cutedog from "../assets/cutedog.jpg";
import axios from "axios";

interface Item {
  item_id: number;
  title: string;
  price: number;
  userHighestBid?: number;
  currentHighestBid?: number;
  imageUrl: string;
  bidEndTime?: string;
  transactionType: "sell" | "bid";
  al?: boolean;
  status: string;
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

interface UserListings {
  type: string;
  image: string;
  price: number;
  title: string;
  status: string;
  item_id: number;
  category: string | null;
  owner_id: number;
  created_at: Date;
  description: string;
}

const CartPage: React.FC = () => {
  /* actively purchasing dummy data */
  const [items, setItems] = useState<Item[]>([
    {
      item_id: 1,
      title: "Item 1",
      price: 10,
      userHighestBid: 50,
      currentHighestBid: 60,
      imageUrl: cutedog,
      bidEndTime: new Date(Date.now() + 3600 * 1000).toISOString(),
      transactionType: "bid",
      status: "active",
    },
    {
      item_id: 2,
      title: "Item 2",
      price: 20,
      userHighestBid: 70,
      currentHighestBid: 80,
      imageUrl: cutedog,
      bidEndTime: new Date(Date.now() + 7200 * 1000).toISOString(),
      transactionType: "bid",
      status: "active",
    },
    {
      item_id: 3,
      title: "Item 3",
      price: 30,
      imageUrl: cutedog,
      transactionType: "sell",
      status: "active",
    },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [timers, setTimers] = useState<{ [id: number]: string }>({});
  const [boughtItems, setBoughtItems] = useState<UserTransactions[]>([]);
  const [showBoughtItems, setShowBoughtItems] = useState<boolean>(false);
  const [showRate, setShowRate] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<UserTransactions>();
  const [refreshData, setRefreshData] = useState<number>(0); // State to track refresh

  const navigate = useNavigate();

  // Timer logic for auction items
  useEffect(() => {
    const updateTimers = () => {
      const now = Date.now();
      const newTimers: { [id: number]: string } = {};

      items.forEach((item) => {
        if (item.transactionType === "bid" && item.status === "active") {
          const bidEndTime = new Date(now).getTime() + 3600 * 1000; // Assume 1-hour auctions
          const timeLeft = bidEndTime - now;

          if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor(
              (timeLeft % (1000 * 60 * 60)) / (1000 * 60),
            );
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            newTimers[item.item_id] = `${hours}h ${minutes}m ${seconds}s`;
          } else {
            newTimers[item.item_id] = "Expired";
          }
        }
      });

      setTimers(newTimers);
    };

    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [items]);

  useEffect(() => {
    const fetchBoughtItems = async (): Promise<void> => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/transactions/buyer/user",
          {
            withCredentials: true,
          },
        );

        if (!res.data) {
          throw new Error("No data returned from the API.");
        }

        console.log("Fetched Bought Items:", res.data);
        setBoughtItems(res.data);
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

    fetchBoughtItems();
  }, [refreshData]);

  const handleRatingCompleted = () => {
    setRefreshData((prev) => prev + 1);
  };

  const handleRemoveItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.item_id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price, 0); // Simplified subtotal calculation

  const purchasedItems = boughtItems.filter(
    (item) =>
      item.listings?.status === "sold" || item.listings?.status === "pending",
  );

  if (error) {
    return (
      <div className="mt-10 text-center">
        <h1 className="text-2xl font-bold">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-7xl p-4">
      <h1 className="mb-6 text-3xl font-bold underline">Actively Purchasing</h1>

      {/* Main Content: Cart Items and Summary */}
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div
              key={item.item_id}
              className="relative flex cursor-pointer items-center gap-4 rounded-lg p-4 shadow-md transition duration-300 ease-in-out hover:-translate-y-2"
              onClick={() => navigate(`/item/${item.item_id}`)}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-32 w-32 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="ml-3">
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="text-lg text-gray-800">
                    {item.transactionType === "sell"
                      ? `Price: $${item.price}`
                      : `Your Highest Bid: $${item.userHighestBid}`}
                  </p>
                  {item.transactionType === "bid" && (
                    <>
                      <p className="text-sm text-gray-800">
                        Current Highest Bid: ${item.currentHighestBid}
                      </p>
                      <p className="text-sm font-semibold text-red-600">
                        Time Left: {timers[item.item_id] || "Calculating..."}
                      </p>
                    </>
                  )}
                </div>
                <hr className="my-2" />
                <div className="flex gap-4">
                  {item.transactionType === "bid" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(item.item_id);
                      }}
                      className="rounded-full px-3 py-1 text-red-800 transition duration-200 ease-in-out hover:bg-slate-200"
                    >
                      Remove Bid
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Section */}
        <div className="w-full md:w-1/3">
          <div className="rounded-lg bg-white p-4 shadow-md">
            <h2 className="mb-4 text-xl font-bold">Active Summary</h2>
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>VIP Discount (15%):</span>
              <span>- ${(subtotal * 0.15).toFixed(2)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${(subtotal * 0.85).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bought Items Dropdown */}
      <div className="mt-6">
        <button
          onClick={() => setShowBoughtItems(!showBoughtItems)}
          className="flex w-full items-center justify-between rounded-lg px-4 py-3"
        >
          <span className="text-2xl font-bold">
            View Previously Bought Items
          </span>
          <span className="text-xl">{showBoughtItems ? "▲" : "▼"}</span>
        </button>
        <hr className="mb-4" />

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showBoughtItems ? "max-h-fit opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {purchasedItems.map((item) => (
            <div
              key={item.transaction_id}
              className="relative mb-4 flex items-center gap-4 rounded-lg p-4 shadow-md"
            >
              <span
                className={`absolute right-4 top-2 rounded-full px-3 py-1 font-semibold ${
                  item.listings?.status === "sold"
                    ? "bg-red-500 text-white"
                    : "bg-yellow-500 text-black"
                }`}
              >
                {item.listings?.status.toUpperCase()}
              </span>
              <img
                src={item.listings?.image || "placeholder.jpg"}
                alt={item.listings?.title || "No Title"}
                className="h-32 w-32 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold">
                  {item.listings?.title || "No Title"}
                </h3>
                <p className="mb-2 text-lg text-gray-700">
                  Price: ${item.transaction_amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  Date Purchased:{" "}
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
                <hr className="my-2" />
                <div className="flex gap-2">
                  <button
                    className="rounded-full px-6 py-1 font-semibold text-[#246fb6] transition duration-200 ease-in-out hover:bg-slate-200"
                    onClick={() => navigate(`/item/${item.item_id}`)}
                  >
                    View
                  </button>
                  {!item.rated && item.listings?.status !== "pending" && (
                    <button
                      className="rounded-full px-4 py-1 font-semibold text-[#246fb6] transition duration-200 ease-in-out hover:bg-slate-200"
                      onClick={() => {
                        setShowRate(true);
                        setSelectedItem(item);
                      }}
                    >
                      Rate Purchase
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showRate && selectedItem && (
        <Rating
          sellerID={selectedItem?.listings.owner_id}
          transactionID={selectedItem?.transaction_id}
          img={selectedItem?.listings.image}
          toggleRateForm={setShowRate}
          onRatingCompleted={handleRatingCompleted} // Pass callback
        />
      )}
    </div>
  );
};

export default CartPage;
