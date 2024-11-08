import { useMutation, useQuery } from "@tanstack/react-query";
import { createLazyFileRoute, useParams } from "@tanstack/react-router";
import { Minus, RotateCcw, Share2, User } from "lucide-react";
import { useCallback, useMemo } from "react";
import { api } from "../../lib/api";
import { QRCodeSVG } from "qrcode.react";
import Button from "../../components/ui/Button";

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

  const ranks = useMemo<string[]>(() => {
    if (!party) {
      return [];
    }

    const players = party.players;

    if (party.submitted.length === 0) {
      return players;
    }

    const submitted = party.submitted;

    // Sort the players by the order they submitted, then by their name
    const sorted = players.sort((a, b) => {
      const aIndex = submitted.indexOf(a);
      const bIndex = submitted.indexOf(b);

      if (aIndex === -1) {
        return 1;
      }

      if (bIndex === -1) {
        return -1;
      }

      return aIndex - bIndex;
    });

    return sorted;
  }, [party]);

  const players = useMemo(() => {
    if (ranks.length === 0) {
      return (
        <Button
          variant="secondary"
          className="w-full md:w-auto flex items-center"
        >
          <Minus className="text-red-600 mr-2" />
          <p>Aucun joueur</p>
        </Button>
      );
    }

    return ranks.map((name) => {
      const hasSubmitted = party!.submitted.indexOf(name);

      return (
        <Button
          variant="secondary"
          className="w-full md:w-auto flex items-center justify-between"
          key={name}
        >
          <div className="flex">
            <User className="text-red-600 mr-4" />
            <p>{name}</p>
          </div>

          <div className="h-full aspect-square flex items-center justify-center font-bold">
            {hasSubmitted === -1 ? "-" : hasSubmitted + 1}
          </div>
        </Button>
      );
    });
  }, [ranks, party]);

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <div className="flex justify-center md:justify-start">
        <h1 className="text-5xl text-red-900 font-['Poppins'] font-bold">
          {import.meta.env.VITE_APP_NAME}
        </h1>
      </div>

      <div className="w-full h-full flex flex-col md:flex-row gap-4 overflow-y-auto">
        <div className="flex-1 flex flex-col gap-4 border bg-red-950/20 border-red-950 rounded-2xl p-4">
          <h2 className="text-3xl text-red-900 font-['Poppins'] font-bold">
            Joueurs connectés
          </h2>

          <div className="w-full h-full flex flex-col md:flex-row md:flex-wrap content-start gap-4 overflow-y-auto">
            {players}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 border bg-red-950/20 border-red-950 rounded-2xl p-4">
          <h2 className="text-3xl text-red-900 font-['Poppins'] font-bold">
            Paramètres de la partie
          </h2>

          <Button
            className="w-full flex items-center justify-between"
            onClick={onReset}
          >
            Manche suivante
            <RotateCcw className="text-red-100 ml-4" />
          </Button>

          <hr className="border-red-900 mt-2 mb-2" />

          <div className="w-full flex flex-col gap-4">
            <QRCodeSVG
              title={`{import.meta.env.VITE_APP_NAME} - Rejoindre la partie`}
              value={`${import.meta.env.VITE_APP_URL}/party/${id}/member`}
              className="w-full max-h-96 h-full"
            />

            <Button
              variant="secondary"
              className="w-full flex items-center justify-between"
              onClick={onShare}
            >
              <div className="flex gap-2">
                Rejoindre avec&nbsp;
                <span className="font-bold">{id}</span>
              </div>
              <Share2 className="text-red-600 ml-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute("/party/$id/owner")({
  component: PartyOwner,
});
