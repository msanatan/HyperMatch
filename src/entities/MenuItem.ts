import 'phaser';

export default class MenuItem extends Phaser.GameObjects.Text {
  public selected: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string, style: Phaser.Types.GameObjects.Text.TextStyle, selected: boolean = false) {
    super(scene, x, y, text, style);
    this.selected = selected;
    this.setOrigin(0.5);
    this.setInteractive();
    this.scene.add.existing(this);
  }
}
