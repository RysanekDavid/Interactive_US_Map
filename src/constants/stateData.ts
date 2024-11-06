// src/constants/stateData.ts

interface StateMetadata {
  capital: string;
  population: number;
  yearJoined: number;
  nickname: string;
}

export const stateData: Record<string, StateMetadata> = {
  Alabama: {
    capital: "Montgomery",
    population: 5024279,
    yearJoined: 1819,
    nickname: "Yellowhammer State",
  },
  Alaska: {
    capital: "Juneau",
    population: 733391,
    yearJoined: 1959,
    nickname: "The Last Frontier",
  },
  Arizona: {
    capital: "Phoenix",
    population: 7151502,
    yearJoined: 1912,
    nickname: "The Grand Canyon State",
  },
  California: {
    capital: "Sacramento",
    population: 39538223,
    yearJoined: 1850,
    nickname: "The Golden State",
  },
  Colorado: {
    capital: "Denver",
    population: 5773714,
    yearJoined: 1876,
    nickname: "The Centennial State",
  },
  // Přidejte další státy...
};
