import { InternalAxiosRequestConfig } from "axios";
import { getAccessToken } from "./utils";

export const authRequestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

