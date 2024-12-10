import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";

interface AddFundsProps {
  isOpen: boolean;
  onClose: () => void;
  clientSecret: string | null;
  onPaymentSuccess: (amount: number) => void;
  onRequestPayment: (amount: number) => void;
}

const AddFunds: React.FC<AddFundsProps> = ({
  isOpen,
  onClose,
  clientSecret,
  onPaymentSuccess,
  onRequestPayment,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (clientSecret) {
      console.log("ClientSecret is available for processing payment.");
    }
  }, [clientSecret]);

  const processPayment = async () => {
    if (!stripe || !elements || !clientSecret) {
      setMessage("Stripe is not loaded or missing clientSecret.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setMessage("Payment method element is not available.");
      return;
    }

    setLoading(true);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setMessage(result.error.message || "Payment failed.");
      } else if (result.paymentIntent?.status === "succeeded") {
        const numericAmount = Number(amount);

        try {
          await axios.post(
            "http://localhost:3000/api/payments/update-balance",
            { amount: numericAmount * 100 }, // Send amount in cents
            { withCredentials: true },
          );

          onPaymentSuccess(numericAmount);
          setMessage("Payment successful!");
          setTimeout(handleAddFundsClose, 1000);
        } catch (error) {
          console.error("Failed to update balance:", error);
          setMessage("Payment succeeded, but failed to update balance.");
        }
      }
    } catch (error) {
      console.error("Error during payment:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    const numericAmount = Number(amount);

    if (!isValidAmount() || numericAmount <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    if (!clientSecret) {
      await onRequestPayment(numericAmount);
      setMessage("Fetching payment details. Please wait...");
    } else {
      await processPayment();
    }
  };

  const isValidAmount = () => {
    const value = Number(amount);
    return value > 0 && !isNaN(value);
  };

  const handleAddFundsClose = () => {
    setMessage("");
    setAmount("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-3/12 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Add Funds</h2>
        <div className="mb-4 flex items-center rounded border p-2">
          <span className="mr-2 text-gray-500">$</span>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            autoComplete="off"
            className="w-full border-none outline-none"
          />
        </div>
        <CardElement className="mb-4 rounded border p-2" />
        <button
          onClick={handlePayment}
          disabled={loading || !isValidAmount()}
          className="w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Processing payment..." : "Confirm Payment"}
        </button>
        <button
          onClick={handleAddFundsClose}
          className="mt-2 w-full rounded bg-gray-300 px-4 py-2 font-semibold text-black"
        >
          Cancel
        </button>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default AddFunds;
