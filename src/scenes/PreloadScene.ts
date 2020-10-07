import 'phaser';
import { DIFFICULTY } from '../constants';

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

  update(time: number, delta: number): void {
    this.scene.start('GameScene', { difficulty: DIFFICULTY.EASY });
  }
}
