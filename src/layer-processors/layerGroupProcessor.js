// @flow
import CSSModel from '../models/CSSModel';
import ComponentModel from '../models/ComponentModel';
import {processShapeLayer} from './shapeLayerProcessor';
import {processTextLayer, processBitmapLayer} from './primitiveObjectProcessor';

import {
  CGRect,
  Padding,
} from '../types';

export function processLayerGroup(layerGroup: MSLayerGroup): ComponentModel  {
  console.log("This is a MSLayerGroup...");
  const layers: Array<any> = layerGroup.layers();
  const name: string = layerGroup.name();
  const frame: CGRect = layerGroup.rect();

  const size: Size = {
    width: frame.size.width,
    height: frame.size.height,
  }

  let cssModel = new CSSModel(name);
  cssModel.size = size;

  let parentComponent = new ComponentModel(cssModel);
  parentComponent.name = name;

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
      component.cssModel.padding = paddingForLayer(layer.rect(), frame);
      parentComponent.addChild(component);
    }
  }

  return parentComponent;
}

function paddingForLayer(layerFrame: CGRect, containerFrame: CGRect): Padding {
  const padding: Padding = {
    top: layerFrame.origin.y,
    right: containerFrame.size.width - (layerFrame.origin.x + layerFrame.size.width),
    bottom: containerFrame.size.height - (layerFrame.origin.y + layerFrame.size.height),
    left: layerFrame.origin.x
  }

  return padding
}
