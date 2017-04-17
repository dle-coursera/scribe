// @flow
import {processShapeLayer} from './shapeLayerProcessor';
import {processTextLayer, processBitmapLayer} from './primitiveObjectProcessor';


import {
  CGRect,
  Padding,
} from '../types';

export function processLayerGroup(layerGroup: MSLayerGroup) {
  console.log("This is a MSLayerGroup...");
  const layers: Array<any> = layerGroup.layers();
  const name: string = layerGroup.name();
  const frame: CGRect = layerGroup.rect();

  // TODO: Create group component

  const size: Size = {
    width: frame.size.width,
    height: frame.size.height,
  }

  console.log(name);
  console.log(frame);

  // const cssModel = new CSSModel([name])
  // cssModel.color = colorValue;
  // cssModel.opacity = opacityForNSColor(colorValue);
  // cssModel.size = size;
  //
  // const htmlModel = new HTMLModel(tags.p, [name], contentString);
  //
  // return new ComponentModel(htmlModel, cssModel);

  const layerEnumerator = layers.objectEnumerator();
  while (layer = layerEnumerator.nextObject()) {
    let component: Component;
    if (layer.isKindOfClass(MSShapeGroup)) {
      component = processShapeLayer(layer);
    } else if (layer.isKindOfClass(MSLayerGroup)) {
      component = processLayerGroup(layer);
    } else if (layer.isKindOfClass(MSTextLayer)) {
      component = processTextLayer(layer);
    } else if (layer.isKindOfClass(MSBitmapLayer)) {
      processBitmapLayer(layer);
    }

    if (component) {
      component.cssModel.padding = paddingForLayer(layer, frame);
      console.log(component.cssModel.generate());
      console.log(component.htmlModel.generate());
    }
  }
}

function paddingForLayer(layer: any, containerFrame: CGRect): Padding {
  const layerFrame = layer.rect();

  const padding: Padding = {
    top: layerFrame.origin.y,
    right: containerFrame.size.width - (layerFrame.origin.x + layerFrame.size.width),
    bottom: containerFrame.size.height - (layerFrame.origin.y + layerFrame.size.height),
    left: layerFrame.origin.x
  }

  return padding
}
