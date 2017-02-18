var $point1 = $('#point1');
var $point2 = $('#point2');
var $isTouching = $('#isTouching');
var $table = $('table');
var table = [];
var rows = 5;
var cols = 5;
var point1 = null;
var point2 = null;
var clickedCount = 0;

for (let x = 0; x < rows; x++) {
  var $tr = $('<tr></tr>')
  var row = [];
  for (let y = 0; y < cols; y++) {
    var $col = $('<td>' + x + ',' + y + '</td>');
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
    var touching = isTouching(point1[0], point1[1], point2[0], point2[1]) ? 'true' : 'false';
    $isTouching.html(touching)
  } else {
    $isTouching.html('');
  }
}

function isTouching(x1, y1, x2, y2) {
  // check left/right
  if ((y1 === y2) && (x1 + 1 === x2 || x1 - 1 === x2))
    return true;

  // check up/down
  if ((x1 === x2) && (y1 + 1 === y2 || y1 - 1 === y2))
    return true;

  // check right corners
  if ((x1 + 1 === x2) && (y1 + 1 === y2 || y1 - 1 === y2))
    return true;

  // check left corners
  if ((x1 - 1 === x2) && (y1 + 1 === y2 || y1 - 1 === y2))
    return true;

  return false;
}
