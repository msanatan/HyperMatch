import 'phaser';
import { DIFFICULTY, tileTextureColours, BALL_RADIUS } from '../constants';
import TileSprite from '../entities/TileSprite';
import CollectorSprite from '../entities/CollectorSprite';

enum STATE {
  PLAYING,
  GAME_OVER,
  TRANSITIONING
}

export default class GameScene extends Phaser.Scene {
  private state: STATE;
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

  create(data: any): void {
    if (data && data.fadeIn) {
      this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    // Remove text listener on HUD if it exists
    // When a scene is stopped, Phaser does not remove event listeners that
    // affect the textbox in HUD. It would crash every time a game was restarted
    if (this.registry.events.listeners('changedata-score').length > 0) {
      this.registry.events.off('changedata-score');
    }

    this.state = STATE.PLAYING;
    this.difficulty = this.registry.get('difficulty');
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

    // Move to the game over scene after the shake effect
    this.cameras.main.on(Phaser.Cameras.Scene2D.Events.SHAKE_COMPLETE, () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
    });
    this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.stop('HUDScene');
      this.scene.start('GameOverScene');
    });
  }

  update(): void {
    switch (this.state) {
      case STATE.GAME_OVER:
        this.cameras.main.shake(500, 0.05, false);
        this.state = STATE.TRANSITIONING;
        break;
      case STATE.PLAYING:
        break;
    }
  }

  checkMatch(incomingTile: TileSprite, collectorTile: CollectorSprite): void {
    if (incomingTile.colour === collectorTile.colour) {
      this.score++;
      this.registry.set('score', this.score); // Update registry so HUD will be updated
      incomingTile.destroy(true);
    } else {
      this.state = STATE.GAME_OVER;
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
          this.tileStartX + this.tileStepX + BALL_RADIUS,
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
