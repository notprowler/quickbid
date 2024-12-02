import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cutedog from "../assets/cutedog.jpg";

interface Item {
  id: number;
  title: string;
  price: number;
  userHighestBid?: number;
  currentHighestBid?: number;
  imageUrl: string;
  bidEndTime?: string;
  transactionType: "sell" | "bid";
  awaitingApproval?: boolean;
}

interface BoughtItem {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  datePurchased: string;
  transactionType: "sell" | "bid";
}

const CartPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    {
      id: 1,
      title: "Item 1",
      price: 10,
      userHighestBid: 50,
      currentHighestBid: 60,
      imageUrl: cutedog,
      bidEndTime: new Date(Date.now() + 3600 * 1000).toISOString(),
      transactionType: "bid",
      awaitingApproval: true,
    },
    {
      id: 2,
      title: "Item 2",
      price: 20,
      userHighestBid: 70,
      currentHighestBid: 80,
      imageUrl: cutedog,
      bidEndTime: new Date(Date.now() + 7200 * 1000).toISOString(),
      transactionType: "bid",
    },
    {
      id: 3,
      title: "Item 3",
      price: 30,
      imageUrl: cutedog,
      transactionType: "sell",
      awaitingApproval: true,
    },
  ]);

  const [boughtItems, setBoughtItems] = useState<BoughtItem[]>([
    {
      id: 101,
      title: "Item A",
      price: 50,
      imageUrl: cutedog,
      datePurchased: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      transactionType: "sell",
    },
    {
      id: 102,
      title: "Item B",
      price: 80,
      imageUrl: cutedog,
      datePurchased: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
      transactionType: "bid",
    },
  ]);

  const [timers, setTimers] = useState<{ [id: number]: string }>({});
  const [showBoughtItems, setShowBoughtItems] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateTimers = () => {
      const now = Date.now();
      const newTimers: { [id: number]: string } = {};

      items.forEach((item) => {
        const timeLeft = new Date(item.bidEndTime).getTime() - now;
        if (timeLeft > 0) {
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor(
            (timeLeft % (1000 * 60 * 60)) / (1000 * 60),
          );
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          newTimers[item.id] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          newTimers[item.id] = "Expired";
        }
      });

      setTimers(newTimers);
    };

    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [items]);

  const handleRemoveItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price, 0); // Simplified subtotal calculation

  return (
    <div className="mx-auto max-w-7xl p-4">
      <h1 className="mb-6 text-3xl font-bold underline">Actively Purchasing</h1>

      {/* Main Content: Cart Items and Summary */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative flex cursor-pointer items-center gap-4 rounded-lg p-4 shadow-md transition duration-300 ease-in-out hover:-translate-y-2"
              onClick={() => navigate(`/item/${item.id}`)}
            >
              {/* LOSING or Awaiting Approval tag */}
              {item.transactionType === "bid" &&
                (item.userHighestBid ?? 0) < (item.currentHighestBid ?? 0) &&
                !item.awaitingApproval && (
                  <span className="absolute right-2 top-2 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                    LOSING
                  </span>
                )}
              {item.awaitingApproval && (
                <span className="absolute right-2 top-2 rounded-full bg-yellow-500 px-3 py-1 text-sm font-bold text-white">
                  Awaiting Approval
                </span>
              )}
              {/* Item Image */}
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
                        Time Left: {timers[item.id] || "Calculating..."}
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
                        handleRemoveItem(item.id);
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
          {boughtItems.map((item) => (
            <div
              key={item.id}
              className="relative mb-4 flex items-center gap-4 rounded-lg p-4 shadow-md"
              onClick={() => navigate(`/item/${item.id}`)} // Redirect to product page
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-32 w-32 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="mb-2 text-lg text-gray-700">
                  Price: ${item.price}
                </p>
                <p className="text-sm text-gray-500">
                  Date Purchased:{" "}
                  {new Date(item.datePurchased).toLocaleDateString()}
                </p>
                <hr className="my-2" />
                <button className="rounded-full px-4 py-1 font-semibold text-[#246fb6] transition duration-200 ease-in-out hover:bg-slate-200">
                  View Item
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
