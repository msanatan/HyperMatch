import 'phaser';
import PreloadScene from './scenes/PreloadScene';
import GameScene from './scenes/GameScene';
import HUDScene from './scenes/HUDScene';
import TitleScene from './scenes/TitleScene';
import GameOverScene from './scenes/GameOverScene';

const config: Phaser.Types.Core.GameConfig = {
  title: 'Hyper Match',
  type: Phaser.AUTO,
  parent: 'app',
  width: 1080,
  height: 1920,
  backgroundColor: '#FFCC99',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  autoFocus: true,
  physics: {
    default: 'arcade',
  },
  input: {
    windowEvents: false
  },
  scene: [PreloadScene, GameScene, HUDScene, TitleScene, GameOverScene]
};

export default new Phaser.Game(config);
