import 'phaser';

export default class HUDScene extends Phaser.Scene {
  private scoreText: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'HUDScene' });
  }

  create(): void {
    const hudTextConfig = {
      fontFamily: 'Gugi Regular',
      fontSize: '60px',
      color: '#FFFFFF',
    };

    this.scoreText = this.add.text(724, 40, 'Score: 0', hudTextConfig);
    this.scoreText.setOrigin(0, 0);

    // Update score
    this.registry.events.on('changedata-score', this.updateScore, this);
  }

  updateScore(): void {
    this.scoreText.setText(`Score: ${this.registry.get('score')}`);
  }
}
