"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState, useMemo } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    id: number;
    title: string;
    desc: string;
    className?: string;
    thumbnail: string;
    company: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
  company?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  // Instead of cloning DOM nodes, compute a duplicated items array
  const duplicatedItems = useMemo(() => [...items, ...items], [items]);

  useEffect(() => {
    if (containerRef.current) {
      // Set CSS variables based on direction and speed props
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
      const duration = speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
      containerRef.current.style.setProperty("--animation-duration", duration);

      // Mark animation as started (this adds the animate-scroll class)
      setStart(true);
    }
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden [mask-img:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        className={cn(
          "flex min-w-full shrink-0 gap-16 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {duplicatedItems.map((item, index) => (
          <li
            key={`${item.id}-${index}`}
            className="max-w-[50vw] xl:max-w-[40vw] relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-800 p-5 md:p-16 py-6 md:w-[60vw]"
            style={{
              background: "rgb(4,7,29)",
              backgroundImage:
                "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
            }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-100">
                  {item.title}
                </h3>
                <h4 className="text-md font-thin text-gray-300">
                  {item.company}
                </h4>
                <p className="mt-2 text-sm text-gray-400">{item.desc}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
