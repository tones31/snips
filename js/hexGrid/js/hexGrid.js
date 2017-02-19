var $point1 = $('#point1');
var $point2 = $('#point2');
var $isTouching = $('#isTouching');
var $table = $('#hexTable');
var table = [];
var rows = 10;
var cols = 5;
var point1 = null;
var point2 = null;
var clickedCount = 0;

for (let y = 0; y < rows; y++) {
  var $tr = $('<div class="hexagonRow"></div>')
  var row = [];
  for (let x = 0; x < cols; x++) {
    var $col = $('<div class="hexagon"><div class="hexagonText">' + x + ',' + y + '</div></div>');
    $col.click(function() {
      if (clickPoint(x, y))
        $(this).toggleClass('clicked');
    });
    $tr.append($col);
    row.push(y);
  }
  $table.append($tr);
  table.push(row);
}

function clickPoint(x, y) {
  var clicked = true;
  if (point1 && point1[0] === x && point1[1] === y) {
    point1 = null;
    clickedCount--;
  } else if (point2 && point2[0] === x && point2[1] === y) {
    point2 = null;
    clickedCount--;
  } else if (!point1 && clickedCount < 3) {
    point1 = [x, y];
    clickedCount++;
  } else if (!point2 && clickedCount < 3) {
    point2 = [x, y];
    clickedCount++;
  } else {
    clicked = false;
  }

  updateDisplay();
  return clicked;
}

function updateDisplay() {
  if (point1)
    $point1.html(point1[0] + ',' + point1[1])
  else
    $point1.html('');
  if (point2)
    $point2.html(point2[0] + ',' + point2[1])
  else
    $point2.html('');

  if (point1 && point2) {
    var touching = isTouchingHex(point1[0], point1[1], point2[0], point2[1]) ? 'true' : 'false';
    $isTouching.html(touching)
  } else {
    $isTouching.html('');
  }
}

function isTouchingHex(x1, y1, x2, y2) {
  var deltaX = x1 - x2;
  var deltaY = y1 - y2;

  // check same x
  if (deltaX === 0) {
    switch (deltaY) {
      // check bottom right
      case -1:
        // check bottom
      case -2:
        // check top right
      case 1:
        // check above
      case 2:
        return true;
        break;
    }
  } else if (deltaX === 1) {
    switch (deltaY) {
      // check bottom left
      case -1:
        // check top left
      case 1:
        return true;
        break;
    }
  }

  return false;
}
