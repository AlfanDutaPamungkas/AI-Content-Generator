import axios from 'axios';

export const handleFreeSubscriptionAPI = async() => {
    const response = await axios.post('http://localhost:3000/api/v1/midtrans/free-plan',
        {},
        {
            withCredentials: true
        }
    );
    return response.data;
};

export const checkoutAPI = async(amount, plan) => {
    localStorage.setItem("amount", amount);
    const response = await axios.post("http://localhost:3000/api/v1/midtrans/checkout", 
        {
          amount,
          subscriptionPlan: plan
        },{
            withCredentials: true
        }
    ); 
    return response.data;
};

export const handleAfterPayment = async(orderID, plan, amount) => {
    await axios.post("http://localhost:3000/api/v1/midtrans/payment-success",
      {
        orderID,
        plan,
        amount
      },
      { withCredentials: true }
    );
  };


