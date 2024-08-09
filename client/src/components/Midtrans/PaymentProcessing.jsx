import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { deleteActiveOrderIdAPI, getActiveOrderIdAPI } from "../../apis/users/usersAPI";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { handleAfterPayment } from "../../apis/midtransPayment/midtransPayment";

const PaymentProcessing = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Your payment status is pending, please make a payment...");

  const { data, isLoading, isError } = useQuery({
    queryFn: getActiveOrderIdAPI,
    queryKey: ["get-active-order-id"]
  });
  
  const result = data?.orderID

  useEffect(() => {
    if (isLoading) return;
    if (isError) {
      navigate("/dashboard");
      return;
    }

    if (result) {
      const [order_id, plan] = result.split(" ");
      const interval = setInterval(async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/v1/midtrans/check-payment-status?order_id=${order_id}`,
            { withCredentials: true }
          );
          
          if (response.data.status === 'not found') {
            clearInterval(interval);
            navigate('/');
          }else if (response.data.status === 'failed') {
            deleteActiveOrderIdAPI();
            clearInterval(interval);
            navigate('/payment-failed');
          } else if (response.data.status === 'paid') {
            setMessage("Verifying your payment, please wait...");
            await handleAfterPayment(order_id, plan ,response.data.detail.gross_amount);
            deleteActiveOrderIdAPI();
            clearInterval(interval);
            navigate('/payment-success');
          }else{
            return;
          }
        } catch (error) {
          console.error("Error checking payment status", error);
        }
      }, 3000);

      return () => clearInterval(interval);
    } else {
      alert("You have no transactions on this plan!");
      navigate("/dashboard");
    }
  }, [result, isLoading, isError, navigate]);

  return (
    <div className="bg-gray-900 h-screen -mt-4 flex justify-center items-center">
      <div className="max-w-lg mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mb-3" />
          <p className="text-lg text-gray-600">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;
