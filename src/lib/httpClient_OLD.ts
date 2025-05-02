/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { ROOT_API } from "@/config/api-config";
import { Result } from "@/types/api";
import { getAccessToken, getRefreshToken, handleErrorApi, removeClientToken, setClientToken } from "./utils";
import loginService from "@/modules/user/service/loginService";
import { PATH } from "@/constants/paths";

const axiosInstance = axios.create(ROOT_API);

const retryRequestsMap = new Map<string, boolean>();
const refreshToken = async (): Promise<string | undefined> => {
    console.log("RETRY TOKEN IN PROCESSS")
    const refreshToken = getRefreshToken();
    if (!refreshToken) return undefined;
    return await loginService.extendSession({ refreshToken }).then(res => {
        setClientToken({ accessToken: res.data!.accessToken, refreshToken: res.data!.refreshToken });
        return res.data?.accessToken;
    }).catch(() => {
        return undefined;
    })

};

const isLoginPage = () => window.location.pathname == PATH.Login;

// Interceptor request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

// Interceptor response
axiosInstance.interceptors.response.use(
    (response) => response.data,
    async (error: AxiosError<Result<any>>) => {
        if (error.response && error.response.status === 401) {
            const originalRequest = error.config as AxiosRequestConfig;
            const requestKey = `${originalRequest.method}:${originalRequest.url}`;
            if (isLoginPage()) {
                return Promise.resolve("Welcome to the show");
            }
            console.log("BEGIN RETRY:", requestKey);
            if (retryRequestsMap.get(requestKey)) {
                retryRequestsMap.set(requestKey, false)
                return Promise.reject(error);
            }
            retryRequestsMap.set(requestKey, true)
            const newToken = await refreshToken();
            // console.log("newToken:", newToken)
            if (!newToken) {
                console.log("RETRY TOKEN FAILURE")
                removeClientToken();
                //location.href = PATH.Login;
                return Promise.reject(error);
            }
            console.log("RETRY SUCCESS:", requestKey)
            retryRequestsMap.set(requestKey, false)
            if (originalRequest.headers) originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
            return axiosInstance(originalRequest);
        } else {
            handleErrorApi({ errors: error.response?.data?.errors || [error.message] });
        }
        return Promise.reject(error);
    }
);

export const httpClient = {
    get: <T>(url: string, config?: AxiosRequestConfig<any>): Promise<Result<T>> =>
        axiosInstance.get<any, Result<T>>(url, config),

    post: <T>(url: string, data?: any, config?: AxiosRequestConfig<any>): Promise<Result<T>> =>
        axiosInstance.post<any, Result<T>>(url, data, config),

    put: <T>(url: string, data?: any, config?: AxiosRequestConfig<any>): Promise<Result<T>> =>
        axiosInstance.put<any, Result<T>>(url, data, config),

    delete: <T>(url: string, config?: AxiosRequestConfig<any>): Promise<Result<T>> =>
        axiosInstance.delete<any, Result<T>>(url, config),
};

// export default httpClient;
