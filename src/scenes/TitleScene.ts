import 'phaser';
import {
  DIFFICULTY, titleTextConfig, changeFontSize, subtitleTextConfig,
  TITLE_CAMERA_CENTRE_DEST_X, CAMERA_CENTRE_ORIG_Y, CAMERA_CENTRE_ORIG_X,
  CAMERA_PAN_DURATION, CAMERA_FADE_DURATION
} from '../constants';
import MenuItem from '../entities/MenuItem';
import MenuItemButton from '../entities/MenuItemButton';

export default class TitleScene extends Phaser.Scene {
  private increaseFont: Function;
  private decreaseFont: Function;
  private goToSettings: boolean;

  constructor() {
    super({ key: 'TitleScene' });
  }

  create(data: any): void {
    if (data?.panIn) {
      this.cameras.main.centerOnX(TITLE_CAMERA_CENTRE_DEST_X);
      this.cameras.main.pan(CAMERA_CENTRE_ORIG_X, CAMERA_CENTRE_ORIG_Y, CAMERA_PAN_DURATION, 'Linear');
    }

    // If no difficulty is set in the registry, default to easy
    if (!this.registry.get('difficulty')) {
      this.registry.set('difficulty', DIFFICULTY.EASY);
    }

    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    const titleText = this.add.text(screenCenterX, screenCenterY - 600, 'HYPER MATCH', titleTextConfig);
    titleText.setOrigin(0.5);

    // Play button
    const btnPlay = new MenuItem(this, screenCenterX, screenCenterY, 'Play', subtitleTextConfig);
    const btnSettings = new MenuItem(this, btnPlay.x, btnPlay.y + 150, 'Settings', subtitleTextConfig);
    this.goToSettings = false; // Add flag for menu button
    const btnGroup = this.add.group([btnPlay, btnSettings]);

    // Make button text larger when hovering
    this.increaseFont = changeFontSize(120);
    this.decreaseFont = changeFontSize(104);
    this.input.setHitArea(btnGroup.getChildren()).
      on('gameobjectover', this.increaseFont).
      on('gameobjectout', this.decreaseFont);

    // Handle transition to play scene
    btnPlay.on('pointerdown', () => {
      // Fade to black screen
      this.cameras.main.fadeOut(CAMERA_FADE_DURATION, 0, 0, 0);
    });
    this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.input.off('gameobjectover', this.increaseFont);
      this.input.off('gameobjectout', this.decreaseFont);
      this.playGame();
    });

    // Handle transition to settings scene
    btnSettings.on('pointerdown', () => {
      // Move camera to the right, create a "swipe" feeling
      this.goToSettings = true;
      this.cameras.main.pan(TITLE_CAMERA_CENTRE_DEST_X, CAMERA_CENTRE_ORIG_Y, CAMERA_PAN_DURATION, 'Linear');
    });

    this.cameras.main.on(Phaser.Cameras.Scene2D.Events.PAN_COMPLETE, () => {
      if (this.goToSettings) {
        this.input.off('gameobjectover', this.increaseFont);
        this.input.off('gameobjectout', this.decreaseFont);
        this.scene.start('SettingsScene', { panIn: true });
      }
    });

    // Add fullscreen button if mobile
    if (!this.sys.game.device.os.desktop) {
      const btnFullscreen = new MenuItemButton(this, this.cameras.main.width - 100, 100, 'btnFullscreen', 0.3);
      btnFullscreen.on('pointerup', () => {
        if (this.scale.isFullscreen) {
          this.scale.stopFullscreen();
        } else {
          this.scale.startFullscreen();
        }
      });
    }
  }

  playGame(): void {
    this.scene.start('GameScene', { fadeIn: true });
    this.scene.start('HUDScene');
    this.scene.bringToTop('HUDScene');
    this.scene.start('PausedScene');
    this.scene.bringToTop('PausedScene');
    this.scene.sleep('PausedScene');
  }
}
