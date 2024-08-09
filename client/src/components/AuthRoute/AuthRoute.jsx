import React from 'react'
import { Navigate, useLocation} from 'react-router-dom'
import { useAuth } from '../../AuthContext/AuthContext'
import AuthCheckingComponent from '../Alert/AuthCheckingComponent'

const AuthRoute = ({children}) => {
  const location = useLocation();
  const { isAuthenticated, isError,  isLoading } = useAuth();

  if (isLoading) {
    return <AuthCheckingComponent/>
  }

  const storedAuth = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated && !storedAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  return children;
  
}

export default AuthRoute
