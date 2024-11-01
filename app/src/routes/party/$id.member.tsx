import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  redirect,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { Share2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { api } from "../../lib/api";

const Party = () => {
  const { id } = useParams({ from: "/party/$id/member" });
  const { name } = useSearch({ from: "/party/$id/member" }) as { name: string };

  const [rank, setRank] = useState<number | null>(null);

  // Fetch the party data from the server with polling to refresh the ranks
  useQuery({
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

  // Buzz
  const onClick = useCallback(async () => {
    // Play the sound
    const audio = new Audio("/sounds/bike_horn.mp3");
    audio.play();

    // Buzz the party
    await buzz(undefined, {
      onSuccess: (data) => setRank(data.rank),
    });
  }, [buzz]);

  const { mutateAsync: leave } = useMutation({
    mutationKey: ["party", id, "leave"],
    mutationFn: async () => {
      const response = await api.party[":id"][":name"].$delete({
        param: { id, name },
      });

      return await response.json();
    },
  });

  // Listen for page close to remove the player from the party
  useEffect(() => {
    const onChange = async () => {
      if (document.visibilityState === "visible") {
        // reload the page
        window.location.reload();

        return;
      }

      await leave();
    };

    window.addEventListener("visibilitychange", onChange);

    return () => window.removeEventListener("visibilitychange", onChange);
  }, [leave]);

  // Share the party
  const onShare = useCallback(
    async () =>
      await navigator.share({
        url: `${import.meta.env.VITE_APP_URL}/party/${id}/member`,
      }),
    [id]
  );

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="h-full flex flex-col items-center justify-between gap-4">
        <h1 className="text-5xl text-blue-950 font-bold">Buzz Ta Mère</h1>

        <div className="w-96 aspect-square flex items-center justify-center rounded-full border-blue-400 bg-blue-100">
          <img
            src="/skins/bud_button.png"
            className="w-full h-full active:scale-90 transition ease-in-out duration-300"
            onClick={onClick}
          />
        </div>

        <div className="w-[80%] flex flex-col items-center gap-2">
          <button className="w-full h-16 flex items-center px-4 py-2 border border-blue-200 bg-blue-50 rounded-2xl shadow-md shadow-blue-100 text-lg font-semibold active:scale-95 transition ease-in-out duration-300">
            Vous êtes &nbsp;
            <span className="font-bold">{name}</span>&nbsp;!
          </button>

          <button
            className="w-full h-16 flex justify-between items-center px-4 py-2 border border-blue-400 bg-blue-100 rounded-2xl shadow-xl shadow-blue-200 text-lg font-semibold active:scale-95 transition ease-in-out duration-300"
            onClick={onShare}
          >
            <div className="flex items-center">
              Rejoindre avec&nbsp;
              <span className="font-bold">{id}</span>
            </div>
            <Share2 className="text-blue-600 ml-3" />
          </button>

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

export const Route = createFileRoute("/party/$id/member")({
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
    throw redirect({
      to: "/party/$id/member",
      params: { id },
      search: { name },
    });
  },
  validateSearch: (s) => party_query.parse(s),
});
