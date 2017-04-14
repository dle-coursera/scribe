import {processShapeLayer} from './shapeLayerProcessor'
import {processTextLayer, processBitmapLayer} from './primitiveObjectProcessor'

export const processLayerGroup = (layerGroup) => {
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
