// @flow
import CSSModel from '../models/CSSModel';
import HTMLModel from '../models/HTMLModel';
import ComponentModel from '../models/ComponentModel';
import { MSShapeGroup, CGRect } from '../types';
import { tags } from '../html-support/tags';

export function processShapeLayer(shapeLayer: MSShapeGroup): ComponentModel {
  console.log("This is a shape layer");
  const layers = shapeLayer.layers()
  const layerEnumerator = layers.objectEnumerator();
  while (layer = layerEnumerator.nextObject()) {
    if (layer.isKindOfClass(MSRectangleShape)) { // A rectangle
      return processRectangle(layer);
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

function processRectangle(rectangle: MSRectangle) {
  console.log("A rectangle");
  const frame: CGRect = rectangle.rect();
  const name: string = rectangle.name();

  const size: Size = {
    width: frame.size.width,
    height: frame.size.height,
  }

  const cssModel = new CSSModel([name])
  cssModel.size = size;

  const component = new ComponentModel(cssModel);
  component.htmlModel = new HTMLModel(tags.div, [name]);

  return component;
}
