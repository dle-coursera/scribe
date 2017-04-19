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
  const redHex = ("0" + red.toString(16)).toUpperCase().slice(-2);
  const greenHex = ("0" + green.toString(16)).toUpperCase().slice(-2);
  const blueHex = ("0" + blue.toString(16)).toUpperCase().slice(-2);

  return '#' + redHex + greenHex + blueHex;
}
