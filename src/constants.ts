export enum DIFFICULTY {
  EASY,
  MEDIUM,
  HARD
}

export const BALL_RADIUS: number = 65;

export interface TextureColourMap {
  name: string;
  tile?: string;
  ball?: string;
  collector: string;
}

export const tileTextureColours: TextureColourMap[] = [
  { name: 'red', tile: 'redTile', collector: 'collectorRedTile', ball: 'redBall' },
  { name: 'blue', tile: 'blueTile', collector: 'collectorBlueTile', ball: 'blueBall' },
  { name: 'yellow', tile: 'yellowTile', collector: 'collectorYellowTile', ball: 'yellowBall' },
  { name: 'green', tile: 'greenTile', collector: 'collectorGreenTile', ball: 'greenBall' },
  { name: 'purple', tile: 'purpleTile', collector: 'collectorPurpleTile', ball: 'purpleBall' },
  { name: 'grey', tile: 'greyTile', collector: 'collectorGreyTile', ball: 'greyBall' },
  { name: 'orange', tile: 'orangeTile', collector: 'collectorOrangeTile', ball: 'orangeBall' },
  { name: 'pink', tile: 'pinkTile', collector: 'collectorPinkTile', ball: 'pinkBall' },
  { name: 'brown', tile: 'brownTile', collector: 'collectorBrownTile', ball: 'brownBall' },
  { name: 'black', collector: 'collectorBlackTile' }
];
