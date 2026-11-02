"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { createAudio, type EqBand, type GameAudio } from "./audio";
import { createGame, type GameHandle } from "./createGame";

const { game: text } = site;
const button = "rounded-lg border border-white/30 px-3 py-2 text-sm text-white bg-black/40";
const primary = "rounded-lg border border-[#e6b34a] px-3 py-2 text-sm text-white bg-[#7c3f3a] disabled:opacity-50";

function EqCurve({ gains }: { gains: number[] }) {
  const points = [
    [0, 30 - gains[0] * 2],
    [40, 30 - gains[0] * 2],
    [100, 30 - gains[1] * 2],
    [160, 30 - gains[2] * 2],
    [200, 30 - gains[2] * 2],
  ];
  const [start, ...rest] = points;
  const path = `M ${start.join(" ")} ` + rest.map((point) => `L ${point.join(" ")}`).join(" ");
  return (
    <svg viewBox="0 0 200 60" className="h-16 w-full rounded bg-[#1b1420]" aria-hidden="true">
      <line x1="0" x2="200" y1="30" y2="30" stroke="#ffffff33" />
      <path d={path} fill="none" stroke="#e6b34a" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export default function GameClient() {
  const parent = useRef<HTMLDivElement>(null);
  const handle = useRef<GameHandle | null>(null);
  const audio = useRef<GameAudio | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const startButton = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [started, setStarted] = useState(false);
  const [touch, setTouch] = useState(false);
  const [sound, setSound] = useState(false);
  const [nearId, setNearId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [typed, setTyped] = useState(0);
  const [gains, setGains] = useState([0, 0, 0]);
  const [dmSent, setDmSent] = useState(false);
  const [swirled, setSwirled] = useState(false);

  useEffect(() => {
    setTouch(window.matchMedia("(pointer: coarse)").matches);
    audio.current = createAudio();
    let cancelled = false;
    import("phaser")
      .then((module) => {
        if (cancelled || !parent.current) return;
        handle.current = createGame(module.default ?? module, parent.current, {
          onNear: setNearId,
          onInteract: (id) => {
            audio.current?.click();
            setOpenId(id);
          },
          onStep: () => audio.current?.step(),
        });
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
    return () => {
      cancelled = true;
      handle.current?.destroy();
      handle.current = null;
      audio.current?.destroy();
    };
  }, []);

  const dialogOpen = openId !== null || finished;
  const playing = started && !dialogOpen;

  useEffect(() => {
    handle.current?.setPaused(!playing);
    if (dialogOpen) closeButton.current?.focus();
    else if (!started && status === "ready") startButton.current?.focus();
  }, [playing, dialogOpen, started, status]);

  const open = text.objects.find(({ id }) => id === openId);
  const line = dialogOpen ? (open?.line ?? text.finishedLine) : "";

  useEffect(() => {
    if (!line || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(line.length);
      return;
    }
    setTyped(0);
    const timer = window.setInterval(() => {
      setTyped((count) => {
        if (count >= line.length) window.clearInterval(timer);
        return count + 1;
      });
    }, 14);
    return () => window.clearInterval(timer);
  }, [line]);

  useEffect(() => {
    if (!dialogOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key.toLowerCase() === "e") {
        if (typed < line.length) setTyped(line.length);
        else close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    handle.current?.setDone(done);
  }, [done]);

  function complete(id: string) {
    if (done.includes(id)) return;
    audio.current?.chime();
    setDone([...done, id]);
  }

  function toggleSound() {
    const next = !sound;
    setSound(next);
    audio.current?.setEnabled(next);
  }

  function changeEq(band: EqBand, value: number) {
    const next = [...gains];
    next[band] = value;
    setGains(next);
    audio.current?.setEq(band, value);
    complete("mixer");
  }

  function close() {
    if (openId === "door" && done.includes("door")) setFinished(true);
    if (openId) setOpenId(null);
    else setFinished(false);
  }

  function runAction(id: string) {
    if (id === "computer") setDmSent(true);
    if (id === "mead") {
      setSwirled(true);
      handle.current?.swirl();
    }
    if (id === "door") handle.current?.setNight(true);
    complete(id);
  }

  const near = text.objects.find(({ id }) => id === nearId);
  const otherJobsDone = text.objects.every(({ id }) => id === "door" || done.includes(id));

  return (
    <main className="fixed inset-0 flex flex-col bg-[#1b1420] text-white">
      <header className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
        <h1 className="font-semibold">{text.title}</h1>
        <div className="flex items-center gap-2">
          <button type="button" className={button} aria-pressed={sound} onClick={toggleSound}>
            {sound ? text.soundOn : text.soundOff}
          </button>
          <Link href="/quick" className={button}>{text.quickLabel}</Link>
        </div>
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

        {started && (
          <section
            aria-label={text.checklistLabel}
            className="absolute left-2 top-2 rounded-lg bg-black/70 p-2 text-xs"
          >
            <h2 className="mb-1 font-semibold">{text.checklistLabel}</h2>
            <ul className="space-y-0.5">
              {text.objects.map(({ id, task }) => (
                <li key={id} className={done.includes(id) ? "text-[#ffe08a] line-through" : ""}>
                  {task}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <footer className="flex min-h-14 items-center justify-center p-2 text-center text-sm">
        {near && playing ? (
          <button type="button" className={button} onClick={() => handle.current?.interact()}>
            {text.lookAt} {near.name}
          </button>
        ) : (
          <p>{touch ? text.introTouch : text.introKeyboard}</p>
        )}
      </footer>

      {status === "ready" && !started && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={text.title}
            className="max-w-sm rounded-xl border-2 border-[#e6b34a] bg-[#2b1d27] p-5 text-center"
          >
            <h2 className="text-xl font-bold">{text.title}</h2>
            <p className="mt-2">{text.goal}</p>
            <p className="mt-2 text-sm text-white/80">{touch ? text.introTouch : text.introKeyboard}</p>
            <div className="mt-4 flex justify-center gap-2">
              <button ref={startButton} type="button" className={primary} onClick={() => setStarted(true)}>
                {text.startLabel}
              </button>
              <Link href="/quick" className={button}>{text.quickLabel}</Link>
            </div>
          </div>
        </div>
      )}

      {dialogOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open?.name ?? text.finishedTitle}
          className="absolute inset-x-3 bottom-3 mx-auto max-w-xl rounded-xl border-2 border-[#e6b34a] bg-[#2b1d27] p-4"
        >
          <h2 className="font-semibold first-letter:uppercase">{open?.name ?? text.finishedTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed">
            <span className="sr-only">{line}</span>
            <span aria-hidden="true">
              {line.slice(0, typed)}
              <span className="invisible">{line.slice(typed)}</span>
            </span>
          </p>

          {openId === "computer" && dmSent && (
            <div className="mt-3 flex items-center gap-2 text-xs" aria-hidden="true">
              <span className="rounded bg-[#4f7a9d] px-2 py-1">{text.dm.from}</span>
              <span className="relative h-1 flex-1 overflow-hidden rounded bg-white/20">
                <span className="absolute inset-y-0 left-0 w-full origin-left animate-[pulse_1s_ease-in-out_2] bg-[#ffe08a]" />
              </span>
              <span className="rounded bg-[#5f8f5f] px-2 py-1">{text.dm.to}: {text.dm.message}</span>
            </div>
          )}

          {openId === "mixer" && (
            <div className="mt-3 space-y-2">
              <EqCurve gains={gains} />
              <div className="grid grid-cols-3 gap-3">
                {text.eq.bands.map((label, index) => (
                  <label key={label} className="text-xs">
                    {label}
                    <input
                      type="range"
                      min={-12}
                      max={12}
                      value={gains[index]}
                      className="w-full"
                      onChange={(event) => changeEq(index as EqBand, Number(event.target.value))}
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {openId === "mead" && swirled && (
            <p className="mt-2 text-lg tracking-widest text-[#ffe08a]" aria-hidden="true">
              <span className="inline-block animate-bounce">o</span>{" "}
              <span className="inline-block animate-bounce [animation-delay:150ms]">O</span>{" "}
              <span className="inline-block animate-bounce [animation-delay:300ms]">o</span>
            </p>
          )}

          {openId === "door" && !otherJobsDone && (
            <p className="mt-2 text-xs text-[#ffe08a]">{text.doorLocked}</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {open && open.action && !done.includes(open.id) && (
              <button
                type="button"
                className={primary}
                disabled={open.id === "door" && !otherJobsDone}
                onClick={() => runAction(open.id)}
              >
                {open.action}
              </button>
            )}
            {openId === "mixer" && (
              <button type="button" className={primary} onClick={() => { toggleSound(); complete("mixer"); }}>
                {sound ? text.eq.stop : text.eq.play}
              </button>
            )}
            {(open?.links ?? site.links).map(({ label, url }) => (
              <a key={label} href={url} className={button} target="_blank" rel="noreferrer">
                {label}
              </a>
            ))}
            {finished && (
              <button type="button" className={primary} onClick={() => window.location.reload()}>
                {text.replayLabel}
              </button>
            )}
            <button ref={closeButton} type="button" className={`${button} ml-auto`} onClick={close}>
              {text.closeLabel}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
