import { createContext, useContext, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { checkAuthAPI } from '../apis/users/usersAPI';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuthenticated') === 'true';
    });
    const { isError, isLoading, data, isSuccess } = useQuery({
        queryFn: checkAuthAPI,
        queryKey: ['checkAuth']
    });

    useEffect(() => {
        localStorage.setItem('isAuthenticated', isAuthenticated);
    }, [isAuthenticated]);

    const login = () => {
        setIsAuthenticated(true);
    }

    const logout = () => {
        setIsAuthenticated(false);
    }

    return(
        <>
            <AuthContext.Provider value={{isAuthenticated, isError, isLoading, isSuccess, login, logout}}>
                {children}
            </AuthContext.Provider>
        </>
    );
};

export const useAuth = () =>{
    return useContext(AuthContext);
};