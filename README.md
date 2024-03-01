# Where's Waldo MVP

This is a project to build a barebones MVP version of a basic client-side only Where's Waldo game web app.

## Todos

- [x] Display static stats on page:
  - [x] Original dimensions of image
  - [x] Original aspect ratio of image
  - [x] Original rectangular region occupied by Waldo (by coordinates of the area's 4 corners)
- [x] Display dynamic stats on page:
  - [x] Current cursor position relative to the image
  - [x] Current dimension of image
  - [x] Current aspect radio of image (should be same as original)
  - [x] Current rectangular region occupied by Waldo (by 4 corners' positions)
  - [x] Current scale factor of image (compared to original size)
  - [x] Current mouse position relative to the position
  - [x] Is clicked position within the Waldo region?
  - [ ] Is clicked target area within the Waldo region?
- [x] Figure out formula or function for normalizing any position clicked by the player regardless of the rendered image size
- [ ] Make the target box work
  - [ ] TODO
