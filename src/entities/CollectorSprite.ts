import 'phaser';
import TileSprite from './TileSprite';

export default class CollectorSprite extends TileSprite {
  public selected: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, selected: boolean = false) {
    super(scene, x, y, 'blackTile');
    this.selected = selected;
  }
}