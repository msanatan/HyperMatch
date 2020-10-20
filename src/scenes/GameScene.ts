import 'phaser';
import {
  DIFFICULTY, tileTextureColours, BALL_RADIUS, TextureColourMap,
  DIRECTION, TILE_WDITH, CAMERA_SHAKE_DURATION, CAMERA_FADE_DURATION
} from '../constants';
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
  private dropBallEvents: Phaser.Time.TimerEvent[];
  private pauseButton: Phaser.GameObjects.Sprite;
  private tileInputHandler: Function;
  private score: number;
  private tileStartX: number;
  private tileStepX: number;
  private tileStartY: number;
  private tileStepY: number;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(data: any): void {
    if (data?.fadeIn) {
      this.cameras.main.fadeIn(CAMERA_FADE_DURATION, 0, 0, 0);
    }

    // Remove text listener on HUD if it exists
    // When a scene is stopped, Phaser does not remove event listeners that
    // affect the textbox in HUD. It would crash every time a game was restarted
    if (this.registry.events.listeners('changedata-score').length > 0) {
      this.registry.events.off('changedata-score');
    }

    this.state = STATE.PLAYING;
    this.dropBallEvents = [];
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

    this.tileInputHandler = (pointer: PointerEvent, tileSprite: Phaser.GameObjects.GameObject) => {
      switch (tileSprite.constructor) {
        case CollectorSprite:
          this.collectorGroup.getChildren().forEach((tile: CollectorSprite) => {
            if (tile.selected) {
              tile.unselect();
            }
          });

          (<CollectorSprite>tileSprite).select();
          break;
        case TileSprite:
          // Find selected collected tile
          this.collectorGroup.getChildren().forEach((collectorSprite: CollectorSprite) => {
            if (collectorSprite.selected) {
              collectorSprite.updateColour((<TileSprite>tileSprite).colour);
            }
          });
          break;
        default:
          console.debug('Ignore other item being hit')
      }
    };

    this.input.on('gameobjectdown', this.tileInputHandler);

    // Check for collisions
    this.physics.add.overlap(this.descendingGroup, this.collectorGroup, this.checkMatch, null, this);

    // Move to the game over scene after the shake and fade out effects
    this.cameras.main.on(Phaser.Cameras.Scene2D.Events.SHAKE_COMPLETE, () => {
      this.cameras.main.fadeOut(CAMERA_FADE_DURATION, 0, 0, 0);
    });
    this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.stop('HUDScene');
      this.scene.start('GameOverScene');
    });

    // Add pause button
    this.pauseButton = this.add.sprite(100, 125, 'btnPause');
    this.pauseButton.setOrigin(0.5);
    this.pauseButton.setScale(0.4, 0.4);
    this.pauseButton.setInteractive();
    this.pauseButton.on('pointerdown', () => {
      this.input.off('gameobjectdown', this.tileInputHandler);
      this.pauseButton.setVisible(false);
      this.scene.pause();
      this.scene.run('PausedScene');
    });

    // Re-add tile pointer handler when scene is resumed
    this.events.on('resume', () => {
      this.input.on('gameobjectdown', this.tileInputHandler);
      this.pauseButton.setVisible(true);
    });

    if (this.difficulty === DIFFICULTY.HARD) {
      // Add two timers to drop balls
      this.dropBallEvents.push(
        this.time.addEvent({
          delay: 3000,
          startAt: 2500,
          callback: this.addBall,
          args: [DIRECTION.LEFT],
          callbackScope: this,
          loop: true,
        })
      );

      this.dropBallEvents.push(
        this.time.addEvent({
          delay: 3000,
          callback: this.addBall,
          args: [DIRECTION.RIGHT],
          callbackScope: this,
          loop: true,
        })
      );
    } else {
      // At startup, let's drop some balls
      this.dropBallEvents.push(
        this.time.addEvent({
          delay: 1750,
          startAt: 1250,
          callback: this.addBall,
          callbackScope: this,
          loop: true,
        })
      );
    }
  }

  update(): void {
    switch (this.state) {
      case STATE.GAME_OVER:
        this.cameras.main.shake(CAMERA_SHAKE_DURATION, 0.05, false);
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
      case DIFFICULTY.HARD:
        // Add player tiles to scene
        this.tileStartY -= 325;
        for (let i = 0; i < 9; i++) {
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

        // Add collector tiles
        this.collectorGroup.add(new CollectorSprite(
          this,
          this.tileStartX,
          this.tileStartY - this.tileStepY, true)
        );

        this.collectorGroup.add(new CollectorSprite(
          this,
          this.tileStartX + (this.tileStepX * 2),
          this.tileStartY - this.tileStepY)
        );
        break;
      case DIFFICULTY.MEDIUM:
        // Add player tiles to scene
        this.tileStartY -= 325;
        for (let i = 0; i < 9; i++) {
          let row = Math.floor(i / 3);
          let col = i >= 3 ? i % 3 : i;
          const colour = tileTextureColours[i];
          this.tileGroup.add(
            new TileSprite(
              this,
              this.tileStartX + (col * this.tileStepX),
              this.tileStartY + (row * this.tileStepY),
              colour.tile,
              colour
            )
          );
        }

        // Add collector tile
        this.collectorGroup.add(
          new CollectorSprite(
            this,
            this.tileStartX + this.tileStepX,
            this.tileStartY - this.tileStepY, true
          )
        );
        break;
      case DIFFICULTY.EASY:
      default:
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

  addBall(side: DIRECTION): void {
    let newTile: TileSprite;
    let colour: TextureColourMap;
    switch (this.difficulty) {
      case DIFFICULTY.HARD:
        let x: number;
        if (side === DIRECTION.LEFT) {
          x = this.tileStartX + TILE_WDITH - BALL_RADIUS;
        } else {
          x = this.tileStartX + (this.tileStepX * 2) + TILE_WDITH - BALL_RADIUS;
        }

        colour = tileTextureColours[Phaser.Math.Between(0, tileTextureColours.length - 2)];
        newTile = new TileSprite(
          this,
          x,
          -150,
          colour.ball,
          colour
        );
        newTile.setVelocityY(Phaser.Math.Between(250, 275));
        this.descendingGroup.add(newTile);
        break;
      case DIFFICULTY.MEDIUM:
        colour = tileTextureColours[Phaser.Math.Between(0, tileTextureColours.length - 2)];
        newTile = new TileSprite(
          this,
          this.tileStartX + this.tileStepX + TILE_WDITH - BALL_RADIUS,
          -150,
          colour.ball,
          colour
        );
        newTile.setVelocityY(Phaser.Math.Between(250, 275));
        this.descendingGroup.add(newTile);
        break;
      case DIFFICULTY.EASY:
      default:
        colour = tileTextureColours[Phaser.Math.Between(0, 5)];
        // Add player tiles to scene
        newTile = new TileSprite(
          this,
          this.tileStartX + this.tileStepX + TILE_WDITH - BALL_RADIUS,
          -150,
          colour.ball,
          colour
        );
        newTile.setVelocityY(Phaser.Math.Between(250, 275));
        this.descendingGroup.add(newTile);
        break;
    }
  }
}
