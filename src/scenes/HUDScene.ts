import 'phaser';
import { hudTextConfig } from '../constants';

export default class HUDScene extends Phaser.Scene {
  private scoreText: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'HUDScene' });
  }

  create(): void {
    this.scoreText = this.add.text(724, 64, 'Score: 0', hudTextConfig);
    this.scoreText.setOrigin(0, 0);

    // Update score
    this.registry.events.on('changedata-score', this.updateScore, this);
  }

  updateScore(): void {
    this.scoreText.setText(`Score: ${this.registry.get('score')}`);
  }
}
