/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
import FrameBuilder from './FrameBuilder.js';
import PreviewController from './PreviewController.js';

export default class PageController {
  constructor() {
    this.frames = [];
    this.currentFrame = null;
  }

  init() {
    const frame = new FrameBuilder();
    this.frames.push(frame);
    this.currentFrame = frame;
    PageController.createWorkArea(this.currentFrame);
    PageController.createNewFrameOnFrameArea(this.currentFrame, 1);
  }

  getCurrentFrameElement() {
    return this.currentFrame;
  }

  getFrameElement(number) {
    return this.frames[number];
  }

  getFrames() {
    return this.frames;
  }

  setCurrentFrameElement(number) {
    this.currentFrame = this.frames[number - 1];
  }

  deleteFrame(number) {
    this.frames.splice(number - 1, 1);
  }

  changeWorkArea(number) {
    const workArea = document.getElementsByClassName('work-area')[0];
    workArea.innerHTML = '';
    PageController.DrawGridBox(workArea, this.frames[number - 1]);
  }

  static createWorkArea(frame) {
    const workArea = document.getElementsByClassName('work-area')[0];
    workArea.innerHTML = '';
    PageController.DrawGridBox(workArea, frame);
  }

  static createNewFrameOnFrameArea(frame, number) {
    const frameDivContainer = document.getElementsByClassName('frame-elements-container')[0];
    const newFrameDiv = document.createElement('div');
    newFrameDiv.classList.add('frame-element');
    newFrameDiv.setAttribute('frame-number', number);
    newFrameDiv.innerHTML = `<div class="frame-element-number"><span>${number}</span></div><div class="frame-element-delete"><i class="icon-trash"></i></div><div class="frame-element-copy"><i class="icon-docs"></i></div>`;
    frameDivContainer.appendChild(newFrameDiv);
    PageController.DrawGridBox(newFrameDiv, frame);
    newFrameDiv.classList.add('active-frame');
    PageController.isFrameOnlyOneCheck();
  }

  static pasteNewFrameOnFrameArea(frame, number) {
    const frameDivContainer = document.getElementsByClassName('frame-elements-container')[0];
    const previousNode = frameDivContainer.children[number - 1];

    const newFrameDiv = document.createElement('div');
    newFrameDiv.classList.add('frame-element');
    newFrameDiv.setAttribute('frame-number', number);
    newFrameDiv.innerHTML = `<div class="frame-element-number"><span>${number}</span></div><div class="frame-element-delete"><i class="icon-trash"></i></div><div class="frame-element-copy"><i class="icon-docs"></i></div>`;

    if (previousNode !== frameDivContainer.lastChild) {
      frameDivContainer.appendChild(newFrameDiv);
      frameDivContainer.insertBefore(newFrameDiv, previousNode.nextSibling);
    } else {
      frameDivContainer.appendChild(newFrameDiv);
    }
    PageController.DrawGridBox(newFrameDiv, frame);
    newFrameDiv.classList.add('active-frame');
    PageController.isFrameOnlyOneCheck();
  }

  addNewFrame() {
    const frame = new FrameBuilder();
    this.frames.push(frame);
    this.currentFrame = frame;
    const number = this.frames.length;
    PageController.createNewFrameOnFrameArea(frame, number);
    PageController.createWorkArea(frame);
  }

  copyFrame(number) {
    const newFrame = new FrameBuilder(this.frames[number - 1].colors.slice());
    this.frames.splice(number, 0, newFrame);
    this.currentFrame = newFrame;
    PageController.pasteNewFrameOnFrameArea(newFrame, number);
    PageController.createWorkArea(newFrame);
  }

  static DrawGridBox(place, frame) {
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

  static isFrameOnlyOneCheck() {
    const numberOfFrames = document.getElementsByClassName('frame-element');
    if (numberOfFrames.length === 1) {
      document.querySelector('.frame-element-delete').style.display = 'none';
    } else {
      document.querySelector('.frame-element-delete').style.display = 'block';
    }
  }

  static updateFrameNumbers() {
    const framesArray = document.querySelectorAll('.frame-element');
    framesArray.forEach((element, index) => {
      const target = element;
      target.setAttribute('frame-number', index + 1);
      target.childNodes[0].innerText = index + 1;
    });
  }

  updateFrame() {
    const currentFrameDiv = document.querySelector('.active-frame');
    currentFrameDiv.lastChild.innerHTML = '';
    PageController.DrawGridBox(currentFrameDiv, this.currentFrame);
  }
}
