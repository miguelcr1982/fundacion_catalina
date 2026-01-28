export function useConstructUrlVideo(key: string): string {
  return `/api${key}`;
}

export function useConstructUrl(key: string): string {
  return key.startsWith("/") ? key : `/api${key}`;
}
