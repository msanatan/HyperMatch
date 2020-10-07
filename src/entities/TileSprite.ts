import 'phaser';

export default class TileSprite extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: number = 0) {
    super(scene, x, y, texture, frame);
    this.scene.add.existing(this);
    this.setOrigin(0, 0);
    this.setScale(1, 1.25);
  }
}