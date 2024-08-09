import axios from 'axios';

export const registerAPI = async(userData) => {
    const response = await axios.post('http://localhost:3000/api/v1/users/register',
        {
            email: userData.email,
            password: userData.password,
            username: userData.username
        },
        {
            withCredentials: true
        }
    );
    return response.data;
};

export const loginAPI = async(userData) => {
    const response = await axios.post('http://localhost:3000/api/v1/users/login',
        {
            email: userData.email,
            password: userData.password,
        },
        {
            withCredentials: true
        }
    );
    return response.data;
};

export const checkAuthAPI = async(userData) => {
    const response = await axios.get('http://localhost:3000/api/v1/users/auth/check',
        {
            withCredentials: true
        }
    );
    return response.data;
};

export const logoutAPI = async() => {
    const response = await axios.post('http://localhost:3000/api/v1/users/logout',
        {},
        {
            withCredentials: true
        }
    );
    return response.data;
};

export const userProfileAPI = async(userData) => {
    const response = await axios.get('http://localhost:3000/api/v1/users/profile',
        {
            withCredentials: true
        }
    );
    return response.data;
};

export const setActiveOrderIdAPI = async(orderID, plan) => {
    const response = await axios.post('http://localhost:3000/api/v1/users/set-orderid',
        {orderID, plan},
        {
            withCredentials: true
        }
    );
    return response.data;
};

export const getActiveOrderIdAPI = async() => {
    const response = await axios.get('http://localhost:3000/api/v1/users/get-orderid',
        {
            withCredentials: true
        }
    );
    return response.data;
};

export const deleteActiveOrderIdAPI = async() => {
    const response = await axios.get('http://localhost:3000/api/v1/users/delete-orderid',
        {
            withCredentials: true
        }
    );
    return response.data;
};

export const fetchSingleHistoryAPI = async(id) => {
    const response = await axios.get(`http://localhost:3000/api/v1/users/fetch-history/${id}`,
        {
            withCredentials: true
        }
    );
    return response.data;
};

