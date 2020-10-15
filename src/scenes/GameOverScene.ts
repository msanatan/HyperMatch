import 'phaser';
import { titleTextConfig, subtitleTextConfig, btnTextConfig } from '../constants';

enum STATE {
  EXIT,
  RETRY
}

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(): void {
    this.cameras.main.fadeIn(500, 0, 0, 0);
    let state: STATE;
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

    // Game over text
    const gameOverText = this.add.text(screenCenterX, screenCenterY - 600, 'GAME OVER', titleTextConfig);
    gameOverText.setOrigin(0.5);

    // Score text
    const scoreText = this.add.text(screenCenterX, screenCenterY - 300, `Score: ${this.registry.get('score')}`, subtitleTextConfig);
    scoreText.setOrigin(0.5);

    // Retry button
    const btnRetry = this.add.sprite(screenCenterX - 200, screenCenterY + 100, 'btnRetry');
    btnRetry.setOrigin(0.5);
    btnRetry.setScale(0.4, 0.4);
    const retryText = this.add.text(screenCenterX + 15, screenCenterY + 100, 'Retry', btnTextConfig);
    retryText.setOrigin(0.5);

    // Exit Button
    const btnExit = this.add.sprite(screenCenterX - 200, screenCenterY + 275, 'btnExit');
    btnExit.setOrigin(0.5);
    btnExit.setScale(0.4, 0.4);
    const exitText = this.add.text(screenCenterX - 25, screenCenterY + 275, 'Exit', btnTextConfig);
    exitText.setOrigin(0.5);

    // Button actions
    btnRetry.setInteractive();
    btnRetry.on('pointerdown', () => {
      this.cameras.main.fadeOut(250, 0, 0, 0);
      state = STATE.RETRY;
    });

    btnExit.setInteractive();
    btnExit.on('pointerdown', () => {
      this.cameras.main.fadeOut(250, 0, 0, 0);
      state = STATE.EXIT;
    });

    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      switch (state) {
        case STATE.EXIT:
          this.scene.start('TitleScene');
          break;
        case STATE.RETRY:
          this.scene.start('GameScene');
          this.scene.start('HUDScene');
          this.scene.bringToTop('HUDScene');
          break;
      }
    });
  }
}
