import { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useParams } from 'react-router-dom';

interface ProductDetails {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
}

interface ProductPageProps {
    transactionType: "sell" | "bid";
    productDetails: ProductDetails;
    bidValue?: number;
}

interface ProductBidProps {
    productDetails: ProductDetails;
    bidValue?: number;
}

interface Review {
    id: number,
    title: string,
    review: string,
    reviewer: string,
    date: Date,
    rating: number
}

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

export function ProductSell({ productDetails }: { productDetails: ProductDetails }) {
    const [favorite, setFavorite] = useState<boolean>(false);

    function handlePurchase() {
        try {
        } catch (e) {
        }
    }

    function handleFavorite(productID: number) {
        setFavorite(!favorite);
        try {
        } catch (e) {
        }
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8 max-w-6xl mx-auto p-6">
            <div className="flex justify-center items-center">
                <div className="bg-gray-200 w-full aspect-square rounded-lg relative">
                    <img
                        src={productDetails.image}
                        alt={productDetails.name}
                        className="w-full h-full rounded-lg object-cover"
                    />
                    <div className="absolute top-4 left-4 p-2 rounded-full shadow-md bg-white">
                        <span
                            onClick={() => handleFavorite(productDetails.id)}
                            className=" text-xl cursor-pointer text-gray-800">
                            {favorite ? <FaHeart className="text-red-500" /> 
                            : <FaRegHeart />}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col space-y-4">
                <h1 className="text-2xl font-bold">{productDetails.name}</h1>
                <span className="bg-green-200 text-green-800 text-xs font-medium px-2 py-1 rounded-full w-fit">
                    {productDetails.id}
                </span>
                <div className="text-4xl font-bold text-gray-800">{'Pricing: $' + productDetails.price}</div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <select className="border border-gray-300 rounded-lg p-2">
                        <option>Quantity: 1</option>
                    </select>
                </div>
                <button onClick={handlePurchase} className="bg-black text-white py-3 rounded-lg shadow-lg">
                    Purchase
                </button>
                <details className="border border-gray-300 p-4 rounded-lg">
                    <summary className="font-semibold cursor-pointer">Description</summary>
                    <p className="text-gray-600 mt-2">
                        {productDetails.description}
                    </p>
                </details>
            </div>
        </div>
    );
}

export function ProductBid({ productDetails }: ProductBidProps, { bidValue = 200 }: ProductBidProps) {
    const [favorite, setFavorite] = useState<boolean>(false);

    function handleBid() {
        try {
        } catch (e) {
        }
    }

    function handleFavorite(productID: number) {
        setFavorite(!favorite);
        try {
        } catch (e) {
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8 max-w-6xl mx-auto p-6">
            <div className="flex justify-center items-center">
                <div className="relative bg-gray-200 w-full aspect-square rounded-lg">
                    <img
                        src={productDetails.image}
                        alt={productDetails.name}
                        className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md">
                        <span
                            onClick={() => handleFavorite(productDetails.id)}
                            className="cursor-pointer text-xl text-gray-800">
                            {favorite ? <FaHeart className="text-red-500" /> 
                            : <FaRegHeart />}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col space-y-6">
                <h1 className="text-3xl font-bold text-gray-800">{productDetails.name}</h1>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full w-fit">
                    {productDetails.id}
                </span>
                <div className="text-4xl font-bold text-gray-800">Current Bid: ${bidValue}</div>
                <div className="grid grid-cols-2 gap-4">
                    <label className="text-xl pt-3 font-semibold">
                        Place a New Bid
                    </label>
                    <input
                        id="bidValue"
                        type="number"
                        placeholder="Enter your bid"
                        className="border border-gray-300 rounded-lg p-3 w-full"
                    />
                </div>
                <button
                    onClick={handleBid}
                    className="bg-black text-white py-3 rounded-lg shadow-lg hover:bg-gray-800 transition duration-200">
                    Bid
                </button>
                <details className="border border-gray-300 p-4 rounded-lg">
                    <summary className="font-semibold cursor-pointer">Description</summary>
                    <p className="text-gray-600 mt-2">
                        {productDetails.description}
                    </p>
                </details>
            </div>
        </div>
    );
}

export function ReviewBox({ review }: { review: Review }) {
    return (
        <div className=" h-[200px] sm:h-[250px] md:h-[300px] w-full border rounded-lg shadow-sm bg-white flex flex-col justify-between p-5">
            <h3 className="font-semibold text-lg text-gray-700">{review.reviewer}</h3>
            <p className="pt-5 text-gray-600 overflow-hidden text-md flex-grow ">{review.review}</p>
            <span className="font-medium text-gray-700">Rating: {Array.from({length: review.rating}, (DNE,i) => (
                <span key={i}>⭐</span>
                ))}</span>
        </div>
    );
}

//-------------------------------------------------------------------------------------------------------
// - transactionType: sell or bid
// - productDetails: all information regarding the product, includes {id, name, price, description, image}
// - bidValue: if transactionType is bid retrieve bid value relative to that item
//-------------------------------------------------------------------------------------------------------
export default function ProductPage({ transactionType, productDetails, bidValue }: ProductPageProps) {
    const {itemID} = useParams();

    return (
        <div className="min-h-screen h-[180vh] p-4 bg-white ">
            {transactionType === "sell" ? (
                <ProductSell productDetails={productDetails} />
            ) : (
                <ProductBid productDetails={productDetails} bidValue={bidValue} />
            )}
            <div className="pt-10 p-20">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-10">Latest Reviews</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {reviews.map((review) => (
                        <ReviewBox key={review.id} review={review} />
                    ))}
                </div>
            </div>
            {/*Footer*/}
        </div>
    );
}
