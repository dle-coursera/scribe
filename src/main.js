import Frame from './Frame'

export default function (context) {
  context.document.showMessage('It\'s alive 333 🙌')
  const documentName = context.document.displayName();
  const document = context.document;
  const pages = document.pages();

  const pageEnumerator = pages.objectEnumerator();
  while (page = pageEnumerator.nextObject()) {
    console.log(`Page: ${page.name()}`);
    processArtboards(page.artboards());
  }
}

function processArtboards(artboards) {
  const artboardEnumerator = artboards.objectEnumerator();
  while (artboard = artboardEnumerator.nextObject()) {
    const artboardName = artboard.name().trim();
    console.log(`Artboard: ${artboardName}`);
    processArtboardLayers(artboard.layers());
  }
}

/*
  This process layers in an artboard
  A layer can be MSLayerGroup, MSTextLayer, MSShapeGroup, MSBitmapLayer, etc.

  MSLayerGroup is a collection of other objects. MSLayerGroup can have children of MSLayerGroup.
*/
function processArtboardLayers(layers) {
  const layerEnumerator = layers.objectEnumerator();
  while (layer = layerEnumerator.nextObject()) {
    console.log(`Layer: ${layer.name()} ${layer}`);
    if (layer.isKindOfClass(MSShapeGroup)) { // this can be a path, oval or rectangle, etc
      // TODO: This can be a path, oval, rectangle, etc
      console.log("Shapes are not yet supported");
    } else if (layer.isKindOfClass(MSLayerGroup)) {
      processLayerGroup(layer);
    } else if (layer.isKindOfClass(MSTextLayer)) {
      processTextLayer(layer);
    } else if (layer.isKindOfClass(MSBitmapLayer)) {
      processBitmapLayer(layer);
    }
  }
}

function processLayerGroup(layerGroup) {
  console.log("This is a MSLayerGroup...");
  const layers = layerGroup.layers();

  const name = layerGroup.name();
  const rect = layerGroup.rect();

  const layerEnumerator = layers.objectEnumerator();
  while (layer = layerEnumerator.nextObject()) {
    if (layer.isKindOfClass(MSShapeGroup)) {
      processShapeLayer(layer);
    } else if (layer.isKindOfClass(MSLayerGroup)) {
      processLayerGroup(layer);
    } else if (layer.isKindOfClass(MSTextLayer)) {
      processTextLayer(layer);
    } else if (layer.isKindOfClass(MSBitmapLayer)) {
      processBitmapLayer(layer);
    }
  }
}

function processShapeLayer(shapeLayer) {
  console.log("This is a shape layer");
}

function processTextLayer(textLayer) {
  console.log("This is a MSTextLayer");
}

function processBitmapLayer(bitmapLayer) {
  console.log("This is a MSBitmapLayer");
}

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
