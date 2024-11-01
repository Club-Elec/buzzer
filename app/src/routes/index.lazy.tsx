import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [code, setCode] = useState<string>("");

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="h-3/4 flex flex-col justify-between gap-4">
        <h1 className="text-5xl text-blue-950 font-bold">Buzz Ta Mère</h1>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              className="w-full h-16 px-4 py-2 bg-blue-200 border border-blue-400 rounded-2xl shadow-xl shadow-blue-200 text-lg font-semibold"
              placeholder="Code de la partie"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <Link to="/party/$id/member" params={{ id: code }}>
              <button className="h-16 aspect-square flex items-center justify-center bg-blue-500 border border-blue-700 rounded-2xl shadow-xl shadow-blue-300 text-lg font-semibold active:scale-95 transition ease-in-out duration-300">
                <LogIn className="text-blue-950" />
              </button>
            </Link>
          </div>

          <Link to="/party/new">
            <button className="w-full h-16 px-4 py-2 bg-blue-200 border border-blue-400 rounded-2xl shadow-xl shadow-blue-300 text-lg font-semibold active:scale-95 transition ease-in-out duration-300">
              Créer une partie
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute("/")({
  component: Index,
});
