/**
 * In-memory access token storage.
 * The token is NEVER persisted to localStorage — it lives only in memory.
 * On page reload, the app uses the refresh token cookie to obtain a new access token.
 */
let _accessToken: string | null = null;

export function getAccessToken(): string | null {
  return _accessToken;
}

export function setAccessToken(token: string | null): void {
  _accessToken = token;
}
