import { hc } from "hono/client";
import { AppType } from "../../../api/src/index";

export const api = hc<AppType>("http://localhost:5000");
