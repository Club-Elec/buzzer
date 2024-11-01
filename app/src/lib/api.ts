import { hc } from "hono/client";
import { AppType } from "../../../api/src/index";

export const api = hc<AppType>(`${import.meta.env.VITE_API_URL}`);
