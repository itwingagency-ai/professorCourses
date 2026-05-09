import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useCreateOrderMutation } from "@/redux/features/orders/ordersApi";
import toast from "react-hot-toast";

type Props = {
  setOpen: any;
  courseId: string;
  onSuccess: () => void;
};

const CheckOutForm = ({ setOpen, courseId, onSuccess }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string>("");
  const [createOrder] = useCreateOrderMutation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message || "An error occurred");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      await createOrder({
        courseId,
        payment_info: paymentIntent,
      }).unwrap().then(() => {
        toast.success("Order Created Successfully");
        setOpen(false);
        onSuccess();
      }).catch(() => {
        toast.error("An error occurred creating your order");
      });
      setIsProcessing(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="flex flex-col items-center">
      <PaymentElement id="payment-element" />
      <button 
        disabled={isProcessing || !stripe || !elements} 
        id="submit" 
        className="w-full mt-6 bg-[#37a39a] text-white py-3 rounded-md font-semibold transition hover:opacity-90 disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
      >
        <span id="button-text">
          {isProcessing ? "Processing..." : "Pay now"}
        </span>
      </button>
      {message && <div id="payment-message" className="text-red-500 mt-4 text-center">{message}</div>}
    </form>
  );
};

export default CheckOutForm;
