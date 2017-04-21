// @flow
import CSSModel from '../models/CSSModel';
import HTMLModel from '../models/HTMLModel';
import ComponentModel from '../models/ComponentModel';
import { processShapeLayer } from './shapeLayerProcessor';
import { processTextLayer, processBitmapLayer } from './primitiveObjectProcessor';
import { displayValues, justifyContentValues, alignItemsValues, positionValues } from '../css-support/cssPropertyValues';
import { tags } from '../html-support/tags';
import { saveSvgToFile, globalIncludesMap, fileFormats } from '../fileSupport';
import { hexColorForMSColor } from '../layer-support/color';

import {
  CGRect,
  Margin,
  SCType,
} from '../types';

export function processLayerGroup(layerGroup: MSLayerGroup, isRootLayer: boolean): ComponentModel  {
  const layers: Array<any> = layerGroup.layers();
  const name: string = layerGroup.name();
  const frame: CGRect = layerGroup.rect();

  if (name.includes(fileFormats.svg)) {
    return processSvgLayerGroup(layerGroup);
  } else if (name.startsWith(SCType.SCBackground)) {
    return processBackgroundLayerGroup(layerGroup);
  } else if (name.startsWith(SCType.SCList)) {
    return processListLayerGroup(layerGroup);
  } else {
    return processNormalLayerGroup(layerGroup, isRootLayer);
  }
}

function processBackgroundLayerGroup(layerGroup: MSLayerGroup): ComponentModel {
  const layers: Array<any> = layerGroup.layers();
  const name: string = sanitizeGroupName(layerGroup.name());
  const frame: CGRect = layerGroup.rect();

  const size: Size = {
    width: 100,
    height: 100,
    isPercent: true,
  }

  let cssModel = new CSSModel([name]);
  cssModel.size = size;

  const parentComponent = new ComponentModel(cssModel);
  parentComponent.name = name;

  cssModel = new CSSModel([name]);
  cssModel.size = size;
  const component = new ComponentModel(cssModel);
  component.htmlModel = new HTMLModel(tags.div, [name]);
  parentComponent.addChild(component);

  const layerEnumerator = layers.objectEnumerator();
  while (layer = layerEnumerator.nextObject()) {
    const childName = layer.name();
    if (layer.isKindOfClass(MSBitmapLayer)) {
      component.addAsset(layer.image());
      cssModel.position = positionValues.absolute;
      cssModel.zIndex = -1;
    } else if (layer.isKindOfClass(MSShapeGroup)) {
      parentComponent.cssModel.backgroundColor = hexColorForMSColor(layer.style().fills()[0].colorGeneric());
    }
  }

  return parentComponent;
}

/*
  An SCList should only contain SCRow items. Currently everything else will be ignored.
*/
function processListLayerGroup(layerGroup: MSLayerGroup): ComponentModel {
  const layers: Array<any> = layerGroup.layers();
  const name: string = sanitizeGroupName(layerGroup.name());
  const parentFrame: CGRect = layerGroup.rect();

  const size: Size = {
    width: parentFrame.size.width,
    height: parentFrame.size.height,
  }

  let cssModel = new CSSModel([name]);
  cssModel.size = size;

  let parentComponent = new ComponentModel(cssModel);
  parentComponent.name = name;
  parentComponent.frame = parentFrame;

  // The content of the list will be filled in when generate is called. Undefined for now.
  parentComponent.htmlModel = new HTMLModel(tags.ul, [name]);

  // Rows are sorted based on their position in the design
  const sortedLayers = layers.sort((layerA, layerB) => {
    const frameA = layerA.rect();
    const frameB = layerB.rect();
    return frameA.origin.y - frameB.origin.y;
  });

  let lastLayer: any;
  const layerEnumerator = sortedLayers.objectEnumerator();
  while (layer = layerEnumerator.nextObject()) {
    const childName = layer.name();
    // We only want to process SCRow groups for now
    if (layer.isKindOfClass(MSLayerGroup) && childName.startsWith(SCType.SCRow)) {
      const childFrame = layer.rect();
      const component: Component = processNormalLayerGroup(layer);
      // Component inside a row should not have a size
      component.cssModel.size = {};
      component.cssModel.margin = {
        left: childFrame.origin.x,
      };

      parentComponent.addChild(component);
    }
    // TODO: Recursively call processListLayerGroup if a child list is detected
  }

  return parentComponent;
}

