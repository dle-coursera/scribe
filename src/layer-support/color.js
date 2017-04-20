// @flow
import { NSColor, MSColor } from '../types';

export function hexColorForNSColor(color: NSColor): string {
  const red = color.redComponent();
  const green = color.greenComponent();
  const blue = color.blueComponent();

  return hexColorForRGB(red, green, blue);
}

export function hexColorForMSColor(color: MSColor): string {
  const red = color.red();
  const green = color.green();
  const blue = color.blue();

  return hexColorForRGB(red, green, blue);
}

export function opacityForNSColor(color: NSColor): number {
  return color.alphaComponent();
}

export function opacityForMSColor(color: MSColor): number {
  return color.alpha();
}

function hexColorForRGB(red: number, green: number, blue: number) {
  const hexMax = 255;
  const redHex = (red * hexMax).toString(16).toUpperCase().slice(0, 2);
  const greenHex = (green * hexMax).toString(16).toUpperCase().slice(0, 2);
  const blueHex = (blue * hexMax).toString(16).toUpperCase().slice(0, 2);

  return '#' + redHex + greenHex + blueHex;
}
