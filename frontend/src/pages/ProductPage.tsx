import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// -------------------- Product Interface --------------------
interface Product {
  item_id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  status: string;
  created_at: string;
  type: "sell" | "bid";
  owner_id: number;
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

// -------------------- Reviews (Mock for Now) --------------------
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
export function ProductSell({
  productDetails,
}: {
  productDetails: Product | undefined;
}) {
  const navigate = useNavigate();

  const handlePurchase = async () => {
    try {
      if (!productDetails) return;

      const transactionPayload = {
        seller_id: productDetails.owner_id, // Seller ID
        item_id: productDetails.item_id, // Item ID
        transaction_amount: productDetails.price, // Transaction Amount
      };

      const response = await axios.post(
        "http://localhost:3000/api/transactions/buy",
        transactionPayload,
        { withCredentials: true },
      );

      if (response.status === 201) {
        alert("Purchase successful!");
      } else {
        alert("Purchase failed.");
      }
    } catch (e: any) {
      if (e.response) {
        console.error("API Error:", e.response.data.error);
        alert("Please be a active user to purchase this product");
      } else if (e.request) {
        console.error("No response from server:", e.request);
      }
    }
  };

  return (
    <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-10 p-6 lg:grid-cols-2">
      <div className="flex items-center justify-center">
        <div className="relative aspect-square w-full rounded-lg bg-gray-200">
          <img
            src={productDetails?.image || "/placeholder-image.jpg"} // Placeholder if no image
            alt={productDetails?.title}
            className="h-full w-full rounded-lg object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">{productDetails?.title}</h1>
        <div className="text-4xl font-bold text-gray-800">
          ${productDetails?.price}
        </div>
        {productDetails?.status != "active" ? (
          <button
            disabled={true}
            className="duration:200 rounded-lg bg-rose-800 px-4 py-2 text-white transition ease-in-out hover:bg-rose-700"
          >
            Sold
          </button>
        ) : (
          <button
            onClick={handlePurchase}
            className="duration:200 rounded-lg bg-[#3A5B22] px-4 py-2 text-white transition ease-in-out hover:bg-[#2F4A1A]"
          >
            Buy Now
          </button>
        )}
        <details className="rounded-lg border border-gray-300 p-4">
          <summary className="cursor-pointer font-semibold">
            Description
          </summary>
          <p className="mt-2 text-gray-600">{productDetails?.description}</p>
        </details>
      </div>
    </div>
  );
}

// -------------------- ProductBid Component --------------------
export function ProductBid({ productDetails }: { productDetails: Product }) {
  const [currentBid, setCurrentBid] = useState(productDetails.price);
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

  return (
    <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-10 p-6 lg:grid-cols-2">
      <div className="flex items-center justify-center">
        <div className="relative aspect-square w-full rounded-lg bg-gray-200">
          <img
            src={productDetails.image || "/placeholder-image.jpg"}
            alt={productDetails.title}
            className="h-full w-full rounded-lg object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">{productDetails.title}</h1>
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
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const res = await axios.get(
            `http://localhost:3000/api/listings/product/${id}`,
            {
              withCredentials: true,
            },
          );

          if (!res.data) {
            throw new Error();
          }
          console.log("Product Page", res.data);

          setProductDetails(res.data);
        }
      } catch (err) {
        setError("Failed to load product details");
      }
    };
    fetchProduct();
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!productDetails) return <div>Loading product details...</div>;

  return (
    <div className="min-h-screen bg-white p-4">
      {productDetails?.type === "sell" ? (
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
