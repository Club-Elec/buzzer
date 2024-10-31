import { createFileRoute, redirect } from "@tanstack/react-router";
import { api } from "../../lib/api";

export const Route = createFileRoute("/party/new")({
  beforeLoad: async () => {
    const response = await api.party.$post();
    const { id, name } = await response.json();

    throw redirect({ to: "/party/$id", params: { id }, search: { name } });
  },
});
