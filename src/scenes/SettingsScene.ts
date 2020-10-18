import 'phaser';
import { titleTextConfig, subtitleTextConfig, btnTextConfig, DIFFICULTY, changeFontSize } from '../constants';
import MenuItem from '../entities/MenuItem';

export default class SettingsScene extends Phaser.Scene {
  private selectDifficulty: Function;
  private increaseFont: Function;
  private decreaseFont: Function;

  constructor() {
    super({ key: 'SettingsScene' });
  }

  create(): void {
    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

    // Title text
    const settingsText = this.add.text(screenCenterX, screenCenterY - 600, 'SETTINGS', titleTextConfig);
    settingsText.setOrigin(0.5);

    // Subtitle text
    const scoreText = this.add.text(screenCenterX, screenCenterY - 350, 'DIFFICULTY', subtitleTextConfig);
    scoreText.setOrigin(0.5);

    // Buttons
    const btnEasy = new MenuItem(this, screenCenterX, scoreText.y + 150, 'Easy', btnTextConfig, true);
    const btnMedium = new MenuItem(this, screenCenterX, btnEasy.y + 120, 'Medium', btnTextConfig);
    const btnHard = new MenuItem(this, screenCenterX, btnMedium.y + 120, 'Hard', btnTextConfig);

    // Button pointer listener
    const difficultyButtons = this.add.group([btnEasy, btnMedium, btnHard]);
    this.selectDifficulty = (pointer: PointerEvent, difficultyBtn: MenuItem) => {
      // Find selected collected tile
      difficultyButtons.getChildren().forEach((btn: MenuItem) => {
        if (btn.selected) {
          btn.unselect();
        }
      });

      difficultyBtn.select();
      switch (difficultyBtn.text) {
        case 'Easy':
          this.registry.set('difficulty', DIFFICULTY.EASY);
          break;
        case 'Medium':
          this.registry.set('difficulty', DIFFICULTY.MEDIUM);
          break;
        case 'Hard':
          this.registry.set('difficulty', DIFFICULTY.HARD);
          break;
        default:
          this.registry.set('difficulty', DIFFICULTY.EASY);
      }
    };

    // Make button text larger when hovering
    this.increaseFont = changeFontSize(120);
    this.decreaseFont = changeFontSize(96);
    this.input.setHitArea(difficultyButtons.getChildren()).
      on('gameobjectdown', this.selectDifficulty).
      on('gameobjectover', this.increaseFont).
      on('gameobjectout', this.decreaseFont);

    // Back button
    const btnBack = this.add.sprite(screenCenterX - 200, btnHard.y + 550, 'btnBack');
    btnBack.setOrigin(0.5);
    btnBack.setScale(0.4, 0.4);
    const backText = new MenuItem(this, btnBack.x + 200, btnHard.y + 550, 'Back', btnTextConfig);

    // Button input handlers
    btnBack.setInteractive();
    btnBack.on('pointerdown', () => {
      this.input.off('gameobjectdown', this.selectDifficulty);
      this.input.off('gameobjectover', this.increaseFont);
      this.input.off('gameobjectout', this.decreaseFont);
      this.scene.start('TitleScene');
    });
  }
}
