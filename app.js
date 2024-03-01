// query selectors
const image = document.querySelector("#image");
const originalStatsContent = document.querySelector("#original-stats-content");
const currentStatsContent = document.querySelector("#current-stats-content");

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
};

const renderCurrentStats = function () {
  currentStatsContent.textContent = Object.values(currentStats).join("\n");
};

renderCurrentStats();

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
  currentStats.didFindWaldo = `Found Waldo (point in area)? ${isPosInRectangle(
    scaledPos,
    waldoRegion
  )}`;
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

image.addEventListener("mousemove", updateMousePosition);
image.addEventListener("click", updateClickPosition);
window.addEventListener("load", updateImgStats);
window.addEventListener("resize", updateImgStats);
