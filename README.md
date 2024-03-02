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
- [x] Figure out formula or function for normalizing any position clicked by the player regardless of the rendered image size
- [ ] Make the target box work
  - [x] Update its position to the last position clicked by the mouse when the player clicks on the image
  - [x] When positioned, the box should have the position clicked by the mouse as its center
  - [ ] ~~When the window size changes, the box should scale up or down accordingly~~
  - [ ] ~~When positioned, check if the target box area overlaps with the region of a character to be found~~
- [ ] Make the target box options work
  - [x] Display list of characters to identify the object in the target box
  - [ ] Update the app state if needed when any of its buttons options (buttons) are clicked
  - [ ] "Close" the target box and target box options by hiding them if any of its buttons are clicked
- [x] Make the timer work?
  - [x] Start counting when image loads
  - [x] Stop counting when player finds all characters
  - [x] Show a timer that updates every second
