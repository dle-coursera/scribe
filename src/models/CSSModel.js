// @flow
import { boxModel, visualFormatting, colorsAndBackground } from '../css-support/cssProperties';
import { hexColorForNSColor, alphaForNSColor } from '../layer-support/color';
import { Padding, Size } from '../types';

export default class CSSModel {
  /*
  selectors: An array of selectors.
  properties: A dictionary of css properties and their values
  */
  constructor(selectors: Array<string>) {
    this.selectors = selectors;
    this.properties = {};
  }

  // Private. Should not be called externally.
  getTemplate(selectors: Array<string>, properties: any): string {
    const annotatedSelectors = selectors
      .map(selector => '.' + selector)
      .reduce((first, second) => first + ', ' + second);

    let combinedProperties = [];
    for (var key in properties) {
      const value = properties[key];
      combinedProperties.push(`${key}: ${value};`);
    }

    const propertyString = combinedProperties.reduce((first, second) => first + second);

    return `
    ${annotatedSelectors} {
      ${propertyString}
    }
    `;
  }

  set color(value: NSColor) {
    const { color } = colorsAndBackground;
    this.properties[color] = hexColorForNSColor(value);
  }

  set opacity(value: number) {
    const { opacity } = colorsAndBackground;

    if (opacity > 0) {
      this.properties[opacity] = value;
    } else {
      delete this.properties[opacity];
    }
  }

  set backgroundColor(value: NSColor) {
    const { backgroundColor } = colorsAndBackground;
    this.properties[backgroundColor] = hexColorForNSColor(value);
  }

  set size(size: Size) {
    const widthValue = size.width;
    const heightValue = size.height;

    const { width, height} = visualFormatting;

    if (widthValue && widthValue != 0) {
      this.properties[width] = widthValue;
    } else {
      delete this.properties[width];
    }

    if (heightValue && heightValue != 0) {
      this.properties[height] = heightValue;
    } else {
      delete this.properties[height];
    }
  }

  set padding(padding: Padding) {
    const top = padding.top;
    const right = padding.right;
    const bottom = padding.bottom;
    const left = padding.left;

    const {paddingTop, paddingRight, paddingBottom, paddingLeft} = boxModel;

    if (top && top != 0) {
      this.properties[paddingTop] = top;
    } else {
      delete this.properties[paddingTop];
    }

    if (right && right != 0) {
      this.properties[paddingRight] = right;
    } else {
      delete this.properties[paddingRight];
    }

    if (bottom && bottom != 0) {
      this.properties[paddingBottom] = bottom;
    } else {
      delete this.properties[paddingBottom];
    }

    if (left && left != 0) {
      this.properties[paddingLeft] = left;
    } else {
      delete this.properties[paddingLeft];
    }
  }

  generate(): string {
    return this.getTemplate(this.selectors, this.properties)
  }
}
