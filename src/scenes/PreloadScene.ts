import 'phaser';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    this.load.pack(
      'hyperMatchPack',
      'pack.json',
      'hyperMatchPack'
    );
  }

  async create() {
    // Load custom fonts
    try {
      await this.loadFonts('Gugi Regular', 'fonts/Gugi-Regular.ttf');
    } catch (error) {
      console.error('Could not load custom fonts');
    }

    this.scene.start('TitleScene');
  }

  async loadFonts(name: string, url: string) {
    const font = new FontFace(name, `url(${url})`);

    try {
      await font.load();
      document.fonts.add(font);
      document.body.classList.add('fonts-loaded');
    } catch (error) {
      console.error(`Could not load font ${name}: ${error.message}`);
    };
  }
}
