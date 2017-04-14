import CSSModel from '../css-support/CSSModel';
import {getOutputDirectoryPath} from '../fileSupport';
import {pTag} from '../html-support/htmlSupport';
import {colorsAndBackground} from '../css-support/cssProperties';
import {hexColorForNSColor, opacityForNSColor} from '../layer-support/color';

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

  const folderPath = getOutputDirectoryPath('My Folder');
  console.log(folderPath);
  const tag = pTag(name, string);

  let hexColor = hexColorForNSColor(colorValue);
  let opacityValue = opacityForNSColor(colorValue);

  const {color, opacity} = colorsAndBackground;

  const cssProperties = {
    [color]: hexColor,
    [opacity]: opacityValue,
  }

  const css = new CSSModel([name, 'another-class'], cssProperties)
  console.log(css.generate());
  console.log(tag);

  // Frame
  // Transform
  // Typeface: Helvetica
  // Weight : Regular | Oblique | Lite | Lite Oblique | Bold | Bold Oblique
  // Color
  // Size
  // Alignment: Left | Center | Right | Full Adjusted
  // Opacity
}

export const processBitmapLayer = (bitmapLayer) => {
  console.log("This is a MSBitmapLayer");
}
