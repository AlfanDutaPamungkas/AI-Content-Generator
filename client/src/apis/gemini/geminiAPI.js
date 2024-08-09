import axios from 'axios';

export const generateContentAPI = async(userPrompt) => {
    const response = await axios.post('http://localhost:3000/api/v1/gemini/generate',
        {
            prompt: userPrompt
        },
        {
            withCredentials: true
        }
    );
    return response.data;
};