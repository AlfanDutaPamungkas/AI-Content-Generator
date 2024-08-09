import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {

  return (
    <div className="bg-gray-900 h-screen -mt-4 flex justify-center items-center">
      <div className="max-w-lg mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
        <div className="text-center text-green-500">
          <FaCheckCircle className="text-5xl mb-3" />
          <h1 className="text-2xl font-bold mb-3">Payment Successful</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your payment...
          </p>
          <Link
            to="/generate-content"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Using AI
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
