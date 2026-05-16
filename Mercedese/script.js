const canvas = document.getElementById("frame-canvas");
const context = canvas.getContext("2d");

const FRAME_CONFIG = {
  folder: "images",
  prefix: "ezgif-frame-",
  start: 1,
  end: 208,
  padding: 3,
  extension: "jpg",
};

const framePaths = Array.from(
  { length: FRAME_CONFIG.end - FRAME_CONFIG.start + 1 },
  (_, index) => {
    const frameNumber = FRAME_CONFIG.start + index;
    const paddedNumber = String(frameNumber).padStart(FRAME_CONFIG.padding, "0");
    return `${FRAME_CONFIG.folder}/${FRAME_CONFIG.prefix}${paddedNumber}.${FRAME_CONFIG.extension}`;
  }
);

const images = [];
let currentFrame = 0;
let targetFrame = 0;
let ticking = false;

function preloadFrames() {
  framePaths.forEach((path, index) => {
    const image = new Image();

    image.onload = () => {
      if (index === 0) {
        drawFrame(image);
      }
    };

    image.onerror = () => {
      console.warn(`Could not load frame: ${path}`);
    };

    image.src = path;
    images[index] = image;
  });
}

function resizeCanvas() {
  const pixelRatio = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  drawFrame(images[currentFrame]);
}

function drawFrame(image) {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  if (!image || !image.complete || image.naturalWidth === 0) {
    return;
  }

  const canvasRatio = window.innerWidth / window.innerHeight;
  const imageRatio = image.naturalWidth / image.naturalHeight;

  let drawWidth;
  let drawHeight;

  if (imageRatio > canvasRatio) {
    drawHeight = window.innerHeight;
    drawWidth = drawHeight * imageRatio;
  } else {
    drawWidth = window.innerWidth;
    drawHeight = drawWidth / imageRatio;
  }

  const x = (window.innerWidth - drawWidth) / 2;
  const y = (window.innerHeight - drawHeight) / 2;

  context.drawImage(image, x, y, drawWidth, drawHeight);
}

function updateTargetFrame() {
  const scrollScene = document.querySelector(".scroll-scene");
  const maxScroll = scrollScene.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  targetFrame = Math.round(clampedProgress * (framePaths.length - 1));

  if (!ticking) {
    ticking = true;
    requestAnimationFrame(render);
  }
}

function render() {
  ticking = false;

  if (currentFrame !== targetFrame) {
    currentFrame += Math.sign(targetFrame - currentFrame);
    drawFrame(images[currentFrame]);

    if (currentFrame !== targetFrame) {
      ticking = true;
      requestAnimationFrame(render);
    }

    return;
  }

  drawFrame(images[currentFrame]);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("scroll", updateTargetFrame, { passive: true });

resizeCanvas();
preloadFrames();
updateTargetFrame();
