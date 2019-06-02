export default class FrameBuilder {
  constructor(colors) {
    this.colors = colors || [];
    this.numberOfBoxes = 49;
    if (this.colors.length === 0) {
      for (let i = 0; i < this.numberOfBoxes; i += 1) {
        this.colors.push('#fff');
      }
    }
  }

  getNumberOfBoxes() {
    return this.numberOfBoxes;
  }

  getColors() {
    return this.colors;
  }

  changeColor(position, color) {
    this.colors[position] = color;
  }
}
