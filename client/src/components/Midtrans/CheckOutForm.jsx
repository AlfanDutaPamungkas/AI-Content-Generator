import React, { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { checkoutAPI } from "../../apis/midtransPayment/midtransPayment";
import StatusMessage from "../Alert/StatusMessage";
import { setActiveOrderIdAPI } from "../../apis/users/usersAPI";

const CheckOutForm = () => {
  const { plan } = useParams();
  const [ searchParams ] = useSearchParams();
  const amount = searchParams.get("amount");
  const orderId = searchParams.get("order_id");
  const transactionStatus = searchParams.get("transaction_status");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: ({ amount, plan }) => checkoutAPI(amount, plan),
    mutationKey: ["checkout"],
    onSuccess: (data) => {
      window.snap.pay(data.token);
    }
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", import.meta.env.VITE_CLIENT_KEY);
    script.setAttribute("type", "text/javascript");
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (transactionStatus) {
      if (transactionStatus === "settlement" || transactionStatus === "pending") {
        setActiveOrderIdAPI(orderId, plan);
        navigate("/payment-processing");
      }else{
        navigate("/payment-failed");
      }
    }
  }, [ transactionStatus]);

  const handlePayment = async(event) => {
    event.preventDefault();
    try {
      mutation.mutate({amount, plan});
    } catch (error) {
      console.error("Payment failed", error);
    }
  };

  return (
    <>
      <div className="bg-gray-900 h-screen -mt-4 flex justify-center items-center">
        <form className="w-96 mx-auto my-4 p-6 bg-white rounded-lg shadow-md" onSubmit={handlePayment}>
          <div className="mb-4">
            <h2 className="text-center font-bold text-2xl">Payment</h2>
            {mutation.isPending && (
            <StatusMessage type="loading" message="Loading..." />
            )}

            {mutation.isError && (
            <StatusMessage type="error" message={mutation?.error?.response?.data?.error} />
            )}
          </div>
          <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" type="submit">
            Pay
          </button>
        </form>
      </div>
    </>
  );
};

export default CheckOutForm;
