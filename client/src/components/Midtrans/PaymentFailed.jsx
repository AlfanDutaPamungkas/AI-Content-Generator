import React from 'react'
import { FaTimesCircle } from 'react-icons/fa'

const PaymentFailed = () => {
  return (
    <div className="bg-gray-900 h-screen -mt-4 flex justify-center items-center">
      <div className="max-w-lg mx-auto my-10 p-6 bg-white shadow-md rounded-lg">
        <div className="flex flex-col items-center text-red-500">
          <FaTimesCircle className="text-5xl mb-3" />
          <p className="text-xl">Payment failed</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailed
