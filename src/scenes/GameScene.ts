import 'phaser';
import { DIFFICULTY, tileTextureKeys } from '../constants';
import TileSprite from '../entities/TileSprite';
import CollectorSprite from '../entities/CollectorSprite';

export default class GameScene extends Phaser.Scene {
  private difficulty: number;
  private tileGroup: Phaser.GameObjects.Group;
  private collectorGroup: Phaser.GameObjects.Group;
  private descendingGroup: Phaser.GameObjects.Group;
  private tileGenerateEvent: Phaser.Time.TimerEvent;
  private score: number;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: any): void {
    this.difficulty = data.difficulty ? data.difficulty : DIFFICULTY.EASY;
  }

  create(): void {
    this.score = 0;
    this.registry.set('score', 0);
    this.tileGroup = this.add.group();
    this.collectorGroup = this.add.group();
    this.descendingGroup = this.add.group();
    this.addTiles();

    this.input.setHitArea(this.tileGroup.getChildren()).
      on('gameobjectdown', (pointer: PointerEvent, tileSprite: TileSprite) => {
        // Find selected collected tile
        this.collectorGroup.getChildren().forEach((collectorSprite: CollectorSprite) => {
          if (collectorSprite.selected) {
            collectorSprite.setTexture(tileSprite.textureKey);
            collectorSprite.textureKey = tileSprite.textureKey;
          }
        });
      });

    this.tileGenerateEvent = this.time.addEvent({
      delay: 2500,
      startAt: 2000,
      callback: this.addDescendingTile,
      callbackScope: this,
      loop: true,
    });

    // Check for collisions
    this.physics.add.overlap(this.descendingGroup, this.collectorGroup, this.checkMatch, null, this);
  }

  checkMatch(incomingTile: TileSprite, collectorTile: CollectorSprite): void {
    if (incomingTile.textureKey === collectorTile.textureKey) {
      this.score++;
      this.registry.set('score', this.score); // Update registry so HUD will be updated
      incomingTile.destroy(true);
    } else {
      // TODO: show game over screen
      this.scene.restart({ difficulty: this.difficulty });
    }
  }

  addTiles(): void {
    switch (this.difficulty) {
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

  addDescendingTile(): void {
    switch (this.difficulty) {
      case DIFFICULTY.EASY:
        // Add player tiles to scene
        const newTile = new TileSprite(this, 390, -150, tileTextureKeys[Phaser.Math.Between(0, 5)]);
        newTile.setVelocityY(Phaser.Math.Between(200, 220));
        this.descendingGroup.add(newTile);
        break;
    }
  }
}
