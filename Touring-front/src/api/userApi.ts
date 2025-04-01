import { ApiResponse, User } from "./authApi"
import api from "./axios"


export const userApi = {
    async getProfile(): Promise<User> {
        const response = await api.get<ApiResponse<User>>('/users/profile');
        return response.data.data;
    },
};

