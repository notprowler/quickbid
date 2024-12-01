import React, { useState } from "react";
import cutedog from "../assets/cutedog.jpg";
import { FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  transactionType: "sell" | "bid";
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Product 1",
    price: 29.99,
    description: "A great product!",
    image: cutedog,
    category: "Clothes",
    transactionType: "sell",
  },
  {
    id: 2,
    name: "Product 2",
    price: 19.99,
    description: "Another amazing product!",
    image: cutedog,
    category: "Electronics",
    transactionType: "bid",
  },
  {
    id: 3,
    name: "Product 3",
    price: 49.99,
    description: "Premium quality product.",
    image: cutedog,
    category: "Furniture",
    transactionType: "sell",
  },
  {
    id: 4,
    name: "Product 4",
    price: 39.99,
    description: "Highly recommended by customers.",
    image: cutedog,
    category: "Vehicles",
    transactionType: "bid",
  },
  {
    id: 4,
    name: "Product 4",
    price: 39.99,
    description: "Highly recommended by customers.",
    image: cutedog,
    category: "Vehicles",
    transactionType: "bid",
  },
];

export default function Listings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  // navigate to corresponding product
  const navigate = useNavigate();

  // default filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // applied filter states
  const [appliedCategory, setAppliedCategory] = useState("All");
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);

  const handleSearchClick = () => {
    setQuery(searchTerm);
  };

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  const applyFilters = () => {
    setShowModal(false);
    setAppliedCategory(selectedCategory);
    setAppliedMinPrice(minPrice ? parseFloat(minPrice) : null);
    setAppliedMaxPrice(maxPrice ? parseFloat(maxPrice) : null);
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

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesCategory =
      appliedCategory === "All" || product.category === appliedCategory;
    const matchesPrice =
      (!appliedMinPrice || product.price >= appliedMinPrice) &&
      (!appliedMaxPrice || product.price <= appliedMaxPrice);
    return matchesSearch && matchesCategory && matchesPrice;
  });

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
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="cursor-pointer rounded-lg border px-4 py-4 shadow transition-shadow hover:shadow-lg"
            onClick={() => navigate(`/item/${product.id}`)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="mb-2 h-64 w-full rounded object-cover"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-700">${product.price.toFixed(2)}</p>
            <span className="text-sm font-medium text-gray-600">
              {product.transactionType === "sell" ? "For Sale" : "Auction"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
