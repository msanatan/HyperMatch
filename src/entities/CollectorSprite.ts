import 'phaser';
import TileSprite from './TileSprite';
import { TextureColourMap } from '../constants';

export default class CollectorSprite extends TileSprite {
  public selected: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, selected: boolean = false) {
    super(scene, x, y, 'collectorBlackTile', {});
    this.selected = selected;
  }

  updateColour(colour: TextureColourMap): void {
    this._colour = colour;
    this.setTexture(this._colour.collector);
  }
}