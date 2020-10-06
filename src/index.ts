import 'phaser';

const config: Phaser.Types.Core.GameConfig = {
  title: 'Hyper Match',
  type: Phaser.AUTO,
  parent: 'app',
  width: 1080,
  height: 1920,
  backgroundColor: '#FFE7CF',
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  autoFocus: true,
  render: {
    pixelArt: true
  },
  input: {
    windowEvents: false
  },
  scene: {}
};

export default new Phaser.Game(config);
