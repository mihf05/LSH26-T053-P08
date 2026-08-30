/**
 * Images and vectors exported from the Figma design (file QMI63rM4YzUCDpN91OtS6Z,
 * node 1:265 "Desktop"). The files live in public/landing; run
 * `npm run assets:landing` to download them, or export them from Figma by hand
 * using the sizes below.
 *
 * `node` is the Figma node the asset belongs to, kept so an asset can be traced
 * back to the layer it came from.
 */
export type LandingAsset = {
  file: string;
  /** Figma asset id, used by scripts/fetch-figma-assets.mjs. */
  id: string;
  format: "png" | "svg";
  /** Intended rendered size in CSS pixels at the 1280px desktop breakpoint. */
  width: number;
  height: number;
  node: string;
  description: string;
};

export const LANDING_ASSETS: LandingAsset[] = [
  {
    file: "hero.png",
    id: "8e2dd113-d801-4d41-b661-5b8fb95ca985",
    format: "png",
    width: 960,
    height: 608,
    node: "1:278",
    description: "Hero product screenshot",
  },
  {
    file: "feature.png",
    id: "834d3a97-974d-40e1-adb6-f6fbc40636a3",
    format: "png",
    width: 693,
    height: 502,
    node: "1:282",
    description: "Feature section image",
  },
  {
    file: "values-bg.png",
    id: "f88b5920-29f2-43ee-a51e-4ffd5f97c97d",
    format: "png",
    width: 1280,
    height: 678,
    node: "1:306",
    description: "Values section background",
  },
  {
    file: "case-study.png",
    id: "64642090-c005-4fcb-afa4-3eb30ab6bc8e",
    format: "png",
    width: 498,
    height: 280,
    node: "1:316",
    description: "Case study image",
  },
  {
    file: "journal-1.png",
    id: "a018e601-a6eb-4d7b-825c-01db7a47f151",
    format: "png",
    width: 165,
    height: 100,
    node: "1:326",
    description: "Journal item 1 thumbnail",
  },
  {
    file: "journal-2.png",
    id: "ce8b5eae-653f-48b8-8b4f-5d565d1c0e29",
    format: "png",
    width: 165,
    height: 100,
    node: "1:327",
    description: "Journal item 2 thumbnail",
  },
  {
    file: "journal-3.png",
    id: "f24e9bcf-d8dd-4197-80b6-1d17fa81ae20",
    format: "png",
    width: 165,
    height: 100,
    node: "1:328",
    description: "Journal item 3 thumbnail",
  },
  {
    file: "testimonial.png",
    id: "835fee55-598c-4660-801f-2d2c4e244688",
    format: "png",
    width: 612,
    height: 700,
    node: "1:371",
    description: "Testimonial portrait",
  },
  {
    file: "footer-texture.png",
    id: "1c7e17d0-302b-459c-a5ef-72022aa027f0",
    format: "png",
    width: 1240,
    height: 280,
    node: "I1:379;4:4913",
    description: "Footer texture band",
  },
  {
    file: "icon-1.svg",
    id: "6a9edb52-2a51-47c6-9499-b1aa2244114b",
    format: "svg",
    width: 42,
    height: 42,
    node: "1:311",
    description: "Value card 1 icon",
  },
  {
    file: "icon-2.svg",
    id: "fa771496-8d9e-46f3-8b86-b331b93024b2",
    format: "svg",
    width: 42,
    height: 42,
    node: "1:312",
    description: "Value card 2 icon",
  },
  {
    file: "icon-3.svg",
    id: "7b80f80a-99e2-4cd0-a76e-8be2d84a10d7",
    format: "svg",
    width: 42,
    height: 42,
    node: "1:313",
    description: "Value card 3 icon",
  },
  {
    file: "sticker.svg",
    id: "48265dd1-b4a6-4d8d-a2b3-4571484e9b52",
    format: "svg",
    width: 400,
    height: 154,
    node: "1:331",
    description: "Rotated sticker over the journal list",
  },
  {
    file: "quotation.svg",
    id: "acd39646-1e2c-4e95-be43-9e2925a80fee",
    format: "svg",
    width: 24,
    height: 20,
    node: "1:373",
    description: "Quotation mark",
  },
  {
    file: "arrow.svg",
    id: "75a9ab88-eccc-4c83-80f6-07876d499150",
    format: "svg",
    width: 9,
    height: 11.225,
    node: "I1:380;3:1631;15:3988",
    description: "Nav link arrow",
  },
];

/** Public path for a landing asset, by file name. */
export const asset = (file: string) => `/landing/${file}`;
