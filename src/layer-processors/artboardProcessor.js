import {processLayerGroup} from './layerGroupProcessor'
import {processTextLayer, processBitmapLayer} from './primitiveObjectProcessor'

export const processArtboards = (artboards) => {
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