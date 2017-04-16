import CSSModel from '../css-support/CSSModel';
import {pTag} from '../html-support/htmlSupport';
import {colorsAndBackground} from '../css-support/cssProperties';
import {hexColorForNSColor, opacityForNSColor} from '../layer-support/color';
import ComponentModel from '../models/ComponentModel'

export const processTextLayer = (textLayer) => {
  console.log("This is a MSTextLayer");
  const attributedString = textLayer.attributedString().attributedString();

  const length = attributedString.length();
  const range = NSMakeRange(0, length);
  const fontAttributes = attributedString.fontAttributesInRange(range);

  const string = attributedString.string();
  const frame = textLayer.rect();
  const name = textLayer.name();
  const colorValue = fontAttributes['NSColor'];
  const font = fontAttributes['NSFont'];

  const tag = pTag(name, string);

  let hexColor = hexColorForNSColor(colorValue);
  let opacityValue = opacityForNSColor(colorValue);

  const {color, opacity} = colorsAndBackground;

  const cssProperties = {
    [color]: hexColor,
    [opacity]: opacityValue,
  }

  const css = new CSSModel([name, 'another-class'], cssProperties)
  return new ComponentModel(tag, css);

  // Frame
  // Typeface: Helvetica
  // Weight : Regular | Oblique | Lite | Lite Oblique | Bold | Bold Oblique
  // Size
  // Alignment: Left | Center | Right | Full Adjusted
}

export const processBitmapLayer = (bitmapLayer) => {
  console.log("This is a MSBitmapLayer");
}
