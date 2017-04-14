function getLayerFrame(layer) {
  const absRect = layer.absoluteRect().rect();
  return new Frame(absRect.origin.x, absRect.origin.y, absRect.size.width, absRect.size.height);
}

function getLayerColor(layer) {
  const color = layer.style().fills().firstObject().color();
  var red = color.red().toFixed(3).toString();
  var green = color.green().toFixed(3).toString();
  var blue = color.blue().toFixed(3).toString();
  var alpha = color.alpha().toFixed(3).toString();

  return [red, green, blue, alpha];
}

/*
var selectedLayers = context.selection;
var selectedCount = selectedLayers.count();

for (var i = 0; i < selectedLayers.count(); i++) {
  const layer = selectedLayers[i];
  const name = layer.name();
  const style = layer.style();
  const frame = layer.frame();

  const frameLayer = getLayerFrame(layer);
  console.log(frameLayer);

  const color = getLayerColor(layer);
  console.log(color);
}
*/
