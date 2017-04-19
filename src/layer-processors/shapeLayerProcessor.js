// @flow
import CSSModel from '../models/CSSModel';
import HTMLModel from '../models/HTMLModel';
import ComponentModel from '../models/ComponentModel';
import { tags } from '../html-support/tags';
import { hexColorForMSColor } from '../layer-support/color';
import { px } from '../css-support/units';
import { positionValues } from '../css-support/cssPropertyValues';

import {
  MSShapeGroup,
  CGRect,
  MSStyle,
  MSStyleFill,
  MSStyleBorder,
  MSColor
} from '../types';

export function processShapeLayer(shapeLayer: MSShapeGroup): ComponentModel {
  console.log("This is a shape layer");
  const layers = shapeLayer.layers()
  const layerEnumerator = layers.objectEnumerator();

  while (layer = layerEnumerator.nextObject()) {
    if (layer.isKindOfClass(MSRectangleShape)) { // A rectangle
      return processRectangle(layer, shapeLayer);
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

function processRectangle(rectangle: MSRectangleShape, shapeLayer: MSShapeGroup): ComponentModel {
  console.log("A rectangle");
  const frame: CGRect = shapeLayer.rect();
  const name: string = shapeLayer.name();

  const size: Size = {
    width: frame.size.width,
    height: frame.size.height,
  }

  const style: MSStyle = shapeLayer.styleGeneric();
  const fill: MSStyleFill = style.fill();
  const fillColor: MSColor = fill.colorGeneric();
  const hexFillColor: string = hexColorForMSColor(fillColor);

  const border: MSStyleBorder = style.border();
  const borderColor: MSColor = border.colorGeneric();
  const hexBorderColor: string = hexColorForMSColor(borderColor);
  const thickness: number = border.thickness();

  const cssModel = new CSSModel([name])
  cssModel.size = size;
  cssModel.backgroundColor = hexFillColor;
  cssModel.borderColor = hexBorderColor;
  cssModel.borderWidth = px(thickness);

  // Shapes are not part of the layout. This might change in the future.
  cssModel.position = positionValues.absolute;
  cssModel.zIndex = -1;

  const component = new ComponentModel(cssModel);
  component.htmlModel = new HTMLModel(tags.div, [name]);

  return component;
}
