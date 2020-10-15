import 'phaser';
import { DIFFICULTY, titleTextConfig, btnTextConfig } from '../constants';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    const titleText = this.add.text(screenCenterX, 256, 'Hyper Match', titleTextConfig);
    titleText.setOrigin(0.5);

    // Play button
    const playButton = this.add.text(screenCenterX, screenCenterY, 'Play', btnTextConfig);
    playButton.setInteractive();
    playButton.setOrigin(0.5);
    playButton.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0); // Fade to black screen
    });
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.playGame();
    });
    playButton.on('pointerover', () => {
      playButton.setFontSize(120);
    });
    playButton.on('pointerout', () => {
      playButton.setFontSize(96);
    });
  }

  playGame(): void {
    this.registry.set('difficulty', DIFFICULTY.EASY);
    this.scene.start('GameScene', { fadeIn: true });
    this.scene.start('HUDScene');
    this.scene.bringToTop('HUDScene');
    this.scene.start('PausedScene');
    this.scene.bringToTop('PausedScene');
    this.scene.sleep('PausedScene');
  }
}
