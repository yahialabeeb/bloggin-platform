export interface AccessTokenPayload {
  sub: string;
  username: string;
  email: string;
  iss: string;
}

interface AuthTokensConfig {
  email: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AccountWithTokens extends AuthTokensConfig {
  username: string;
  name: string;
  id: string;
}
