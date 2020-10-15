import 'phaser';
import { titleTextConfig, btnTextConfig } from '../constants';

export default class PausedScene extends Phaser.Scene {

  constructor() {
    super({ key: 'PausedScene' });
  }

  create() {
    // Semi-transparent overlay
    const graphics = this.add.graphics();
    graphics.fillRect(
      0,
      0,
      <number>this.game.config.width,
      <number>this.game.config.height
    );
    graphics.fillStyle(0x000000, 0.3);

    // Paused text
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    const pauseText = this.add.text(screenCenterX, screenCenterY - 600, 'PAUSED', titleTextConfig);
    pauseText.setOrigin(0.5);

    // Resume Button
    const btnResume = this.add.sprite(screenCenterX - 200, screenCenterY - 300, 'btnResume');
    btnResume.setOrigin(0.5);
    btnResume.setScale(0.4, 0.4);
    const retryText = this.add.text(screenCenterX + 80, screenCenterY - 300, 'Resume', btnTextConfig);
    retryText.setOrigin(0.5);

    // Exit button
    const btnExit = this.add.sprite(screenCenterX - 200, screenCenterY - 125, 'btnExit');
    btnExit.setOrigin(0.5);
    btnExit.setScale(0.4, 0.4);
    const exitText = this.add.text(screenCenterX - 25, screenCenterY - 125, 'Exit', btnTextConfig);
    exitText.setOrigin(0.5);

    // Button input handlers
    btnResume.setInteractive();
    btnResume.on('pointerdown', () => {
      this.scene.sleep();
      this.scene.resume('GameScene');
    });

    btnExit.setInteractive();
    btnExit.on('pointerdown', () => {
      this.cameras.main.fadeOut(250, 0, 0, 0);
    });

    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.scene.stop('GameScene');
      this.scene.stop('HUDScene');
      this.scene.start('TitleScene');
    });
  }
}