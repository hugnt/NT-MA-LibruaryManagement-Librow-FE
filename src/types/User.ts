export enum Role {
    Admin = 0,
    Customer = 1
}

export type RegisterRequest = {
    fullname: string;
    email: string;
    username: string;
    password?: string;
    passwordRetype?: string,
    isCheckPassword?: boolean
};

export type LoginRequest = {
    username: string;
    password: string;
};

export type LogoutRequest = {
    refreshToken: string;
};


export type ExtendSessionRequest = {
    refreshToken: string;
};


export type User = {
    id: string;
    fullname: string;
    username: string;
    email: string;
    role: Role;
};

export type UserRequest = RegisterRequest & {
    id?: string,
    role: Role;
    isCheckPassword?: boolean
};

export const defaultUserRequest: UserRequest = {
    id: '',
    fullname: '',
    username: '',
    email: '',
    role: Role.Customer,
    password: '',
    passwordRetype: '',
    isCheckPassword: true
};

export const defaultUser: User = {
    id: '',
    fullname: '',
    username: '',
    email: '',
    role: Role.Customer,
};

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    user: User;
};

export type Token = {
    accessToken?: string;
    refreshToken?: string;
};
