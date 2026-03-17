const DEFAULT_COURSE_IMAGE = "/course-placeholder.svg";

export function useConstructUrlMedia(key?: string | null): string {
  if (!key) return DEFAULT_COURSE_IMAGE;

  if (key.startsWith("http://") || key.startsWith("https://")) return key;
  if (key.startsWith("/uploads/")) return `/api${key}`;

  return key;
}
