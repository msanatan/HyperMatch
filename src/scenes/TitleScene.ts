import 'phaser';
import { DIFFICULTY } from '../constants';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    const titleTextConfig = {
      fontFamily: 'Gugi Regular, Helvetica, Arial',
      fontSize: '144px',
      color: '#FFFFFF',
    };

    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const titleText = this.add.text(screenCenterX, 256, 'Hyper Match', titleTextConfig);
    titleText.setOrigin(0.5);
  }

  playGame(): void {
    this.scene.start('GameScene', { difficulty: DIFFICULTY.EASY });
    this.scene.start('HUDScene');
    this.scene.bringToTop('HUDScene');
  }
}
