export default class PreviewController {
  constructor() {
    this.frames = null;
    this.fps = 12;
    this.animation = null;
  }

  setFrames(frames) {
    this.frames = frames;
    clearInterval(this.animation);
    if (this.fps === 0) {
      clearInterval(this.animation);
    } else {
      this.animate();
    }
  }

  setFps(fps, currentFrame) {
    this.fps = fps;
    if (this.fps === 0) {
      clearInterval(this.animation);
      PreviewController.draw(currentFrame);
    } else {
      this.animate();
    }
  }

  drawCurrentFrameIfFpsIsZero(currentFrame) {
    if (this.fps === 0) {
      PreviewController.draw(currentFrame);
    }
  }

  init(frames) {
    this.frames = frames;
    this.animate();
  }

  animate() {
    clearInterval(this.animation);
    let k = this.frames.length;
    let i = 0;
    this.animation = setInterval(() => {
      if (i >= k) {
        i = 0;
        k = this.frames.length;
      }
      PreviewController.draw(this.frames[i]);
      i += 1;
    }, 1000 / this.fps);
  }

  static draw(frame) {
    const place = document.querySelector('.preview-area');
    if (document.querySelector('.preview-area .grid')) {
      document.querySelector('.preview-area .grid').remove();
    }

    const numberOfBoxes = frame.getNumberOfBoxes();
    const colors = frame.getColors();
    const divGrid = document.createElement('div');
    divGrid.classList.add('grid');
    place.appendChild(divGrid);
    let row = document.createElement('div');
    row.classList.add('row');
    divGrid.appendChild(row);
    for (let i = 0; i <= numberOfBoxes; i += 1) {
      if (i % 7 === 0 && i > 0) {
        divGrid.appendChild(row);
        row = document.createElement('div');
        row.classList.add('row');
      }
      const box = document.createElement('div');
      box.classList.add('box');
      box.setAttribute('data', i);
      box.style.backgroundColor = colors[i];
      row.appendChild(box);
    }
  }

  updatePreviewArea(currentFrame) {
    this.draw(currentFrame);
  }
}
