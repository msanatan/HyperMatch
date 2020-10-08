import 'phaser';

export default class TileSprite extends Phaser.Physics.Arcade.Sprite {
  private _textureKey: string;

  get textureKey(): string {
    return this._textureKey;
  }

  set textureKey(key: string) {
    this._textureKey = key;
  }

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: number = 0) {
    super(scene, x, y, texture, frame);
    this._textureKey = texture;
    this.setOrigin(0, 0);
    this.setScale(1, 1.25);
    this.scene.physics.world.enable(this);
    this.body = this.body as Phaser.Physics.Arcade.Body; // TypeScript cast
    this.body.setGravity(0, 0);
    this.body.setVelocity(0, 0);
    this.body.setImmovable(true);
    this.scene.add.existing(this);
  }
}