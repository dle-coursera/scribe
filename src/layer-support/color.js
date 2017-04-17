// @flow
import { NSColor } from '../types'

export function hexColorForNSColor(color: NSColor): string {
  const red = color.redComponent();
  const green = color.greenComponent();
  const blue = color.blueComponent();

  const redHex = ("0" + red.toString(16)).toUpperCase().slice(-2);
  const greenHex = ("0" + green.toString(16)).toUpperCase().slice(-2);
  const blueHex = ("0" + blue.toString(16)).toUpperCase().slice(-2);

  return '#' + redHex + greenHex + blueHex;
}

export function opacityForNSColor(color: NSColor): number {
  return color.alphaComponent();
}
