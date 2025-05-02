/* eslint-disable react-refresh/only-export-components */
import PageLoading from "@/components/loading/PageLoading";
import { getClientToken, getRefreshToken, isLoginPage, removeClientToken, setClientToken } from "@/lib/utils";
import loginService from "@/modules/user/service/loginService";
import { Result } from "@/types/api";
import { LoginRequest, LoginResponse, Token, User } from "@/types/User";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
    user: User | undefined,
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>
    logout: () => void
    login: (data: LoginRequest) => Promise<Result<LoginResponse>>;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    setIsAuthenticated: () => { },
    user: undefined,
    setUser: () => { },
    logout: () => { },
    login: async () => ({}) as Result<LoginResponse>,
})

export const useAuthContext = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const accessToken = getClientToken();
    const [isAuthenticated, setIsAuthenticated] = useState(!!accessToken);
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;
        if (isLoginPage()) return;
        console.log("Jump in user context to fetching...")
        loginService.getUserContext().then(res => {
            setUser(res.data)
        }).catch(() => {
            removeClientToken();
            setUser(undefined)
            setIsAuthenticated(false)
        }).finally(() => setLoading(false))
    }, []);

    const logout = () => {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
            console.log("LOGOUT", refreshToken)
            loginService.logout({ refreshToken }).finally(() => removeClientToken());
        }
        setUser(undefined);
        setIsAuthenticated(false);
    };

    const login = async (data: LoginRequest): Promise<Result<LoginResponse>> => {
        const res = await loginService.login(data);
        const token: Token = {
            accessToken: res.data?.accessToken,
            refreshToken: res.data?.refreshToken,
        };
        setClientToken(token);
        setIsAuthenticated(true);
        setUser(res.data?.user);
        return res;
    };


    const contextValue = { isAuthenticated, setIsAuthenticated, user, setUser, login, logout };
    return (loading ? <PageLoading /> : <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>);
}

export default AuthProvider;