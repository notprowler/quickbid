import { useState } from "react";
import { useParams } from "react-router-dom";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import cutedog from "../assets/cutedog.jpg";

// -------------------- Product Interface --------------------
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  transactionType: "sell" | "bid";
}

// -------------------- Review Interface --------------------
interface Review {
  id: number;
  title: string;
  review: string;
  reviewer: string;
  date: Date;
  rating: number;
}

// -------------------- Mock Data --------------------
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
];

const reviews: Review[] = [
  {
    id: 1,
    title: "Best product!",
    review: "This item is fantastic and exceeded my expectations.",
    reviewer: "Lebronny James",
    date: new Date(2024, 4, 23),
    rating: 5,
  },
  {
    id: 2,
    title: "Very cheap",
    review: "Definitely worth the price",
    reviewer: "Johnny Boy",
    date: new Date(2021, 8, 21),
    rating: 4,
  },
  {
    id: 3,
    title: "Worst product",
    review: "The product wasn't even the same.",
    reviewer: "Dwanyne Jocky",
    date: new Date(2016, 1, 16),
    rating: 1,
  },
];

// -------------------- ProductSell Component --------------------
export function ProductSell({ productDetails }: { productDetails: Product }) {
  const [favorite, setFavorite] = useState(false);

  const handleFavorite = () => setFavorite(!favorite);

  const handlePurchase = () => {
    alert(
      `You have purchased ${productDetails.name} for $${productDetails.price}!`,
    );
  };

  return (
    <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-10 p-6 lg:grid-cols-2">
      <div className="flex items-center justify-center">
        <div className="relative aspect-square w-full rounded-lg bg-gray-200">
          <img
            src={productDetails.image}
            alt={productDetails.name}
            className="h-full w-full rounded-lg object-cover"
          />
          <div className="absolute left-4 top-4 rounded-full bg-white p-2 shadow-md">
            <span
              onClick={handleFavorite}
              className="cursor-pointer text-xl text-gray-800"
            >
              {favorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">{productDetails.name}</h1>
        <div className="text-4xl font-bold text-gray-800">
          ${productDetails.price}
        </div>
        <button
          onClick={handlePurchase}
          className="duration:200 rounded-lg bg-[#3A5B22] px-4 py-2 text-white transition ease-in-out hover:bg-[#2F4A1A]"
        >
          Buy Now
        </button>
        <details className="rounded-lg border border-gray-300 p-4">
          <summary className="cursor-pointer font-semibold">
            Description
          </summary>
          <p className="mt-2 text-gray-600">{productDetails.description}</p>
        </details>
      </div>
    </div>
  );
}

// -------------------- ProductBid Component --------------------
export function ProductBid({ productDetails }: { productDetails: Product }) {
  const [favorite, setFavorite] = useState(false);
  const [currentBid, setCurrentBid] = useState(50); // Example starting bid
  const [newBid, setNewBid] = useState("");

  const handleBid = () => {
    const bidValue = parseFloat(newBid);
    if (bidValue > currentBid) {
      setCurrentBid(bidValue);
      alert(`Your bid of $${bidValue} has been placed!`);
      setNewBid("");
    } else {
      alert("Your bid must be higher than the current bid.");
    }
  };

  const handleFavorite = () => setFavorite(!favorite);

  return (
    <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-10 p-6 lg:grid-cols-2">
      <div className="flex items-center justify-center">
        <div className="relative aspect-square w-full rounded-lg bg-gray-200">
          <img
            src={productDetails.image}
            alt={productDetails.name}
            className="h-full w-full rounded-lg object-cover"
          />
          <div className="absolute left-4 top-4 rounded-full bg-white p-2 shadow-md">
            <span
              onClick={handleFavorite}
              className="cursor-pointer text-xl text-gray-800"
            >
              {favorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">{productDetails.name}</h1>
        <div className="text-4xl font-bold text-gray-800">
          Current Bid: ${currentBid}
        </div>
        <div className="flex space-x-4">
          <input
            type="number"
            placeholder="Enter your bid"
            value={newBid}
            onChange={(e) => setNewBid(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 p-2"
          />
          <button
            onClick={handleBid}
            className="duration:200 rounded-lg bg-[#3A5B22] px-4 py-2 text-white transition ease-in-out hover:bg-[#2F4A1A]"
          >
            Place Bid
          </button>
        </div>
        <details className="rounded-lg border border-gray-300 p-4">
          <summary className="cursor-pointer font-semibold">
            Description
          </summary>
          <p className="mt-2 text-gray-600">{productDetails.description}</p>
        </details>
      </div>
    </div>
  );
}

// -------------------- ReviewBox Component --------------------
export function ReviewBox({ review }: { review: Review }) {
  return (
    <div className="flex h-[200px] w-full flex-col justify-between rounded-lg border bg-white p-5 shadow-sm sm:h-[250px] md:h-[300px]">
      <h3 className="text-lg font-semibold text-gray-700">{review.reviewer}</h3>
      <p className="text-md flex-grow overflow-hidden pt-5 text-gray-600">
        {review.review}
      </p>
      <span className="font-medium text-gray-700">
        Rating:{" "}
        {Array.from({ length: review.rating }, (_, i) => (
          <span key={i}>⭐</span>
        ))}
      </span>
    </div>
  );
}

// -------------------- ProductPage Component --------------------
export default function ProductPage() {
  const { itemID } = useParams<{ itemID: string }>();

  // Find the product based on itemID
  const productDetails = mockProducts.find(
    (product) => product.id === Number(itemID),
  );

  if (!productDetails) {
    return (
      <div className="p-10 text-center text-gray-700">Product not found.</div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4">
      {productDetails.transactionType === "sell" ? (
        <ProductSell productDetails={productDetails} />
      ) : (
        <ProductBid productDetails={productDetails} />
      )}
      <div className="pt-10">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Latest Reviews</h2>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ReviewBox key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}
