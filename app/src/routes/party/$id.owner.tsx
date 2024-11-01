import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { RotateCcw, Share2 } from "lucide-react";
import { useCallback } from "react";
import { api } from "../../lib/api";

const PartyOwner = () => {
  const { id } = useParams({ from: "/party/$id/owner" });

  // Fetch the party data from the server with polling
  const { data: party } = useQuery({
    queryKey: ["party", id],
    queryFn: async () => {
      const response = await api.party[":id"].$get({ param: { id } });

      if (!response.ok) {
        throw new Error("Party not found");
      }

      const data = await response.json();

      return data;
    },
    refetchInterval: 500,
  });

  const { mutateAsync: reset } = useMutation({
    mutationKey: ["party", id, "reset"],
    mutationFn: async () => {
      const response = await api.party[":id"].reset.$post({ param: { id } });

      return await response.json();
    },
  });

  // Reset the party submitted list
  const onReset = useCallback(async () => {
    await reset();
  }, [reset]);

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
      <div className="h-3/4 flex flex-col items-center justify-between gap-4">
        <h1 className="text-5xl text-red-950 font-bold">Buzz Ta Mère</h1>

        <div className="w-96 flex flex-col items-center gap-4">
          {party && party.players.length > 0 ? (
            party.players.map((name) => {
              const hasSubmitted = party.submitted.indexOf(name);

              return (
                <div
                  key={name}
                  className="w-full h-16 flex items-center justify-between px-4 py-2 border border-red-400 bg-red-100 rounded-2xl shadow-xl shadow-red-200 text-lg font-semibold"
                >
                  <p>{name}</p>

                  <div className="h-full aspect-square flex items-center justify-center font-bold">
                    {hasSubmitted === -1 ? "-" : hasSubmitted + 1}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full h-16 flex items-center justify-between px-4 py-2 border border-red-400 bg-red-100 rounded-2xl shadow-xl shadow-red-200 text-lg font-semibold">
              <p>Aucun joueur...</p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            className="w-full h-16 flex items-center justify-between px-4 py-2 border border-red-400 bg-red-100 rounded-2xl shadow-xl shadow-red-200 text-lg font-semibold active:scale-95 transition ease-in-out duration-300"
            onClick={onReset}
          >
            Manche suivante
            <RotateCcw className="text-red-600 ml-4" />
          </button>

          <button
            className="w-full h-16 flex items-center justify-between px-4 py-2 border border-red-400 bg-red-100 rounded-2xl shadow-xl shadow-red-200 text-lg font-semibold active:scale-95 transition ease-in-out duration-300"
            onClick={onShare}
          >
            Rejoindre avec&nbsp;
            <span className="font-bold">{id}</span>
            <Share2 className="text-red-600 ml-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/party/$id/owner")({
  component: PartyOwner,
});
