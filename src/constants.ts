export enum DIFFICULTY {
  EASY,
  MEDIUM,
  HARD
}

export interface TextureColourMap {
  name: string;
  tile?: string;
  collector: string;
}

export const tileTextureColours: TextureColourMap[] = [
  { name: 'red', tile: 'redTile', collector: 'collectorRedTile' },
  { name: 'blue', tile: 'blueTile', collector: 'collectorBlueTile' },
  { name: 'yellow', tile: 'yellowTile', collector: 'collectorYellowTile' },
  { name: 'green', tile: 'greenTile', collector: 'collectorGreenTile' },
  { name: 'purple', tile: 'purpleTile', collector: 'collectorPurpleTile' },
  { name: 'grey', tile: 'greyTile', collector: 'collectorGreyTile' },
  { name: 'orange', tile: 'orangeTile', collector: 'collectorOrangeTile' },
  { name: 'pink', tile: 'pinkTile', collector: 'collectorPinkTile' },
  { name: 'brown', tile: 'brownTile', collector: 'collectorBrownTile' },
  { name: 'black', collector: 'collectorBlackTile' }
];
