// @flow
import {processLayerGroup} from './layerGroupProcessor';
import {processTextLayer, processBitmapLayer} from './primitiveObjectProcessor';

import { MSArtboardGroup } from '../types';
import { globalIncludesMap } from '../fileSupport';
import { createMappingFile } from '../fileSupport';

export function processArtboards(artboards: Array<MSArtboardGroup>) {
  const artboardEnumerator = artboards.objectEnumerator();
  while (artboard = artboardEnumerator.nextObject()) {
    const artboardName: string = artboard.name().trim();
    console.log(`Artboard: ${artboardName}`);
    processArtboardLayers(artboard.layers());
  }
  createMappingFile();
}

/*
  This process layers in an artboard
  A layer can be MSLayerGroup, MSTextLayer, MSShapeGroup, MSBitmapLayer, etc.

  MSLayerGroup is a collection of other objects. MSLayerGroup can have children of MSLayerGroup.
*/
function processArtboardLayers(layers: Array<any>) {
  const layerEnumerator = layers.objectEnumerator();
  let isRootLayer = true;
  while (layer = layerEnumerator.nextObject()) {
    if (layer.isKindOfClass(MSShapeGroup)) { // this can be a path, oval or rectangle, etc
      // TODO: This can be a path, oval, rectangle, etc
      console.log("Shapes are not yet supported");
    } else if (layer.isKindOfClass(MSLayerGroup)) {
      let component = processLayerGroup(layer, isRootLayer);
      isRootLayer = false;
      component.generate();
    } else if (layer.isKindOfClass(MSTextLayer)) {
      processTextLayer(layer);
    } else if (layer.isKindOfClass(MSBitmapLayer)) {
      processBitmapLayer(layer);
    }
  }
}
