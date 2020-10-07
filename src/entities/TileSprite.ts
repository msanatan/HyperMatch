import 'phaser';

export default class TileSprite extends Phaser.GameObjects.Sprite {
  private _textureKey: string;

  get textureKey(): string {
    return this._textureKey;
  }

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: number = 0) {
    super(scene, x, y, texture, frame);
    this._textureKey = texture;
    this.scene.add.existing(this);
    this.setOrigin(0, 0);
    this.setScale(1, 1.25);
  }
}