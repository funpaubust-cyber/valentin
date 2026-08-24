"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({
  name,
  images,
}: {
  name: string;
  images: string[];
}) {
  const [active, setActive] = useState(0);
  const src = images[active] ?? images[0];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] overflow-hidden bg-cashmere shadow-soft">
        <Image
          key={src}
          src={src}
          alt={name}
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width:768px) 100vw, 50vw"
          quality={90}
        />
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((thumb, i) => {
            const selected = i === active;
            return (
              <button
                key={thumb}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Фото ${i + 1}`}
                aria-pressed={selected}
                className={`relative aspect-square overflow-hidden bg-cashmere outline-none ring-offset-2 ring-offset-cashmere transition ${
                  selected ? "ring-2 ring-brass" : "hover:ring-1 hover:ring-brass/40"
                }`}
              >
                <Image
                  src={thumb}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
