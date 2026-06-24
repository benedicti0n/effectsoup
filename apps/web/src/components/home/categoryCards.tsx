import NextImage from "next/image";
import type { JSX } from "react";

const categories = [
  {
    title: "Print & Grid",
    description:
      "Halftone dots, ordered dither, pixel grids, and riso-style offsets. For that tactile, printed look.",
    image: "/assets/showcase/img6.png",
    presets: "Pixel Grid, Dot Halftone, Mono Dither, Riso Offset"
  },
  {
    title: "ASCII & Symbols",
    description:
      "Turn photos into character art: classic ASCII, block glyphs, cyber terminals, and glowing symbols.",
    image: "/assets/showcase/img2.png",
    presets: "Classic ASCII, Cyber ASCII, Symbol Glow, Luminous Bloom"
  },
  {
    title: "Atmosphere & Glow",
    description:
      "Dreamy glows, duotone washes, noir grain, CRT bloom, and VHS chromatic aberration.",
    image: "/assets/showcase/img3.png",
    presets: "Dream Glow, Duotone, Noir Grain, CRT Dream, VHS Bloom"
  }
];

export function CategoryCards(): JSX.Element {
  return (
    <section className="border-y border-hairline bg-soft-stone/30">
      <div className="mx-auto max-w-container px-4 py-16 lg:px-8 lg:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
            Categories
          </p>
          <h2 className="font-display text-2xl font-medium tracking-tight text-ink-primary md:text-3xl">
            Three families of looks.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.title}
              className="flex flex-col overflow-hidden rounded-sm border border-card-border bg-canvas"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <NextImage
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-2 font-display text-xl font-medium text-ink-primary">
                  {category.title}
                </h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-body-muted">
                  {category.description}
                </p>
                <p className="text-xs font-medium text-muted">Includes: {category.presets}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
