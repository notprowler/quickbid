import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getListings } from "../api/listingsApi"; // Import API function
import cutedog from "../assets/cutedog.jpg"; // Placeholder for items without images

interface Item {
  item_id: number;
  title: string;
  price: number;
  type: "sell" | "bid";
  description: string;
  status: "active" | "sold" | "pending";
  owner_id: string; // User ID
  created_at: string;
}

const CartPage: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [timers, setTimers] = useState<{ [id: number]: string }>({});
  const navigate = useNavigate();

  // Fetch listings from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getListings();
        setItems(data);
      } catch (error) {
        console.error("Failed to load listings:", error);
      }
    };

    fetchData();
  }, []);

  // Timer logic for auction items
  useEffect(() => {
    const updateTimers = () => {
      const now = Date.now();
      const newTimers: { [id: number]: string } = {};

      items.forEach((item) => {
        if (item.type === "bid" && item.status === "active") {
          const bidEndTime = new Date(item.created_at).getTime() + 3600 * 1000; // Assume 1-hour auctions
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

  return (
    <div className="mx-auto max-w-7xl p-4">
      <h1 className="mb-6 text-3xl font-bold underline">Active Bids</h1>
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <div
              key={item.item_id}
              className="relative flex cursor-pointer items-center gap-4 rounded-lg p-4 shadow-md transition duration-300 ease-in-out hover:-translate-y-2"
              onClick={() => navigate(`/item/${item.item_id}`)}
            >
              <img
                src={cutedog} // Replace with actual image logic
                alt={item.title}
                className="h-32 w-32 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="text-lg text-gray-800">Price: ${item.price}</p>
                <p className="text-sm font-semibold text-red-600">
                  {item.type === "bid" && timers[item.item_id]
                    ? `Time Left: ${timers[item.item_id]}`
                    : "Fixed Price"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
