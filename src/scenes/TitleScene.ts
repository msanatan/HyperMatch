import 'phaser';
import { DIFFICULTY, titleTextConfig, btnTextConfig, changeFontSize } from '../constants';
import MenuItem from '../entities/MenuItem';

export default class TitleScene extends Phaser.Scene {
  private increaseFont: Function;
  private decreaseFont: Function;

  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    // If no difficulty is set in the registry, default to easy
    if (!this.registry.get('difficulty')) {
      this.registry.set('difficulty', DIFFICULTY.EASY);
    }

    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    const titleText = this.add.text(screenCenterX, 256, 'Hyper Match', titleTextConfig);
    titleText.setOrigin(0.5);

    // Play button
    const btnPlay = new MenuItem(this, screenCenterX, screenCenterY, 'Play', btnTextConfig);
    const btnSettings = new MenuItem(this, btnPlay.x, btnPlay.y + 150, 'Settings', btnTextConfig);
    const btnGroup = this.add.group([btnPlay, btnSettings]);

    // Make button text larger when hovering
    this.increaseFont = changeFontSize(120);
    this.decreaseFont = changeFontSize(96);
    this.input.setHitArea(btnGroup.getChildren()).
      on('gameobjectover', this.increaseFont).
      on('gameobjectout', this.decreaseFont);

    // Handle transition to play scene
    btnPlay.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0); // Fade to black screen
    });
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.input.off('gameobjectover', this.increaseFont);
      this.input.off('gameobjectout', this.decreaseFont);
      this.playGame();
    });

    // Handle transition to settings scene
    btnSettings.on('pointerdown', () => {
      this.input.off('gameobjectover', this.increaseFont);
      this.input.off('gameobjectout', this.decreaseFont);
      this.scene.start('SettingsScene');
    });
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
