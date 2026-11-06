import { ENV } from "@/env";

export const baseUrl = ENV.NEXT_PUBLIC_SITE_URL.replace(/\/+$/u, "");
