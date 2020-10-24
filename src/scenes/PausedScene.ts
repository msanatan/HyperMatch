import 'phaser';
import { titleTextConfig, btnTextConfig } from '../constants';
import MenuItem from '../entities/MenuItem';
import MenuItemButton from '../entities/MenuItemButton';

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
    const btnResume = new MenuItemButton(this, screenCenterX - 200, screenCenterY - 350, 'btnResume', 0.4);
    const retryText = new MenuItem(this, btnResume.x + 240, screenCenterY - 350, 'Resume', btnTextConfig);

    // Exit button
    const btnExit = new MenuItemButton(this, screenCenterX - 200, btnResume.y + 150, 'btnExit', 0.4);
    const exitText = new MenuItem(this, btnExit.x + 150, btnResume.y + 150, 'Exit', btnTextConfig);

    // Button input handlers
    btnResume.on('pointerdown', () => {
      this.scene.sleep();
      this.scene.resume('GameScene');
    });

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
