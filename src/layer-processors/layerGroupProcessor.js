// @flow
import {processShapeLayer} from './shapeLayerProcessor';
import {processTextLayer, processBitmapLayer} from './primitiveObjectProcessor';

import {
  CGRect
} from '../types';

export function processLayerGroup(layerGroup: MSLayerGroup) {
  console.log("This is a MSLayerGroup...");
  const layers: Array<any> = layerGroup.layers();
  const name: string = layerGroup.name();
  const rect: CGRect = layerGroup.rect();

  const layerEnumerator = layers.objectEnumerator();
  while (layer = layerEnumerator.nextObject()) {
    if (layer.isKindOfClass(MSShapeGroup)) {
      processShapeLayer(layer);
    } else if (layer.isKindOfClass(MSLayerGroup)) {
      processLayerGroup(layer);
    } else if (layer.isKindOfClass(MSTextLayer)) {
      const component = processTextLayer(layer);
      console.log(component.cssModel.generate());
      console.log(component.htmlModel.generate());
    } else if (layer.isKindOfClass(MSBitmapLayer)) {
      processBitmapLayer(layer);
    }
  }
}
