import { createLazyFileRoute, Link } from "@tanstack/react-router";

const Index = () => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="h-3/4 flex flex-col justify-between gap-4">
        <h1 className="text-5xl text-red-950 font-bold">Buzz Ta Mère</h1>

        <div className="flex flex-col gap-4">
          <Link to="/party/new">
            <button className="w-full h-16 px-4 py-2 border border-red-400 bg-red-100 rounded-2xl shadow-xl shadow-red-200 text-lg font-semibold active:scale-95 transition ease-in-out duration-300">
              Créer une partie
            </button>
          </Link>

          <Link>
            <button className="w-full h-16 px-4 py-2 bg-red-500 rounded-2xl shadow-xl shadow-red-300 text-lg font-semibold active:scale-95 transition ease-in-out duration-300">
              Rejoindre une partie
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