/*
  This is used to process a layer group.
*/
function processNormalLayerGroup(layerGroup: MSLayerGroup, isRootLayer: boolean): ComponentModel {
  const layers: Array<any> = layerGroup.layers();
  const name: string = sanitizeGroupName(layerGroup.name());
  const parentFrame: CGRect = layerGroup.rect();

  const size: Size = {
    width: parentFrame.size.width,
    height: parentFrame.size.height,
  }

  let isHorizontal = isHorizontalLayout(layers);

  let cssModel = new CSSModel([name]);
  cssModel.size = size;

  let parentComponent = new ComponentModel(cssModel);
  parentComponent.name = name;
  parentComponent.frame = parentFrame;
  parentComponent.isHorizontalLayout = isHorizontal;

  const sortedLayers = sortLayers(layers);
  const layerEnumerator = sortedLayers.objectEnumerator();

  let lastLayer: any;
  let hasBackgroundLayer: boolean = false;
  while (layer = layerEnumerator.nextObject()) {
    let component: Component;

    if (isHorizontal) {
      parentComponent.cssModel.display = displayValues.flex;
    }

    // Margin computation needs to be here, because recursivly calling this function somehow sets to currently layer to null
    let margin: Margin;

    if (lastLayer) {
      const layerFrame = layer.rect();
      const lastLayerFrame = lastLayer.rect();

      if (isHorizontal) {
        margin = {
          left: layerFrame.origin.x - (lastLayerFrame.origin.x + lastLayerFrame.size.width),
        }
      } else if (lastLayer.name().startsWith(SCType.SCBackground)) {
        hasBackgroundLayer = true;
        margin = {
          top: layerFrame.origin.y - lastLayerFrame.origin.y,
        }
      } else {
        margin = {
          top: layerFrame.origin.y - (lastLayerFrame.origin.y + lastLayerFrame.size.height),
        }
      }
    } else {
      margin = {
        top: layer.rect().origin.y,
        left: layer.rect().origin.x,
      }
    }

    // When enumerating over the direct child layers of the root layer,
    // add the left margin, since they won't necessarily be part of a linear layout
    // Also do the same when there's an absolute positioned background layer
    if (isRootLayer || hasBackgroundLayer) {
      margin.left = layer.rect().origin.x;
    };

    if (hasBackgroundLayer) {
      parentComponent.cssModel.position = positionValues.relative;
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
      component.cssModel.margin = margin;
      parentComponent.addChild(component);
    }
  }

  return parentComponent;
}

/*
  This is used to process a SVG layer group.
*/
function processSvgLayerGroup(layerGroup: MSLayerGroup): ComponentModel {
  const layers: Array<any> = layerGroup.layers();
  const name: string = sanitizeGroupName(layerGroup.name());
  const frame: CGRect = layerGroup.rect();
  const sanitizedName: string = name.replace(fileFormats.svg, 'SVG');

  const size: Size = {
    width: frame.size.width,
    height: frame.size.height,
  }

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
  let isHorizontal = isHorizontalLayout(layers);

  return layers.sort((layerA, layerB) => {
    let frameA = layerA.rect();
    let frameB = layerB.rect();
    if (isHorizontal) {
      return (frameA.origin.x < frameB.origin.x) ? -1 : 1;
    } else {
      return (frameA.origin.y < frameB.origin.y) ? -1 : 1;
    }
  });
}

function frameToString(frame: CGRect): string {
  return `x:${frame.origin.x} y:${frame.origin.y} w:${frame.size.width} h:${frame.size.height}`;
}

function isHorizontalLayout(layers: Array<any>): boolean {
  if (layers.length > 1) {
    let frameA = layers[0].rect();
    let frameB = layers[1].rect();

    // Swap if frameA origin is greater than frameB origin
    if (frameA.origin.x > frameB.origin.x) {
      frameA = layers[1].rect();
      frameB = layers[0].rect();
    }

    // Check if the right edge of layer A is less than the left edge of layer B offset by 20% of the width
    return (frameA.origin.x + frameA.size.width) < (frameB.origin.x + frameB.size.width * 0.2);
  } else {
    return false;
  }
}

function sanitizeGroupName(name: string): string {
  const typeList = [SCType.SCList, SCType.SCRow];
  let newName = name;
  for(var i = 0; i < typeList.length; i++) {
    // Remove stuff like SCList_, SCRow_, etc.
    newName = newName.replace(`${typeList[i]}_`, '');
  }
  return newName;
}
