import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    TITLE_GLOBAL: z.string(),
    DESCRIPCION_GLOBAL: z.string(),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    TITLE_GLOBAL: process.env.TITLE_GLOBAL,
    DESCRIPCION_GLOBAL: process.env.DESCRIPCION_GLOBAL,
  },
});
