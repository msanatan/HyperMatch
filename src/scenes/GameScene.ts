import 'phaser';
import { DIFFICULTY } from '../constants';
import TileSprite from '../entities/TileSprite';

export default class GameScene extends Phaser.Scene {
  private difficulty: number;
  private tileGroup: Phaser.GameObjects.Group;
  private collectorGroup: Phaser.GameObjects.Group;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: any): void {
    this.difficulty = data.difficulty ? data.difficulty : DIFFICULTY.EASY;
  }

  create(): void {
    this.tileGroup = this.add.group();
    this.collectorGroup = this.add.group();
    this.addTiles(this.difficulty);
  }

  addTiles(difficulty: number): void {
    switch (difficulty) {
      case DIFFICULTY.EASY:
        // Add player tiles to scene
        this.tileGroup.add(new TileSprite(this, 70, 1420, 'redTile'));
        this.tileGroup.add(new TileSprite(this, 390, 1420, 'blueTile'));
        this.tileGroup.add(new TileSprite(this, 710, 1420, 'yellowTile'));
        this.tileGroup.add(new TileSprite(this, 70, 1635, 'greenTile'));
        this.tileGroup.add(new TileSprite(this, 390, 1635, 'purpleTile'));
        this.tileGroup.add(new TileSprite(this, 710, 1635, 'greyTile'));

        // Add collector tile
        this.collectorGroup.add(new TileSprite(this, 390, 1150, 'blackTile'));
        break;
    }
  }
}
