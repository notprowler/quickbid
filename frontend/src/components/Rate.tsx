import React, { useState, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { FaRegStar } from "react-icons/fa6";

interface RateProps {
    buyer: string,
    seller: string,
    user: string
}

/* 
TO DO:

1. Navigate back to previous page with parent state
2. Determine user's perspective from authentication and previous page
*/
export default function Rating({buyer, seller, user}: RateProps) {
    const [isClicked1, setIsClicked1] = useState<Boolean>(false);
    const [isClicked2, setIsClicked2] = useState<Boolean>(false);
    const [isClicked3, setIsClicked3] = useState<Boolean>(false);

    const [rating, setRating] = useState<number>(-1);
    const [comment, setComment] = useState<string>("");

    async function handleSubmit(): Promise<void> {
        try {
            const res = await fetch(`http://localhost:3000/api/users/rating/${user == buyer ? seller : buyer}`, {
                method: "PUT",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    "rating": rating,
                    "comment": comment
                })
            })

            if (!res.ok) {
                throw new Error(`HTTP status: ${res.status}`);
            }
        } catch (e) {
            if (e instanceof Error) {
                console.log(`Error: ${e.message}`);
            }
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-10 shadow-md">
                <div className="mb-4 flex items-center relative">
                    <FaArrowLeft
                        className="absolute left-0 cursor-pointer text-gray-600"
                        onClick={() => {/* navigate back with state from parent component */ }}
                    />
                    <h2 className="mx-auto text-xl font-medium">Rate Your Experience With {user}</h2>
                </div>
                <img
                    src="https://www.pawlovetreats.com/cdn/shop/articles/pembroke-welsh-corgi-puppy_600x.jpg?v=1628638716"
                    alt="dog"
                    className="mx-auto mb-4 w-64 h-35 rounded-lg object-cover"
                />
                <p className="mb-4 text-center text-sm text-gray-500">
                    Share your experience by rating and reviewing sellers on QuickBid – your feedback helps others!
                </p>
                <div className="flex justify-center mb-4">
                    {Array(5).fill(0).map((star, i) => (
                        <FaRegStar key={i} className={`cursor-pointer w-30 ${i <= rating ? 'text-yellow-400' : 'bg-white'}`}
                            onClick={() => setRating(i)}
                        />
                    ))}
                </div>
                <h3 className="mb-2 text-center text-lg font-medium">What went well?</h3>
                <div className="mb-4 flex flex-wrap justify-center gap-2">
                    <div className={`text-black ${isClicked1 ? 'bg-gray-300' : 'bg-gray-100'} text-xs p-2 text-center rounded cursor-pointer hover:bg-gray-300`} onClick={() => setIsClicked1(!isClicked1)}>
                        Pricing
                    </div>
                    <div className={`text-black ${isClicked2 ? 'bg-gray-300' : 'bg-gray-100'} text-xs p-2 text-center rounded cursor-pointer hover:bg-gray-300`} onClick={() => setIsClicked2(!isClicked2)}>
                        Item Description
                    </div>
                    <div className={`text-black ${isClicked3 ? 'bg-gray-300' : 'bg-gray-100'} text-xs p-2 text-center rounded cursor-pointer hover:bg-gray-300`} onClick={() => setIsClicked3(!isClicked3)}>
                        Professionalism
                    </div>
                </div>
                <textarea
                    className="w-full mb-4 p-2 border rounded"
                    id="omment"
                    name="comment"
                    placeholder={`Please leave a comment about `}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />
                <button
                    onClick={handleSubmit}
                    className="w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}