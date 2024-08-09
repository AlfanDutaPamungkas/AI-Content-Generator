  import React, { useState } from "react";
  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import './App.css'
  import Registration from "./components/Users/Registration";
  import Login from "./components/Users/Login";
  import { QueryClient } from "@tanstack/react-query";
  import Home from "./components/Home/Home";
  import Dashboard from "./components/Users/Dashboard";
  import PublicNavbar from "./components/Navbar/PublicNavbar";
  import PrivateNavbar from "./components/Navbar/PrivateNavbar";
  import { useAuth } from "./AuthContext/AuthContext";
  import AuthRoute from "./components/AuthRoute/AuthRoute";
  import GenerateContent from "./components/ContentGeneration/GenerateContent";
  import Plans from "./components/Plan/Plans";
  import FreePlanSignUp from "./components/Midtrans/FreePlanSignUp";
  import CheckOutForm from "./components/Midtrans/CheckOutForm";
  import PaymentSuccess from "./components/Midtrans/PaymentSuccess";
  import PaymentProcessing from "./components/Midtrans/PaymentProcessing";
import ContentGenerationHistory from "./components/Users/ContentGenerationHistory";
import HistoryDetails from "./components/Users/HistoryDetails";
import PaymentFailed from "./components/Midtrans/PaymentFailed";

  function App() {
    const { isAuthenticated } = useAuth();
    return (
      <>
        <BrowserRouter>
          { isAuthenticated ? <PrivateNavbar/> : <PublicNavbar/> }
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <AuthRoute>
                <Dashboard />
              </AuthRoute>
            } />
            <Route path="/generate-content" element={
              <AuthRoute>
                <GenerateContent />
              </AuthRoute>
            } />
            <Route path="/free-plan" element={
              <AuthRoute>
                <FreePlanSignUp />
              </AuthRoute>
            } />
            <Route path="/checkout/:plan" element={
              <AuthRoute>
                <CheckOutForm />
              </AuthRoute>
            } />
            <Route path="/payment-success" element={
              <AuthRoute>
                <PaymentSuccess />
              </AuthRoute>
            } />
            <Route path="/payment-processing" element={
              <AuthRoute>
                <PaymentProcessing />
              </AuthRoute>
            } />
            <Route path="/payment-failed" element={
              <AuthRoute>
                <PaymentFailed />
              </AuthRoute>
            } />
            <Route path="/history" element={
              <AuthRoute>
                <ContentGenerationHistory />
              </AuthRoute>
            } />
            <Route path="/history/:id" element={
              <AuthRoute>
                <HistoryDetails />
              </AuthRoute>
            } />
          </Routes>
        </BrowserRouter>
      </>
    )
  }

  export default App
