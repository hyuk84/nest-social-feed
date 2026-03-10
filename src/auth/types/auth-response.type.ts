export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    publicId: string;
    email: string;
    userName: string;
    displayName: string;
  };
};
