import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  redirect,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { RotateCcw, Share2 } from "lucide-react";
import { useCallback, useState } from "react";
import { z } from "zod";
import { api } from "../../lib/api";

const Party = () => {
  const { id } = useParams({ from: "/party/$id" });
  const { name } = useSearch({ from: "/party/$id" }) as { name: string };

  const [rank, setRank] = useState<number | null>(null);

  const { data: party } = useQuery({
    queryKey: ["party", id],
    queryFn: async () => {
      const response = await api.party[":id"].$get({ param: { id } });

      if (!response.ok) {
        throw new Error("Party not found");
      }

      const data = await response.json();

      // Reset the rank if no players have submitted
      if (data.submitted.length === 0) {
        setRank(0);
      }

      return data;
    },
    refetchInterval: 1000,
  });

  const { mutateAsync: buzz } = useMutation({
    mutationKey: ["party", id, "buzz", name],
    mutationFn: async () => {
      const response = await api.party[":id"].buzz.$post({
        param: { id },
        json: { name },
      });

      if (!response.ok) {
        throw new Error("Failed to buzz");
      }

      return await response.json();
    },
  });

  const onClick = useCallback(async () => {
    // Play the sound
    const audio = new Audio("/sounds/bike_horn.mp3");
    audio.play();

    // Buzz the party
    await buzz(undefined, {
      onSuccess: (data) => setRank(data.rank),
    });
  }, [buzz]);

  const { mutateAsync: reset } = useMutation({
    mutationKey: ["party", id, "reset"],
    mutationFn: async () => {
      const response = await api.party[":id"].reset.$post({ param: { id } });

      return await response.json();
    },
  });

  const onReset = useCallback(async () => {
    await reset();
  }, [reset]);

  const onShare = useCallback(async () => {
    await navigator.share({ url: `http://localhost:3000/party/${id}` });
  }, [id]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="h-3/4 flex flex-col items-center justify-between gap-4">
        <h1 className="text-5xl text-red-950 font-bold">Buzz Ta Mère</h1>

        <div className="w-96 aspect-square flex items-center justify-center rounded-full border-red-400 bg-red-100">
          <img
            src="/skins/bud_button.png"
            className="w-full h-full active:scale-90 transition ease-in-out duration-300"
            onClick={onClick}
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <button className="w-fit h-16 flex items-center px-4 py-2 border border-red-200 bg-red-50 rounded-2xl shadow-md shadow-red-100 text-lg font-semibold active:scale-95 transition ease-in-out duration-300">
            Vous êtes &nbsp;
            <span className="font-bold">{name}</span>&nbsp;!
          </button>

          <div className="flex gap-2">
            <button
              className="w-fit h-16 flex items-center px-4 py-2 border border-red-400 bg-red-100 rounded-2xl shadow-xl shadow-red-200 text-lg font-semibold active:scale-95 transition ease-in-out duration-300"
              onClick={onShare}
            >
              Rejoindre avec&nbsp;
              <span className="font-bold">{id}</span>
              <Share2 className="text-red-600 ml-3" />
            </button>

            {party?.owner === name ? (
              <button
                className="h-16 aspect-square flex items-center justify-center p-4 border border-red-400 bg-red-100 rounded-2xl shadow-xl shadow-red-200 text-lg font-semibold active:scale-95 transition ease-in-out duration-300"
                onClick={onReset}
              >
                <RotateCcw className="text-red-600" />
              </button>
            ) : null}
          </div>

          {rank ? (
            <p className="text-sm text-center mt-2">
              Vous avez appuyé en&nbsp;<span className="font-bold">{rank}</span>
              &nbsp;!
            </p>
          ) : (
            <p className="text-sm text-center mt-2">
              Vous devez appuyer sur le bouton pour gagner !
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const party_query = z.object({ name: z.string() });

export const Route = createFileRoute("/party/$id")({
  component: Party,
  beforeLoad: async (c) => {
    const { id } = c.params;

    // Check if the party exists
    const exists = await api.party[":id"].$get({ param: { id } });

    // If the party does not exist, redirect to the home page
    if (exists.status === 404) {
      throw redirect({ to: "/" });
    }

    // Get the players of the party
    const { players } = await exists.json();

    // Check if the player is in the party based on the name
    if (
      c.search &&
      (c.search as { name?: string }).name &&
      players.includes((c.search as { name: string }).name)
    ) {
      return;
    }

    // Join the party
    const response = await api.party[":id"].$post({ param: { id } });

    // If the request fails, redirect to the home page
    if (!response.ok) {
      throw redirect({ to: "/" });
    }

    // Get the name of the player
    const { name } = await response.json();

    // Redirect to the party with the name
    throw redirect({ to: "/party/$id", params: { id }, search: { name } });
  },
  validateSearch: (s) => party_query.parse(s),
});
