import 'phaser';
import { DIFFICULTY } from '../constants';
import TileSprite from '../entities/TileSprite';
import CollectorSprite from '../entities/CollectorSprite';

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

    this.input.setHitArea(this.tileGroup.getChildren()).
      on('gameobjectdown', (pointer: PointerEvent, tileSprite: TileSprite) => {
        // Find selected collected tile
        this.collectorGroup.getChildren().forEach((collectorSprite: CollectorSprite) => {
          if (collectorSprite.selected) {
            collectorSprite.setTexture(tileSprite.textureKey);
          }
        });
      });
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
        this.collectorGroup.add(new CollectorSprite(this, 390, 1150, true));
        break;
    }
  }
}
