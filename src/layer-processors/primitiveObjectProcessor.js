// @flow
import CSSModel from '../models/CSSModel';
import HTMLModel from '../models/HTMLModel';
import ComponentModel from '../models/ComponentModel';
import { tags } from '../html-support/tags';

import { opacityForNSColor } from '../layer-support/color';

import {
  NSColor,
  NSFont,
  Size,
  Padding,
  CGRect,
  MSTextLayer,
  MSBitmapLayer,
} from '../types';

export function processTextLayer(textLayer: MSTextLayer) {
  const attributedString = textLayer.attributedString().attributedString();

  const length = attributedString.length();
  const range = NSMakeRange(0, length);
  const fontAttributes = attributedString.fontAttributesInRange(range);

  const contentString = attributedString.string();
  const frame: CGRect = textLayer.rect();
  const name: string = textLayer.name();
  const colorValue: NSColor = fontAttributes['NSColor'];
  const font: NSFont = fontAttributes['NSFont'];

  const size: Size = {
    width: frame.size.width,
    height: frame.size.height,
  }

  const cssModel = new CSSModel([name])
  cssModel.color = colorValue;
  cssModel.opacity = opacityForNSColor(colorValue);
  cssModel.size = size;

  const htmlModel = new HTMLModel(tags.p, [name], contentString);

  return new ComponentModel(htmlModel, cssModel);

  // Typeface: Helvetica
  // Weight : Regular | Oblique | Lite | Lite Oblique | Bold | Bold Oblique
  // Size
  // Alignment: Left | Center | Right | Full Adjusted
}

export function processBitmapLayer(bitmapLayer: MSBitmapLayer) {
  console.log("This is a MSBitmapLayer");
}
