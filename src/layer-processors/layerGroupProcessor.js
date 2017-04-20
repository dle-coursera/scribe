// @flow
import CSSModel from '../models/CSSModel';
import HTMLModel from '../models/HTMLModel';
import ComponentModel from '../models/ComponentModel';
import {processShapeLayer} from './shapeLayerProcessor';
import {processTextLayer, processBitmapLayer} from './primitiveObjectProcessor';
import { displayValues } from '../css-support/cssPropertyValues';
import { tags } from '../html-support/tags';
import { saveSvgToFile, globalIncludesMap } from '../fileSupport';

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

  if (name.includes('.svg')) {
    return processSVG(layerGroup, size);
  }

  let cssModel = new CSSModel([name]);
  cssModel.size = size;

  let parentComponent = new ComponentModel(cssModel);
  parentComponent.name = name;

  let isHorizontal = isHorizontalLayout(layers);
  const sortedLayers = sortLayers(layers);
  const layerEnumerator = sortedLayers.objectEnumerator();

  let lastLayer: any;
  while (layer = layerEnumerator.nextObject()) {
    let component: Component;

    if (isHorizontal) {
      parentComponent.cssModel.display = displayValues.flex;
    }

    // Padding computation needs to be here, because recursivly calling this function somehow sets to currently layer to null
    let padding: Padding;
    if (lastLayer) {
      const layerFrame = layer.rect();
      const lastLayerFrame = lastLayer.rect();

      if (isHorizontal) {
        padding = {
          left: layerFrame.origin.x - (lastLayerFrame.origin.x + lastLayerFrame.size.width),
        }
      } else {
        padding = {
          top: layerFrame.origin.y - (lastLayerFrame.origin.y + lastLayerFrame.size.height),
        }
      }
    } else {
      padding = {
        top: layer.rect().origin.y,
        left: layer.rect().origin.x,
      }
    }

    lastLayer = layer;

    if (layer.isKindOfClass(MSShapeGroup)) {
      component = processShapeLayer(layer);
    } else if (layer.isKindOfClass(MSLayerGroup)) {
      component = processLayerGroup(layer);
    } else if (layer.isKindOfClass(MSTextLayer)) {
      component = processTextLayer(layer);
    } else if (layer.isKindOfClass(MSBitmapLayer)) {
      component = processBitmapLayer(layer);
    }

    if (component) {
      component.cssModel.padding = padding;
      parentComponent.addChild(component);
    }
  }

  return parentComponent;
}

function processSVG(layerGroup, size) {
  const name = layerGroup.name();
  const sanitizedName = name.replace('.svg', 'SVG');

  saveSvgToFile(`${globalIncludesMap.assetDirectory}/${name}`, layerGroup);

  const cssModel = new CSSModel([sanitizedName]);
  cssModel.size = size;

  const parentComponent = new ComponentModel(cssModel);
  parentComponent.name = sanitizedName;

  const component = new ComponentModel(cssModel);
  component.htmlModel = new HTMLModel(tags.img, [sanitizedName]);
  component.htmlModel.src = `${globalIncludesMap.serverAssetDirectory}/${name}`;

  parentComponent.addChild(component);
  
  return parentComponent;
}

// Determine the order of layers based on a linear layout
function sortLayers(layers: Array<any>): Array<any> {
  return layers.sort((layerA, layerB) => {
    const frameA = layerA.rect();
    const frameB = layerB.rect();

    // Use the centroid of the layers to correct for layer overlapping.
    const centerAx = frameA.origin.x + frameA.size.width/2;
    const centerAy = frameA.origin.y + frameA.size.height/2;

    const centerBx = frameB.origin.x + frameB.size.width/2;
    const centerBy = frameB.origin.y + frameB.size.height/2;

    const xDiff = centerAx - centerBx;
    const yDiff = centerBy - centerBy;

    if (xDiff < 0 || yDiff < 0) {
      return -1; // Layer A comes before layer B
    } else if (xDiff > 0 || yDiff > 0) {
      return 1; // Layer B comes before Layer A
    } else {
      return 0; // Order is not deterministic
    }
  });
}

function isHorizontalLayout(layers: Array<any>): boolean {
  if (layers.length > 1) {
    const frameA = layers[0].rect();
    const frameB = layers[1].rect();
    // Check if the right edge of layer A is less than the left edge of layer B offset by 20% of the width
    return (frameA.origin.x + frameA.size.width) < (frameB.origin.x + frameB.size.width * 0.2);
  } else {
    return false;
  }
}
