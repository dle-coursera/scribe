import Frame from './Frame'

export default function (context) {
  context.document.showMessage('It\'s alive 333 🙌')
  const documentName = context.document.displayName();
  const document = context.document;
  const pages = document.pages();

  for (var i = 0; i < pages.count(); i++) {
    const page = pages[i];
    console.log(`Page: ${page.name()}`);
    processArtboards(page.artboards());
  }

  // const sketch = context.api();
  // const doc = sketch.selectedDocument;

  var selectedLayers = context.selection;
  var selectedCount = selectedLayers.count();

  for (var i = 0; i < selectedLayers.count(); i++) {
    const layer = selectedLayers[i];
    const name = layer.name();
    const style = layer.style();
    const frame = layer.frame();

    // const layerFrame = this.getLayerFrame(layer);
    // console.log(layerFrame.width);

    const frameLayer = getLayerFrame(layer);
    console.log(frameLayer);

    const color = getLayerColor(layer);
    console.log(color);
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

// MSLayerGroup
// MSTextLayer
// Shape

// "<MSLayerGroup: 0x6080001d6530> Banner:React (CA2A2B41-877B-4D67-9BF4-17EF57B98635)",
// "<MSTextLayer: 0x7fa0d1cd7e50> Standalone text (E6280CC4-9019-4B64-97D8-389343963FC8)",
// "<MSShapeGroup: 0x6180003e9400> Path 2 (7C5E5053-4D03-468D-8E76-15B9BDC237D8)",
// "<MSBitmapLayer: 0x7fa0d1cdcfd0> Screen Shot 2017-04-13 at 7.31.56 AM (73AA47C3-95F6-4212-A0B7-F616CEBAE39D)",
// "<MSShapeGroup: 0x6000005e6c00> Oval (158FC073-33D5-45EF-AF69-0672EAED4C8F)"

// A layer can be MSLayerGroup, MSTextLayer, MSShapeGroup, MSBitmapLayer, etc.
function processArtboardLayers(layers) {
  for (var i = 0; i < layers.count(); i++) {
    const layer = layers[i];
    console.log(layer.name());
  }
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
