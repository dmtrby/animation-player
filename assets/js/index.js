/* eslint-disable import/extensions */
import PageController from './PageController.js';
// eslint-disable-next-line no-unused-vars
import FrameBuilder from './FrameBuilder.js';
import PreviewController from './PreviewController.js';

const prev = document.getElementById('prev');
const current = document.getElementById('current');
const eyedropper = document.getElementById('eyedropper');
const bucket = document.getElementById('bucket');
const slider = document.getElementById('myRange');
const output = document.getElementById('output');
output.innerHTML = `${slider.value} FPS`;

const pageController = new PageController();
const previewController = new PreviewController();


function onLoadStart() {
  const colorsArray = [
    '#F34235',
    '#E81E62',
    '#9B26AF',
    '#3E50B4',
    '#02A8F3',
    '#009587',
    '#4BAE4F',
    '#CCDB38',
    '#FEC007',
    '#785447',
    '#9D9D9D',
    '#5F7C8A',
    '#00BBD3',
    '#6639B6',
  ];
  const circles = document.querySelectorAll('div.circle');
  for (let i = 0; i < circles.length; i += 1) {
    circles[i].style.backgroundColor = colorsArray[i];
  }
  pageController.init();
  previewController.init(pageController.getFrames());
}
document.addEventListener('loadstart', onLoadStart());

const newFrameButton = document.getElementById('newFrameButton');

function onDeleteFrameButtonClick(event) {
  if (event.target.classList.contains('icon-trash')) {
    const frameElement = event.target.parentNode.parentNode;
    const number = parseInt(frameElement.getAttribute('frame-number'), 10);
    pageController.deleteFrame(number);
    if (frameElement.classList.contains('active-frame')) {
      if (number === 1) {
        pageController.setCurrentFrameElement(number);
        pageController.changeWorkArea(number);
        frameElement.nextSibling.classList.add('active-frame');
      } else {
        pageController.setCurrentFrameElement(number - 1);
        pageController.changeWorkArea(number - 1);
        frameElement.previousSibling.classList.add('active-frame');
      }
    }
    frameElement.parentNode.removeChild(frameElement);
    PageController.isFrameOnlyOneCheck();
    PageController.updateFrameNumbers();
    previewController.updatePreviewArea(pageController.getCurrentFrameElement());
    previewController.setFrames(pageController.getFrames());
  }
}

function onCopyFrameButtonClick(event) {
  if (event.target.classList.contains('icon-docs')) {
    const frameElement = event.target.parentNode.parentNode;
    const number = frameElement.getAttribute('frame-number');
    document.querySelector('.active-frame').classList.remove('active-frame');
    pageController.copyFrame(number);

    PageController.isFrameOnlyOneCheck();
    PageController.updateFrameNumbers();

    const deleteFrameButtons = document.getElementsByClassName('frame-element-delete');
    for (let i = 0; i < deleteFrameButtons.length; i += 1) {
      deleteFrameButtons[i].addEventListener('click', onDeleteFrameButtonClick);
    }
    const copyFrameButtons = document.getElementsByClassName('frame-element-copy');
    for (let i = 0; i < copyFrameButtons.length; i += 1) {
      copyFrameButtons[i].addEventListener('click', onCopyFrameButtonClick);
    }
    previewController.updatePreviewArea(pageController.getCurrentFrameElement());
  }
}

function onNewFrameButtonClick() {
  document.querySelector('.active-frame').classList.remove('active-frame');
  pageController.addNewFrame();
  const deleteFrameButton = document.getElementsByClassName('frame-element-delete');
  deleteFrameButton[deleteFrameButton.length - 1].addEventListener('click', onDeleteFrameButtonClick);
  const copyFrameButton = document.getElementsByClassName('frame-element-copy');
  copyFrameButton[copyFrameButton.length - 1].addEventListener('click', onCopyFrameButtonClick);
  previewController.updatePreviewArea(pageController.getCurrentFrameElement());
}

newFrameButton.addEventListener('click', onNewFrameButtonClick);

