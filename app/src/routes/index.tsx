import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import IntroScene from "../components/intro-scene";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { z } from "zod";

const Index = () => {
  // Search params
  const { notFound, unjoinable, unknown } = useSearch({ from: "/" });

  // The party code
  const [code, setCode] = useState<string>("");

  // Retrieve the navigate function
  const navigate = useNavigate({ from: "/" });

  // clear the toasts after 3 seconds
  useEffect(() => {
    if (!notFound && !unjoinable && !unknown) {
      return;
    }

    const timeout = setTimeout(() => {
      navigate({ to: "/" });
    }, 3000);

    return () => clearTimeout(timeout);
  }, [notFound, unjoinable, unknown, navigate]);

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="h-3/4 flex flex-col items-center justify-between gap-4">
        <h1 className="text-5xl text-red-900 font-['Poppins'] font-bold">
          {import.meta.env.VITE_APP_NAME}
        </h1>

        <IntroScene />

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Code de la partie"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <Link
              to="/party/$id/member"
              params={{ id: code }}
              disabled={code === ""}
            >
              <Button className="aspect-square">
                <LogIn className="text-red-100" />
              </Button>
            </Link>
          </div>

          <p className="self-center text-red-200 font-semibold text-xs">OU</p>

          <Link to="/party/new">
            <Button className="w-full" variant="secondary">
              Créer une partie
            </Button>
          </Link>
        </div>
      </div>

      <div className="toast toast-center">
        {notFound ? (
          <div className="alert alert-error bg-red-700">
            <span className="text-red-50">Cette partie n'existe pas !</span>
          </div>
        ) : null}

        {unjoinable ? (
          <div className="alert alert-error bg-red-700">
            <span className="text-red-50">
              Cette partie n'est pas accessible !
            </span>
          </div>
        ) : null}

        {unknown ? (
          <div className="alert alert-error bg-red-700">
            <span className="text-red-50">
              Une erreur inconnue est survenue !
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const query_params = z.object({
  notFound: z.boolean().optional(),
  unjoinable: z.boolean().optional(),
  unknown: z.unknown().optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: (s) => query_params.parse(s),
  component: Index,
});
