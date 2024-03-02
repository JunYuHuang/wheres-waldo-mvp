// query selectors
const image = document.querySelector("#image");
const imageDisplayed = document.querySelector("#image-displayed");
const originalStatsContent = document.querySelector("#original-stats-content");
const currentStatsContent = document.querySelector("#current-stats-content");
const targetBox = document.querySelector("#target-box");
const targetBoxOptions = document.querySelector("#target-box-options");

const useTimer = function () {
  let _startTime;
  let _endTime;
  let _intervalId;

  const startTime = function () {
    return _startTime;
  };

  const setStartTime = function (dateInMS) {
    _startTime = dateInMS;
  };

  const endTime = function () {
    return _endTime;
  };

  const setEndTime = function (dateInMS) {
    _endTime = dateInMS;
  };

  const elapsedTimeInS = function () {
    if (!_startTime) return 0;
    if (!_endTime) return (Date.now() - _startTime) / 1000;
    return (_endTime - _startTime) / 1000;
  };

  const startTimer = function (callbackFn) {
    _endTime = null;
    if (!_startTime) _startTime = Date.now();
    _intervalId = setInterval(callbackFn, 1000);
  };

  const stopTimer = function () {
    _endTime = Date.now();
    clearInterval(_intervalId);
    _intervalId = Math.NEGATIVE_INFINITY;
  };

  const resetTimer = function () {
    _startTime = null;
    _endTime = null;
    _intervalId = Math.NEGATIVE_INFINITY;
  };

  return {
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    elapsedTimeInS,
    startTimer,
    stopTimer,
    resetTimer,
  };
};

const scale = function (imageEl) {
  return (
    (imageEl.width * imageEl.height) /
    (imageEl.naturalWidth * imageEl.naturalHeight)
  );
};

const widthScale = function (imageEl) {
  return imageEl.width / imageEl.naturalWidth;
};

const heightScale = function (imageEl) {
  return imageEl.height / imageEl.naturalHeight;
};

const scaleUpPosition = function (pos, imageEl) {
  return [
    pos[0] * (imageEl.naturalWidth / imageEl.width),
    pos[1] * (imageEl.naturalHeight / imageEl.height),
  ];
};

const scaleDownPosition = function (pos, imageEl) {
  return [
    pos[0] / (imageEl.naturalWidth / imageEl.width),
    pos[1] / (imageEl.naturalHeight / imageEl.height),
  ];
};

const scaleRegion = function (rectangleCorners, imageEl, scalerFn) {
  return rectangleCorners.map((pos) => scalerFn(pos, imageEl));
};

const isPosInRectangle = function (pos, rectangleCorners) {
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (let [rectX, rectY] of rectangleCorners) {
    minX = Math.min(minX, rectX);
    maxX = Math.max(maxX, rectX);
    minY = Math.min(minY, rectY);
    maxY = Math.max(maxY, rectY);
  }
  if (minX === maxX || minY === maxY) return false;
  const [x, y] = pos;
  if (x < minX || x > maxX) return false;
  if (y < minY || y > maxY) return false;
  return true;
};

const doTwoRectanglesOverlap = function (rectangle1Corners, rectangle2Corners) {
  // TODO
};

const waldoRegion = [
  [733, 457], // top-left
  [767, 457], // top-right
  [733, 507], // bot-left
  [767, 507], // bot-right
];

const rectangleCornersToString = function (rectangleCorners) {
  return rectangleCorners
    .map((pos) => `(${Math.round(pos[0])}, ${Math.round(pos[1])})`)
    .join(", ");
};

// original stats
const originalStats = {
  imgDimensions: `Image Dimensions: ${image.naturalWidth} x ${image.naturalHeight}`,
  imgAspectRatio: `Image Aspect Ratio: ${
    image.naturalWidth / image.naturalHeight
  }`,
  waldoRegion: `Waldo Region: ${rectangleCornersToString(waldoRegion)}`,
};
originalStatsContent.textContent = Object.values(originalStats).join("\n");

