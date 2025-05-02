import { httpClient, httpClientRetry } from "@/lib/httpClient";
import { ExtendSessionRequest, LoginRequest, LoginResponse, LogoutRequest, RegisterRequest, Token, User } from "@/types/User";

const loginService = {
    login: (body: LoginRequest) => httpClient.post<LoginResponse>('users/login', body),
    register: (body: RegisterRequest) => httpClient.post<LoginResponse>('users/register', body),
    extendSession: (body: ExtendSessionRequest) => httpClientRetry.post<Token>('users/extend-session', body),
    getUserContext: () => httpClient.get<User>("users/get-current-context"),
    logout: (body: LogoutRequest) => httpClient.post("users/logout", body)

};

export default loginService;