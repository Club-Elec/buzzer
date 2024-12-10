import { ContactShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  redirect,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { Check, Music, Play, Share2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "../../components/ui/Button";
import { api } from "../../lib/api";
import { available_sounds, AvailableSound } from "../../lib/constants";
import Buzzer from "../../models/Buzzer";

const Party = () => {
  const { id } = useParams({ from: "/party/$id/member" });
  const { name } = useSearch({ from: "/party/$id/member" }) as { name: string };

  // The picked sound name
  const [sound, setSound] = useState<AvailableSound>("Vélo.mp3");

  // The player rank when they buzz
  const [rank, setRank] = useState<number | null>(null);

  // The sound dialog ref
  const soundDialogRef = useRef<HTMLDialogElement>(null);

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
        setRank(null);
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

      const data = await response.json();

      setRank(data.rank);

      return data;
    },
  });

  // Play sound
  const play = useCallback(async (sound: AvailableSound) => {
    // Play the sound
    const audio = new Audio(`/sounds/${sound}`);
    audio.play();
  }, []);

  // Buzz
  const onClick = useCallback(
    async (sound: AvailableSound) => {
      // Play the sound
      play(sound);

      // Buzz the party
      await buzz(undefined);
    },
    [play, buzz]
  );

  const { mutateAsync: leave } = useMutation({
    mutationKey: ["party", id, "leave"],
    mutationFn: async () =>
      navigator.sendBeacon(
        api.party[":id"][":name"].leave.$url({ param: { id, name } })
      ),
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
    <div className="w-full h-full flex flex-col gap-4 p-4 justify-between overflow-y-hidden">
      <div className="flex justify-center md:justify-start">
        <h1 className="text-5xl text-red-900 font-['Poppins'] font-bold">
          {import.meta.env.VITE_APP_NAME}
        </h1>
      </div>

      <div className="w-auto flex justify-center flex-grow-0 overflow-hidden">
        <div className="w-[90%] max-w-[48rem] aspect-square max-h-[70vh]">
          <Canvas shadows camera={{ position: [0, 3, 0] }}>
            <ambientLight intensity={0.2} />
            <directionalLight
              position={[-10, 5, -5]}
              intensity={rank !== null ? 10 : 1}
              color={rank !== null ? "green" : "red"}
            />
            <directionalLight
              position={[10, 2, 5]}
              intensity={2}
              color={rank !== null ? "green" : "#0c8cbf"}
            />

            <spotLight
              position={[6, 1, 5]}
              intensity={2.5}
              penumbra={1}
              angle={0.35}
              castShadow
              color={rank !== null ? "green" : "#0c8cbf"}
            />

            <Buzzer
              onClick={(e) => {
                e.stopPropagation();
                onClick(sound);
              }}
            />

            <ContactShadows
              blur={1.5}
              position-y={-0.49}
              scale={10}
              color={"#444"}
            />
          </Canvas>
        </div>
      </div>

      <div className="w-full flex flex-col md:grid md:grid-cols-2 gap-4 p-4">
        <Button className="w-full flex items-center">
          Vous êtes &nbsp;
          <span className="font-bold">{name}</span>&nbsp;!
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="flex-none flex justify-center items-center aspect-square sm:aspect-auto"
            onClick={() => soundDialogRef.current?.showModal()}
          >
            <Music className="text-red-600" />
            <p className="ml-3 hidden sm:block">Personnaliser</p>
          </Button>

          <Button
            variant="secondary"
            className="flex-1 flex justify-between items-center"
            onClick={onShare}
          >
            <div className="flex items-center">
              Rejoindre avec&nbsp;
              <span className="font-bold">{id}</span>
            </div>
            <Share2 className="text-red-600 ml-3" />
          </Button>
        </div>

        <div className="w-full flex justify-center md:col-span-2">
          {rank ? (
            <p className="text-red-100 text-sm">
              Vous avez appuyé en&nbsp;<span className="font-bold">{rank}</span>
              &nbsp;!
            </p>
          ) : (
            <p className="text-red-100 text-sm">
              Vous devez appuyer sur le bouton pour gagner !
            </p>
          )}
        </div>

        {/* Sound picker dialog */}
        <dialog
          ref={soundDialogRef}
          className="modal modal-bottom sm:modal-middle"
        >
          <div className="max-h-[70%] modal-box flex flex-col gap-4 bg-zinc-800 overflow-y-hidden">
            <h2 className="text-red-50 font-semibold text-2xl">
              Choisir un bruit
            </h2>

            <div className="flex flex-col gap-2 snap-y snap-proximity overflow-y-auto">
              {/** some paddings */}
              <span className="h-4" />

              {available_sounds.map((name) => (
                <div className="w-full flex gap-2 snap-center" key={name}>
                  <Button
                    className="flex-1 flex items-center gap-4"
                    onClick={() => play(name)}
                  >
                    <Play className="w-6 h-6" />

                    {name.split(".")[0]}
                  </Button>

                  <Button
                    className="flex-none flex items-center justify-center aspect-square"
                    onClick={() => {
                      setSound(name);
                      soundDialogRef.current?.close();
                    }}
                  >
                    <Check className="w-6 h-6" />
                  </Button>
                </div>
              ))}

              {/** some paddings */}
              <span className="h-4" />
            </div>
          </div>

          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/party/$id/member")({
  component: Party,
  beforeLoad: async (c) => {
    const { id } = c.params;

    let exists: Response;

    // The request can fail, so we need to catch it
    try {
      // Check if the party exists
      exists = await api.party[":id"].$get({ param: { id } });
    } catch (_) {
      throw redirect({ to: "/", search: { unknown: true } });
    }

    // If the party does not exist, redirect to the home page
    if (exists.status === 404) {
      throw redirect({ to: "/", search: { notFound: true } });
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
    let response: Response;

    try {
      response = await api.party[":id"].$post({ param: { id } });
    } catch (_) {
      throw redirect({ to: "/", search: { unknown: true } });
    }

    // If the request fails, redirect to the home page
    if (!response.ok) {
      throw redirect({ to: "/", search: { unjoinable: true } });
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
});
