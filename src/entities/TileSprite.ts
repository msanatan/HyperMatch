import 'phaser';
import { TextureColourMap } from '../constants';

export default class TileSprite extends Phaser.Physics.Arcade.Sprite {
  protected _colour: TextureColourMap;

  get colour(): TextureColourMap {
    return this._colour;
  }

  set colour(colour: TextureColourMap) {
    this._colour = colour;
  }

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, colour: TextureColourMap, frame: number = 0, ) {
    super(scene, x, y, texture, frame);
    this._colour = colour;
    this.setOrigin(0, 0);
    this.setScale(0.8, 0.8);
    this.scene.physics.world.enable(this);
    (<Phaser.Physics.Arcade.Body>this.body).
      setGravity(0, 0).
      setVelocity(0, 0).
      setImmovable(true);
    this.scene.add.existing(this);
  }
}