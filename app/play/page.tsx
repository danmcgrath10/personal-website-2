import type { Metadata } from "next";
import GameClient from "@/components/game/GameClient";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `${site.game.title} | ${site.name}`,
  description: `A small game about ${site.name}. Prefer plain text? Use the Quick version.`,
  robots: { index: false },
};

export default function Play() {
  return <GameClient />;
}
