import { z } from "zod";

export const party_params = z.object({ id: z.string() });
export const party_body = z.object({ name: z.string() });
