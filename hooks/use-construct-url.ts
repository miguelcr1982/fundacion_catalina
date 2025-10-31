import { env } from "@/lib/env";

export function useConstructUrlVideo(key: string): string {
  return `${env.NEXT_PUBLIC_API_URL}/api${key}`;
}

export function useConstructUrl(key: string): string {
  return `${env.NEXT_PUBLIC_API_URL}${key}`;
}
