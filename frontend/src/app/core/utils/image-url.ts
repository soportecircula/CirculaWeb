import { environment } from '../../../environments/environment';

export const DEFAULT_AVATAR = '/assets/images/default-avatar.svg';

export function buildImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('data:') || url.startsWith('http')) return url;
  const base = environment.apiUrl || '';
  return url.startsWith('/') ? `${base}${url}` : `${base}/${url}`;
}

export function avatarUrl(url: string | null | undefined): string {
  const built = buildImageUrl(url);
  return built || DEFAULT_AVATAR;
}
