import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getListings } from "../api/listingsApi";

import { FaFilter } from "react-icons/fa";

interface Listing {
  item_id: number;
  title: string;
  description: string;
  price: number;
  type: "sell" | "bid";
  category: string;
  image: string;
}

export default function Listings() {
  // states for loading listings from backend
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // states for search bar
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");

  // states for filter function
  const [showModal, setShowModal] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [appliedCategory, setAppliedCategory] = useState("All");
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);

  // navigate to corresponding product
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  });

  const handleSearchClick = () => {
    setQuery(searchTerm);
  };

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  const applyFilters = async () => {
    setShowModal(false);

    setAppliedCategory(selectedCategory);
    setAppliedMinPrice(minPrice ? Number(minPrice) : null);
    setAppliedMaxPrice(maxPrice ? Number(maxPrice) : null);

    const filters: Record<string, string> = {};
    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    if (selectedCategory !== "All") filters.category = selectedCategory;

    const queryString = `?${new URLSearchParams(filters).toString()}`;

    try {
      const data = await getListings(queryString);
      setListings(data);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setQuery("");
    setSelectedCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setAppliedCategory("All");
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
  };

  const isFilterApplied =
    query !== "" ||
    appliedCategory !== "All" ||
    appliedMinPrice !== null ||
    appliedMaxPrice !== null;

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesCategory =
      appliedCategory === "All" || listing.category === appliedCategory;
    const matchesPrice =
      (!appliedMinPrice || listing.price >= appliedMinPrice) &&
      (!appliedMaxPrice || listing.price <= appliedMaxPrice);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  if (loading) return <div>Loading listings...</div>;

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="mb-6 flex justify-center space-x-2">
        <div className="flex w-3/4 max-w-2xl items-center space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-md border border-gray-300 bg-gray-200 p-2 pr-10 focus:outline-none focus:ring-1 focus:ring-[#3A5B22]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaFilter
              className="absolute right-2 top-2 cursor-pointer text-gray-500 hover:text-gray-700"
              size={20}
              onClick={toggleModal}
            />
          </div>

          <button
            className="duration:200 rounded-md bg-[#3A5B22] px-4 py-2 text-white transition ease-in-out hover:bg-[#2F4A1A]"
            onClick={handleSearchClick}
          >
            Search
          </button>
        </div>
        {isFilterApplied && (
          <button
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-500 hover:underline"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Filters Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Filters</h2>

            {/* Filter by Category */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Categories
              </label>
              <select
                className="w-full rounded-md border border-gray-300 p-2"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Clothes">Clothes</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Toys">Toys</option>
                <option value="Home Goods">Home Goods</option>
                <option value="Garden & Outdoor">Garden & Outdoor</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Office Supplies">Office Supplies</option>
              </select>
            </div>

            {/* Filter by Price Range */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Price Range
              </label>
              <div className="flex space-x-4">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Apply and Close Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                className="duration:200 rounded-md bg-gray-300 px-4 py-2 transition ease-in-out hover:bg-gray-400"
                onClick={toggleModal}
              >
                Close
              </button>
              <button
                className="duration:200 rounded-md bg-[#3A5B22] px-4 py-2 text-white transition ease-in-out hover:bg-[#2F4A1A]"
                onClick={applyFilters}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {filteredListings.map((listing) => (
          <div
            key={listing.item_id}
            className="cursor-pointer rounded-lg border px-4 py-4 shadow transition-shadow hover:shadow-lg"
            onClick={() => navigate(`/item/${listing.item_id}`)}
          >
            <img
              src={listing.image}
              alt={listing.title}
              className="mb-2 h-64 w-full rounded object-cover"
            />
            <h3 className="text-lg font-semibold">{listing.title}</h3>
            <p className="text-gray-700">
              ${Number(listing.price || 0).toFixed(2)}
            </p>
            <span className="text-sm font-medium text-gray-600">
              {listing.type === "sell" ? "For Sale" : "Auction"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
