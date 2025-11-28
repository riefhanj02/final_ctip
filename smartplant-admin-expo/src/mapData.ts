// src/mapData.ts
// Sample data for map sightings

export const FILTERS = ["All", "Common", "Rare"];

export const KUCHING_CENTER = {
  lat: 1.5556,
  lng: 110.3444,
};

export type Sighting = {
  id: string;
  title: string;
  sub: string;
  rarity: "Common" | "Rare";
  habitat: "Mangrove" | "Lowland" | "Montane";
  distance: string;
  coord: { lat: number; lng: number };
  updatedAt: number;
  isMasked?: boolean;
  maskedCoord?: { lat: number; lng: number };
};

export const SIGHTINGS: Sighting[] = [
  {
    id: "1",
    title: "Shorea macrophylla",
    sub: "Engkabang Jantong • Rare",
    rarity: "Rare",
    habitat: "Lowland",
    distance: "2.4 km",
    coord: { lat: 1.5589, lng: 110.3489 },
    updatedAt: Date.now() - 1000 * 60 * 30, // 30 min ago
  },
  {
    id: "2",
    title: "Rhizophora apiculata",
    sub: "Bakau Minyak • Common",
    rarity: "Common",
    habitat: "Mangrove",
    distance: "5.1 km",
    coord: { lat: 1.5623, lng: 110.3521 },
    updatedAt: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
  },
  {
    id: "3",
    title: "Dipterocarpus alatus",
    sub: "Keruing • Rare",
    rarity: "Rare",
    habitat: "Lowland",
    distance: "8.7 km",
    coord: { lat: 1.5512, lng: 110.3367 },
    updatedAt: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
  },
  {
    id: "4",
    title: "Avicennia marina",
    sub: "Api-api Putih • Common",
    rarity: "Common",
    habitat: "Mangrove",
    distance: "3.9 km",
    coord: { lat: 1.5601, lng: 110.3456 },
    updatedAt: Date.now() - 1000 * 60 * 60 * 12, // 12 hours ago
  },
  {
    id: "5",
    title: "Rhododendron lowii",
    sub: "Montane species • Rare",
    rarity: "Rare",
    habitat: "Montane",
    distance: "15.2 km",
    coord: { lat: 1.5456, lng: 110.3289 },
    updatedAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
  },
];

export function rarityColor(rarity: "Common" | "Rare"): string {
  return rarity === "Rare" ? "red" : "blue";
}