function onFrameSelectionClick(event) {
  const { target } = event;
  if (!target.classList.contains('icon-trash') && !target.classList.contains('icon-docs')) {
    let element;
    let number;
    let isFrameClick = false;
    element = target;
    while (element.parentNode) {
      if (element.classList.contains('frame-element')) {
        isFrameClick = true;
        break;
      }
      element = element.parentNode;
    }
    if (isFrameClick) {
      if (!element.classList.contains('active-frame')) {
        document.querySelector('.active-frame').classList.remove('active-frame');
        number = parseInt(element.getAttribute('frame-number'), 10);
        element.classList.add('active-frame');
        pageController.setCurrentFrameElement(number);
        pageController.changeWorkArea(number);
        previewController.updatePreviewArea(pageController.getCurrentFrameElement());
      }
    }
  }
}

const FramesContainer = document.querySelector('.frame-elements-container');
FramesContainer.addEventListener('click', onFrameSelectionClick);

const deleteFrameButton = document.getElementsByClassName('frame-element-delete');
deleteFrameButton[deleteFrameButton.length - 1].addEventListener('click', onDeleteFrameButtonClick);

const copyFrameButton = document.getElementsByClassName('frame-element-copy');
copyFrameButton[copyFrameButton.length - 1].addEventListener('click', onCopyFrameButtonClick);
// BUTTONS on left area
function setToActive() {
  const lastActiveElement = document.getElementsByClassName('active')[0];
  if (lastActiveElement === this) {
    this.classList.remove('active');
    return;
  }
  if (!lastActiveElement) {
    this.classList.add('active');
  } else {
    lastActiveElement.classList.remove('active');
    this.classList.add('active');
  }
}
const buttons = document.querySelectorAll('.left-first button');
for (let i = 0; i < buttons.length; i += 1) {
  buttons[i].addEventListener('click', setToActive);
}
// END buttons

// START clicks on color choosing area
function onColorsContainerClick(event) {
  if (eyedropper.className.indexOf('active') !== -1) {
    if (event.target.children.length === 0) {
      if (current.style.backgroundColor === event.target.style.backgroundColor) {
        return;
      }
      prev.style.backgroundColor = current.style.backgroundColor;
      current.style.backgroundColor = event.target.style.backgroundColor;
    }
  }
}
const colorsDiv = document.querySelector('div.colors');
colorsDiv.addEventListener('click', onColorsContainerClick);
prev.addEventListener('click', onColorsContainerClick);

// END clicks on color choosing area
// START click on work area
function onBlocksContainerClick(event) {
  const item = event.target;
  if (Array.prototype.indexOf.call(document.getElementsByClassName('box'), item) !== -1) {
    if (bucket.className.indexOf('active') !== -1) {
      const color = window.getComputedStyle(current).backgroundColor;
      item.style.backgroundColor = color;
      pageController.getCurrentFrameElement().changeColor(item.getAttribute('data'), color);
      pageController.updateFrame();
      previewController.updatePreviewArea(pageController.getCurrentFrameElement());
    }
    if (eyedropper.className.indexOf('active') !== -1) {
      if (current.style.backgroundColor === item.style.backgroundColor) {
        return;
      }
      prev.style.backgroundColor = current.style.backgroundColor;
      current.style.backgroundColor = item.style.backgroundColor;
    }
  }
}
const workArea = document.querySelector('.work-area');
workArea.addEventListener('click', onBlocksContainerClick);
// END clicks on work area

// FPS slider
function onFpsSliderInput() {
  output.innerHTML = `${this.value} FPS`;
  previewController.setFps(parseInt(this.value, 10), pageController.getCurrentFrameElement());
}

slider.addEventListener('input', onFpsSliderInput);

document.querySelector('.header').addEventListener('click', () => {
});

// Full screen
function onFullSreenButtonClick() {
  const elem = document.querySelector('.right2');
  if (!document.fullscreenElement) {
    elem.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

const fullScreenButton = document.querySelector('.right2 .icon-move');
fullScreenButton.addEventListener('click', onFullSreenButtonClick);
