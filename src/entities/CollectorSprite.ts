import 'phaser';
import TileSprite from './TileSprite';
import { TextureColourMap } from '../constants';

export default class CollectorSprite extends TileSprite {
  public selected: boolean;
  private borderGraphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x: number, y: number, selected: boolean = false) {
    super(scene, x, y, 'collectorBlackTile', {});
    this.borderGraphics = this.scene.add.graphics();
    this.borderGraphics.lineStyle(10, 0xffffff, 1);
    let { width, height } = this.getBounds();
    this.borderGraphics.strokeRoundedRect(x, y, width, height, 15);
    this.borderGraphics.setVisible(false);
    if (selected) {
      this.select();
    }
  }

  updateColour(colour: TextureColourMap): void {
    this._colour = colour;
    this.setTexture(this._colour.collector);
  }

  select() {
    this.selected = true;
    this.borderGraphics.setVisible(true);
  }

  unselect() {
    this.selected = false;
    this.borderGraphics.setVisible(false);
  }
}