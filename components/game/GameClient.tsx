"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { createGame, type GameHandle } from "./createGame";

const { game: text } = site;

export default function GameClient() {
  const parent = useRef<HTMLDivElement>(null);
  const handle = useRef<GameHandle | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [touch, setTouch] = useState(false);
  const [nearId, setNearId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setTouch(window.matchMedia("(pointer: coarse)").matches);
    let cancelled = false;
    import("phaser")
      .then((module) => {
        if (cancelled || !parent.current) return;
        handle.current = createGame(module.default ?? module, parent.current, {
          onNear: setNearId,
          onInteract: setOpenId,
        });
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
    return () => {
      cancelled = true;
      handle.current?.destroy();
      handle.current = null;
    };
  }, []);

  const dialogOpen = openId !== null || finished;

  useEffect(() => {
    handle.current?.setPaused(dialogOpen);
    if (dialogOpen) closeButton.current?.focus();
  }, [dialogOpen]);

  useEffect(() => {
    if (!dialogOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key.toLowerCase() === "e") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    handle.current?.setFound(found);
  }, [found]);

  function close() {
    if (openId) {
      const next = found.includes(openId) ? found : [...found, openId];
      setFound(next);
      setOpenId(null);
      if (next.length === text.objects.length && found.length !== next.length) setFinished(true);
    } else {
      setFinished(false);
    }
  }

  const near = text.objects.find(({ id }) => id === nearId);
  const open = text.objects.find(({ id }) => id === openId);
  const button = "rounded-lg border border-white/30 px-3 py-2 text-sm text-white bg-black/40";

  return (
    <main className="fixed inset-0 flex flex-col bg-[#1b1420] text-white">
      <header className="flex items-center justify-between gap-3 p-3 text-sm">
        <h1 className="font-semibold">{text.title}</h1>
        <p aria-live="polite">{found.length} / {text.objects.length} {text.foundLabel}</p>
        <Link href="/quick" className={button}>{text.quickLabel}</Link>
      </header>

      <div className="relative flex-1 min-h-0">
        <div ref={parent} className="absolute inset-0" />
        {status !== "ready" && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            {status === "loading" ? (
              <p>{text.loading}</p>
            ) : (
              <p>{text.loadError} <Link href="/quick" className="underline">{text.quickLabel}</Link></p>
            )}
          </div>
        )}
      </div>

      <footer className="flex min-h-16 items-center justify-center p-3 text-center text-sm">
        {near && !dialogOpen ? (
          <button type="button" className={button} onClick={() => handle.current?.interact()}>
            {text.lookAt} {near.name}
          </button>
        ) : (
          <p>{touch ? text.introTouch : text.introKeyboard}</p>
        )}
      </footer>

      {dialogOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open?.name ?? text.finishedTitle}
          className="absolute inset-x-3 bottom-3 mx-auto max-w-xl rounded-xl border-2 border-[#e6b34a] bg-[#2b1d27] p-4"
        >
          <h2 className="font-semibold first-letter:uppercase">{open?.name ?? text.finishedTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed">{open?.line ?? text.finishedLine}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {(open?.links ?? site.links).map(({ label, url }) => (
              <a key={label} href={url} className={button} target="_blank" rel="noreferrer">
                {label}
              </a>
            ))}
            <button ref={closeButton} type="button" className={`${button} ml-auto`} onClick={close}>
              {text.closeLabel}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
