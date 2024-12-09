import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { FaRegStar } from "react-icons/fa6";

interface RateProps {
  sellerID?: number;
  buyerID?: number;
  img?: string;
  toggleRateForm: (toggle: boolean) => void;
}

const Rating: React.FC<RateProps> = ({
  sellerID,
  buyerID,
  img,
  toggleRateForm,
}: RateProps) => {
  const [isClicked1, setIsClicked1] = useState<boolean>(false);
  const [isClicked2, setIsClicked2] = useState<boolean>(false);
  const [isClicked3, setIsClicked3] = useState<boolean>(false);
  const [showComplaint, setShowComplaint] = useState<boolean>(false);

  const [rating, setRating] = useState<number>(-1);
  const [complaint, setComplaint] = useState<string>("");
  const [seller, setSeller] = useState<string>("");

  async function updateRating(): Promise<void> {
    const res = await fetch(
      `http://localhost:3000/api/users/rating/${sellerID == undefined ? buyerID : sellerID}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          rating: rating + 1,
        }),
      },
    );

    if (!res.ok) {
      throw new Error(`HTTP status: ${res.status}`);
    }
  }

  async function ratingSubmitted(): Promise<void> {
    const res = await fetch(
      `http://localhost:3000/api/users/rating/${sellerID == undefined ? buyerID : sellerID}`,
      {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          rating: rating + 1,
        }),
      },
    );

    if (!res.ok) {
      throw new Error(`HTTP status: ${res.status}`);
    }
  }

  async function submitComplaint(): Promise<void> {
    const res = await fetch(
      `http://localhost:3000/api/users/complaint/${sellerID == undefined ? buyerID : sellerID}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          complaints: complaint,
        }),
      },
    );

    if (!res.ok) {
      throw new Error(`HTTP status: ${res.status}`);
    }
  }

  async function handleSubmit(): Promise<void> {
    try {
      toggleRateForm(false);
      updateRating();
      ratingSubmitted();
      complaint != "" && submitComplaint();
    } catch (e) {
      if (e instanceof Error) {
        console.log(`Error: ${e.message}`);
      }
    }
  }

  useEffect(() => {
    try {
      const fetchData = async (): Promise<void> => {
        const res = await fetch(
          `http://localhost:3000/api/users/${sellerID == undefined ? buyerID : sellerID}`,
        );

        if (!res.ok) {
          throw new Error(`HTTP Status: ${res.status}`);
        }

        const { username } = await res.json();

        setSeller(username);
      };
      fetchData();
    } catch (e) {
      if (e instanceof Error) {
        console.log(`Error: ${e.message}`);
      }
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-md">
        <div className="relative mb-5 flex items-center">
          <FaArrowLeft
            className="absolute left-0 cursor-pointer text-gray-600"
            onClick={() => {
              toggleRateForm(false);
            }}
          />
          <h2 className="mx-auto text-xl font-medium">
            Rate Your Experience With {seller}
          </h2>
        </div>
        <img
          src={img}
          alt="dog"
          className="h-35 mx-auto mb-5 w-64 rounded-lg object-cover"
        />
        <p className="mb-5 text-center text-sm text-gray-500">
          Share your experience by rating and reviewing sellers on QuickBid –
          your feedback helps others!
        </p>
        <div className="mb-4 flex justify-center">
          {Array(5)
            .fill(0)
            .map((star, i) => (
              <FaRegStar
                key={i}
                className={`w-30 cursor-pointer ${i <= rating ? "text-yellow-400" : "bg-white"}`}
                onClick={() => setRating(i)}
              />
            ))}
        </div>
        <h3 className="mb-2 text-center text-lg font-medium">
          What went well?
        </h3>
        <div className="mb-5 flex flex-wrap justify-center gap-2">
          <div
            className={`text-black ${isClicked1 ? "bg-gray-300" : "bg-gray-100"} cursor-pointer rounded p-2 text-center text-xs hover:bg-gray-300`}
            onClick={() => setIsClicked1(!isClicked1)}
          >
            Pricing
          </div>
          <div
            className={`text-black ${isClicked2 ? "bg-gray-300" : "bg-gray-100"} cursor-pointer rounded p-2 text-center text-xs hover:bg-gray-300`}
            onClick={() => setIsClicked2(!isClicked2)}
          >
            Item Description
          </div>
          <div
            className={`text-black ${isClicked3 ? "bg-gray-300" : "bg-gray-100"} cursor-pointer rounded p-2 text-center text-xs hover:bg-gray-300`}
            onClick={() => setIsClicked3(!isClicked3)}
          >
            Professionalism
          </div>
        </div>
        <div
          className="mb-4 ml-auto w-fit cursor-pointer rounded bg-red-500 p-2 text-xs text-white hover:bg-red-600"
          onClick={() => setShowComplaint(!showComplaint)}
        >
          File Complaints
        </div>
        {showComplaint && (
          <textarea
            className="mb-5 w-full rounded border p-2"
            id="complaint"
            name="complaint"
            placeholder={`What went wrong?`}
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
          />
        )}
        <button
          disabled={rating == -1}
          onClick={handleSubmit}
          className="w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Rating;
