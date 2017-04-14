import Frame from './models/Frame';
import CSSModel from './css-support/CSSModel';
import {getOutputDirectoryPath} from './fileSupport';
import {pTag} from './html-support/htmlSupport';

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
  const layers = shapeLayer.layers()
  const layerEnumerator = layers.objectEnumerator();
  while (layer = layerEnumerator.nextObject()) {
    if (layer.isKindOfClass(MSRectangleShape)) { // A rectangle
      console.log("A rectangle");
    } else if (layer.isKindOfClass(MSOvalShape)) { // An oval
      console.log("An oval");
    } else if (layer.isKindOfClass(MSStarShape)) {
      console.log("A star");
    } else if (layer.isKindOfClass(MSPolygonShape)) {
      console.log("A polygon");
    } else if (layer.isKindOfClass(MSTriangleShape)) {
      console.log("A triangle");
    } else if (layer.isKindOfClass(MSShapePathLayer)) { // Can be a line or a line with arrow at the end
      console.log("Line or line with arrow");
    }
  }
}

function processTextLayer(textLayer) {
  console.log("This is a MSTextLayer");
  const attributedString = textLayer.attributedString().attributedString();

  const length = attributedString.length();
  const range = NSMakeRange(0, length);
  const fontAttributes = attributedString.fontAttributesInRange(range);

  const string = attributedString.string();
  const frame = textLayer.rect();
  const name = textLayer.name();
  const color = fontAttributes['NSColor'];
  const font = fontAttributes['NSFont'];

  console.log(color);
  console.log(font);

  const folderPath = getOutputDirectoryPath('My Folder');
  console.log(folderPath);

  console.log(string);
  const tag = pTag('myClass class2', string);
  console.log(tag);

  // Frame
  // Transform
  // Typeface: Helvetica
  // Weight : Regular | Oblique | Lite | Lite Oblique | Bold | Bold Oblique
  // Color
  // Size
  // Alignment: Left | Center | Right | Full Adjusted
  // Opacity
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
