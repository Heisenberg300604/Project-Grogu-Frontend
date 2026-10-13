"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useParams } from "next/navigation";

import { GameForm } from "@/components/games/game-form";
import { GameKeysPanel } from "@/components/games/game-keys-panel";
import { Button } from "@/components/ui/button";
import { EmptyState, PageSkeleton } from "@/components/ui/states";
import { useGame } from "@/lib/hooks/use-grogu";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useSession } from "@/lib/hooks/use-session";

export default function EditGamePage() {
  const params = useParams<{ id: string }>();
  const hydrated = useHydrated();
  const { user } = useSession();
  const game = useGame(params.id);

  if (!hydrated || !user) return <PageSkeleton />;

  if (!game || game.developerId !== user.id) {
    return (
      <EmptyState
        icon={Lock}
        title="Game not found"
        description="This game doesn't exist or belongs to another studio."
        action={
          <Button asChild size="sm" variant="secondary">
            <Link href="/developer/games">Back to games</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <GameForm initialGame={game} />
      {/* Lines up with the form's main column, beside its 19rem preview rail. */}
      <div className="lg:mr-[21.5rem]">
        <GameKeysPanel game={game} />
      </div>
    </div>
  );
}