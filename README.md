# AI Content Generator

This repository is only intended to implement Gemini's API and Midtrans payment gateway integration, not for commercial purposes

## Features

- **User Registration and Login:** Users can register and log in to their accounts.
- **Content Generation:** Users can generate content using <a href="https://ai.google.dev/gemini-api">Gemini API</a>.
- **Payment Gateway Integration:** Users can make payments using <a href="https://midtrans.com/"> Midtrans payment gateway </a>.

## Project Structure

- `server`: Contains the backend code, built with Express.js.
- `client`: Contains the frontend code, built with React.js.

## Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AlfanDutaPamungkas/AI-Content-Generator.git
   cd AI-Content-Generator
2. **Backend Setup:**
    ```bash
    cd server
    npm install
    ```
    Create a .env file in the server folder and add the following environment variables:
    ```bash
    PORT=your_server_port
    MONGO_URL=your_mongo_url
    JWT_KEY=your_JWT_key
    GEMINI_API_KEY=your_gemini_api_key
    MIDTRANS_SERVER_KEY=your_midtrans_server_key
    MIDTRANS_CLIENT_KEY=your_midtrans_client_key
    ```
    Start the server:
    ```bash
    node server.js

3. **Frontend Setup:**
    
    Open a new terminal and navigate to the project root:
    ```bash
    cd client
    npm install
    ```
    Start the frontend development server:
    ```bash
    npm run dev
    ```

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.