import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: (
    requestOrigin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    callback(null, true);
  },
};
