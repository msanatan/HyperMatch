import 'phaser';
import { DIFFICULTY, tileTextureColours } from '../constants';
import TileSprite from '../entities/TileSprite';
import CollectorSprite from '../entities/CollectorSprite';

export default class GameScene extends Phaser.Scene {
  private difficulty: number;
  private tileGroup: Phaser.GameObjects.Group;
  private collectorGroup: Phaser.GameObjects.Group;
  private descendingGroup: Phaser.GameObjects.Group;
  private tileGenerateEvent: Phaser.Time.TimerEvent;
  private score: number;
  private tileStartX: number;
  private tileStepX: number;
  private tileStartY: number;
  private tileStepY: number;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: any): void {
    this.difficulty = data.difficulty ? data.difficulty : DIFFICULTY.EASY;
  }

  create(): void {
    this.score = 0;
    this.tileStartX = 140;
    this.tileStepX = 280;
    this.tileStartY = 1380;
    this.tileStepY = 260;
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
            collectorSprite.updateColour(tileSprite.colour);
          }
        });
      });

    this.tileGenerateEvent = this.time.addEvent({
      delay: 2500,
      startAt: 2000,
      callback: this.addBall,
      callbackScope: this,
      loop: true,
    });

    // Check for collisions
    this.physics.add.overlap(this.descendingGroup, this.collectorGroup, this.checkMatch, null, this);
  }

  checkMatch(incomingTile: TileSprite, collectorTile: CollectorSprite): void {
    if (incomingTile.colour === collectorTile.colour) {
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
        for (let i = 0; i < 6; i++) {
          let row = Math.floor(i / 3);
          let col = i >= 3 ? i % 3 : i;
          const colour = tileTextureColours[i];
          this.tileGroup.add(new TileSprite(
            this,
            this.tileStartX + (col * this.tileStepX),
            this.tileStartY + (row * this.tileStepY),
            colour.tile,
            colour)
          );
        }

        // Add collector tile
        this.collectorGroup.add(new CollectorSprite(
          this,
          this.tileStartX + this.tileStepX,
          this.tileStartY - this.tileStepY, true));
        break;
    }
  }

  addBall(): void {
    switch (this.difficulty) {
      case DIFFICULTY.EASY:
        const colour = tileTextureColours[Phaser.Math.Between(0, 5)];
        // Add player tiles to scene
        const newTile = new TileSprite(
          this,
          this.tileStartX + this.tileStepX + 75,
          -150,
          colour.ball,
          colour
        );
        newTile.setVelocityY(Phaser.Math.Between(200, 220));
        this.descendingGroup.add(newTile);
        break;
    }
  }
}
