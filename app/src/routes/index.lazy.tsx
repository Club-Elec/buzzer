import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { useState } from "react";
import IntroScene from "../components/intro-scene";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Index = () => {
  const [code, setCode] = useState<string>("");

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

            <Link to="/party/$id/member" params={{ id: code }}>
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
    </div>
  );
};

export const Route = createLazyFileRoute("/")({
  component: Index,
});
