export type JwtPayload = {
  sub: string;
  publicId: string;
  email: string;
  userName: string;
  profileImageUrl: string | null;
};
