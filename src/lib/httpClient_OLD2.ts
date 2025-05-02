/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROOT_API } from "@/config/api-config";
import loginService from "@/modules/user/service/loginService";
import { Result } from "@/types/api";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { authRequestInterceptor } from "./intercepter";
import { getRefreshToken, handleErrorApi, isLoginPage, removeClientToken, setClientToken } from "./utils";
import { PATH } from "@/constants/paths";

interface RetryQueueItem {
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
    config: AxiosRequestConfig;
}
const refreshAndRetryQueue: RetryQueueItem[] = [];
let isRefreshing = false;

const axiosInstance = axios.create(ROOT_API);
const axiosRetry = axios.create(ROOT_API);


// Interceptor request
axiosInstance.interceptors.request.use(authRequestInterceptor)
axiosRetry.interceptors.request.use(authRequestInterceptor)

axiosRetry.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error("Refresh request failed:", error.message);
        return Promise.reject(error);
    }
);
// Interceptor response
axiosInstance.interceptors.response.use(
    (response) => response.data,
    async (error: AxiosError<Result<any>>) => {
        if (!isLoginPage() && error.response && error.response.status === 401) {
            const originalRequest = error.config as AxiosRequestConfig;
            const requestKey = `${originalRequest.method}:${originalRequest.url}`;
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const refreshToken = getRefreshToken();
                    if (!refreshToken) {
                        console.log("Refresh token not found:", requestKey);
                        throw new Error("Refresh token not found");
                    }
                    console.log("BEGIN RETRY:", requestKey);
                    const res = await loginService.extendSession({ refreshToken });
                    console.log("res:", res)
                    setClientToken({
                        accessToken: res.data!.accessToken,
                        refreshToken: res.data!.refreshToken,
                    });
                    if (originalRequest.headers) originalRequest.headers['Authorization'] = `Bearer ${res.data!.accessToken}`;
                    // Retry all other queued requests
                    refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
                        axiosInstance(config)
                            .then((response) => resolve(response))
                            .catch((err) => reject(err));
                    });

                    refreshAndRetryQueue.splice(0);
                    console.log("RETRY Original SUCCESS:", requestKey)
                    return axiosInstance(originalRequest);

                } catch (err) {
                    refreshAndRetryQueue.splice(0);
                    console.log("RETRY TOKEN FAILURE")
                    window.location.href = PATH.Login;
                    removeClientToken();
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            }
            return new Promise((resolve, reject) => {
                refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
            });
        }
        else {
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

    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig<any>): Promise<Result<T>> =>
        axiosInstance.patch<any, Result<T>>(url, data, config),
};

export const httpClientRetry = {
    post: <T>(url: string, data?: any, config?: AxiosRequestConfig<any>): Promise<Result<T>> =>
        axiosRetry.post<any, Result<T>>(url, data, config),
};
