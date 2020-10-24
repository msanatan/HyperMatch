import 'phaser';

export default class MenuItemButton extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, scale: number = 1, frame: number = 0) {
    super(scene, x, y, texture, frame);
    this.setOrigin(0.5);
    this.setScale(scale, scale);
    this.setInteractive();
    this.scene.add.existing(this);
  }
}
