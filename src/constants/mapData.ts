import { PoliticalCategory } from "../types/map";

export const stateAbbreviations: { [key: string]: string } = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
};

export const statePolitics: { [key: string]: PoliticalCategory } = {
  // Solid Democratic states
  California: "solid-dem",
  Washington: "solid-dem",
  Illinois: "solid-dem",
  "New York": "solid-dem",
  Maine: "solid-dem",
  Vermont: "solid-dem",
  Massachusetts: "solid-dem",
  "Rhode Island": "solid-dem",
  Connecticut: "solid-dem",
  "New Jersey": "solid-dem",
  Delaware: "solid-dem",
  Maryland: "solid-dem",
  Hawaii: "solid-dem",

  // Lean Democratic states
  Oregon: "lean-dem",
  "New Mexico": "lean-dem",
  Colorado: "lean-dem",
  Virginia: "lean-dem",
  Minnesota: "lean-dem",
  "New Hampshire": "lean-dem",

  // Swing states
  Nevada: "swing",
  Arizona: "swing",
  Wisconsin: "swing",
  Michigan: "swing",
  Pennsylvania: "swing",
  "North Carolina": "swing",
  Georgia: "swing",

  // Lean Republican states
  Florida: "lean-rep",
  Texas: "lean-rep",
  Ohio: "lean-rep",
  Iowa: "lean-rep",

  // Solid Republican states
  Idaho: "solid-rep",
  Montana: "solid-rep",
  Wyoming: "solid-rep",
  Utah: "solid-rep",
  "North Dakota": "solid-rep",
  "South Dakota": "solid-rep",
  Nebraska: "solid-rep",
  Kansas: "solid-rep",
  Oklahoma: "solid-rep",
  Missouri: "solid-rep",
  Arkansas: "solid-rep",
  Louisiana: "solid-rep",
  Mississippi: "solid-rep",
  Alabama: "solid-rep",
  Tennessee: "solid-rep",
  Kentucky: "solid-rep",
  Indiana: "solid-rep",
  "West Virginia": "solid-rep",
  "South Carolina": "solid-rep",
  Alaska: "solid-rep",
};

// Electoral votes for each state (2024)
export const electoralVotes: { [key: string]: number } = {
  California: 54,
  Texas: 40,
  Florida: 30,
  "New York": 28,
  Illinois: 19,
  Pennsylvania: 19,
  Ohio: 17,
  Georgia: 16,
  Michigan: 15,
  "North Carolina": 16,
  "New Jersey": 14,
  Virginia: 13,
  Washington: 12,
  Arizona: 11,
  Tennessee: 11,
  Massachusetts: 11,
  Indiana: 11,
  Maryland: 10,
  Minnesota: 10,
  Missouri: 10,
  Wisconsin: 10,
  Colorado: 10,
  Alabama: 9,
  "South Carolina": 9,
  Louisiana: 8,
  Kentucky: 8,
  Oregon: 8,
  Oklahoma: 7,
  Connecticut: 7,
  Utah: 6,
  Iowa: 6,
  Nevada: 6,
  Arkansas: 6,
  Mississippi: 6,
  Kansas: 6,
  "New Mexico": 5,
  Nebraska: 5,
  Idaho: 4,
  "West Virginia": 4,
  Hawaii: 4,
  "New Hampshire": 4,
  Maine: 4,
  Montana: 4,
  "Rhode Island": 4,
  Delaware: 3,
  "South Dakota": 3,
  "North Dakota": 3,
  Alaska: 3,
  Vermont: 3,
  Wyoming: 3,
};

// Population data (2020 Census)
export const statePopulations: { [key: string]: number } = {
  California: 39538223,
  Texas: 29145505,
  Florida: 21538187,
  "New York": 20201249,
  Illinois: 12801989,
  Pennsylvania: 13002700,
  Ohio: 11799448,
  Georgia: 10711908,
  Michigan: 10077331,
  "North Carolina": 10439388,
  // ... další státy můžeme přidat podle potřeby
};

// Gubernatorial party control
export type PartyAffiliation = "D" | "R" | "I";

export const stateGovernors: { [key: string]: PartyAffiliation } = {
  California: "D",
  Texas: "R",
  Florida: "R",
  "New York": "D",
  Illinois: "D",
  Pennsylvania: "D",
  Ohio: "R",
  Georgia: "R",
  Michigan: "D",
  "North Carolina": "D",
  // ... další státy můžeme přidat podle potřeby
};