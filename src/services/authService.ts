import api, { tokenStorage } from './api';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}


export const loginUser = async (credentials: LoginCredentials): Promise<AuthUser> => {
  const response = await api.post<LoginResponse>('/auth/login', credentials);
  const { accessToken, refreshToken, user } = response.data.data;
  tokenStorage.setTokens(accessToken, refreshToken);
  return user;
};

export const logoutUser = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch {
    // Local cleanup always runs regardless.
  } finally {
    tokenStorage.clear();
    localStorage.removeItem('authUser');
    window.dispatchEvent(new Event('auth:logout'));
  }
};

export const getStoredUser = (): string | null => {
  return tokenStorage.getAccess();
};
