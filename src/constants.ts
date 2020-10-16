import MenuItem from "./entities/MenuItem";

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

// Text configurations
export const titleTextConfig = {
  fontFamily: 'Gugi Regular, Helvetica, Arial',
  fontSize: '144px',
  color: '#FFFFFF',
};

export const subtitleTextConfig = {
  fontFamily: 'Gugi Regular, Helvetica, Arial',
  fontSize: '104px',
  color: '#FFFFFF',
};

export const btnTextConfig = {
  fontFamily: 'Gugi Regular, Helvetica, Arial',
  fontSize: '80px',
  color: '#FFFFFF',
};

export const hudTextConfig = {
  fontFamily: 'Gugi Regular, Helvetica, Arial',
  fontSize: '64px',
  color: '#FFFFFF',
};

// Is a function that returns a function to alter a game object's font size
export const changeFontSize: Function = (newSize: number): Function => {
  return (pointer: PointerEvent, btnMenu: MenuItem) => {
    console.log(btnMenu);
    btnMenu.setFontSize(newSize);
  };
}