// current stats
const currentStats = {
  imgDimensions: `Image Dimensions: ${image.width} x ${image.height}`,
  imgAspectRatio: `Image Aspect Ratio: ${image.width / image.height}`,
  scaledWaldoRegion: `Scaled Waldo Region: ?`,
  imgScale: `Image Scale: ?`,
  imgWidthScale: `Image Width Scale: ?`,
  imgHeightScale: `Image Height Scale: ?`,
  mousePosition: "Mouse Position (in image): ?",
  scaledMousePosition: "Scaled Mouse Position (in image): ?",
  clickedPosition: "Clicked Position (in image): ?",
  scaledClickedPosition: "Scaled Clicked Position (in image): ?",
  didFindWaldo: "Found Waldo (point in area)? false",
  startTime: "Start Time: ?",
  endTime: "End Time: ?",
  elapsedTime: "Elapsed Time: 0 seconds",
};

const renderCurrentStats = function () {
  currentStatsContent.textContent = Object.values(currentStats).join("\n");
};

renderCurrentStats();

const timer = useTimer();
const { startTime, endTime, elapsedTimeInS, startTimer, stopTimer } = timer;

const updateTimeStats = function () {
  if (timer.endTime())
    currentStats.endTime = `End Time: ${Date(timer.endTime())}`;
  currentStats.elapsedTime = `Elapsed Time: ${elapsedTimeInS()} seconds`;
  renderCurrentStats();
};

const updateTargetBoxPosition = function (event) {
  const [x, y] = [event.offsetX, event.offsetY];
  targetBox.style.top = `${y - 20}px`;
  targetBox.style.left = `${x - 20}px`;
  targetBox.style.opacity = 1;
};

const updateTargetBoxOptionsPosition = function (event) {
  const [x, y] = [event.offsetX, event.offsetY];
  targetBoxOptions.style.top = `${y + 20}px`;
  targetBoxOptions.style.left = `${x - 20}px`;
  targetBoxOptions.style.visibility = "visible";
};

const updateMousePosition = function (event) {
  if (event.type !== "mousemove") return;
  currentStats.mousePosition = `Mouse Position (in image): (${event.offsetX}, ${event.offsetY})`;
  const scaledPos = scaleUpPosition([event.offsetX, event.offsetY], image);
  currentStats.scaledMousePosition = `Scaled Mouse Position (in image): (${Math.round(
    scaledPos[0]
  )}, ${Math.round(scaledPos[1])})`;
  renderCurrentStats();
};

const updateClickPosition = function (event) {
  if (event.type !== "click") return;
  currentStats.clickedPosition = `Clicked Position (in image): (${event.offsetX}, ${event.offsetY})`;
  const scaledPos = scaleUpPosition(
    [event.offsetX, event.offsetY],
    image,
    scaleUpPosition
  );
  currentStats.scaledClickedPosition = `Scaled Clicked Position (in image): (${Math.round(
    scaledPos[0]
  )}, ${Math.round(scaledPos[1])})`;
  isWaldoFound = isPosInRectangle(scaledPos, waldoRegion);
  if (isWaldoFound && !endTime()) {
    stopTimer();
    currentStats.endTime = `End Time: ${Date(endTime())}`;
  }
  currentStats.didFindWaldo = `Found Waldo (point in area)? ${isWaldoFound}`;
  renderCurrentStats();
};

const updateImgStats = function (event) {
  if (event.type !== "load" && event.type !== "resize") return;
  currentStats.imgDimensions = `Image Dimensions: ${image.width} x ${image.height}`;
  currentStats.imgAspectRatio = `Image Aspect Ratio: ${
    image.width / image.height
  }`;
  currentStats.scaledWaldoRegion = `Scaled Waldo Region: ${rectangleCornersToString(
    scaleRegion(waldoRegion, image, scaleDownPosition)
  )}`;
  currentStats.imgScale = `Image Scale: ${scale(image)}`;
  currentStats.imgWidthScale = `Image Width Scale: ${widthScale(image)}`;
  currentStats.imgHeightScale = `Image Height Scale: ${heightScale(image)}`;
  renderCurrentStats();
};

imageDisplayed.addEventListener("load", (e) => {
  startTimer(updateTimeStats);
  currentStats.startTime = `Start Time: ${Date(startTime())}`;
  console.log("should be called only once");
});
image.addEventListener("mousemove", updateMousePosition);
image.addEventListener("click", (e) => {
  updateClickPosition(e);
  updateTargetBoxPosition(e);
  updateTargetBoxOptionsPosition(e);
});
window.addEventListener("load", updateImgStats);
window.addEventListener("resize", updateImgStats);
