// @flow
import { boxModel, visualFormatting, colorsAndBackground, flexbox } from '../css-support/cssProperties';
import { hexColorForNSColor, alphaForNSColor } from '../layer-support/color';
import { Padding, Size, Margin } from '../types';
import { px } from '../css-support/units';

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

  // value can be obtained from cssPropertyValues.justifyContentValues
  set justifyContent(value: string) {
    const { justifyContent } = flexbox;
    this.properties[justifyContent] = value
  }

  // value can be obtained from cssPropertyValues.alignItemsValues
  set alignItems(value: string) {
    const { alignItems } = flexbox;
    this.properties[alignItems] = value;
  }

  // value can be obtained from cssPropertyValues.displayValues
  set display(value: string) {
    const { display } = visualFormatting;
    this.properties[display] = value;
  }

  // value can be obtained from cssPropertyValues.positionValues
  set position(value: string) {
    const { position } = visualFormatting;
    this.properties[position] = value;
  }

  set zIndex(value: number) {
    const { zIndex } = visualFormatting;
    this.properties[zIndex] = value;
  }

  // The styles should be retrieved from fontSupport.cssFontStylesForFont
  set fontStyles(styles: any) {
    this.properties = Object.assign({}, this.properties, styles);
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

  set background(value: string) {
    const { background } = colorsAndBackground;
    this.properties[background] = value;
  }

  // Takes in a hex string
  set backgroundColor(value: string) {
    const { backgroundColor } = colorsAndBackground;
    this.properties[backgroundColor] = value;
  }

  // Takes in a hex string
  set borderColor(value: string) {
    const { borderColor } = boxModel;
    this.properties[borderColor] = value;
  }

  // Ex. 15px
  set borderWidth(value: string) {
    const { borderWidth } = boxModel;
    this.properties[borderWidth] = value;
  }

  set borderStyle(value: string) {
    const { borderStyle } = boxModel;
    this.properties[borderStyle] = value;
  }

  set size(size: Size) {
    const widthValue = size.width;
    const heightValue = size.height;

    const { width, height} = visualFormatting;

    if (widthValue && widthValue != 0) {
      this.properties[width] = px(widthValue);
    } else {
      delete this.properties[width];
    }

    if (heightValue && heightValue != 0) {
      this.properties[height] = px(heightValue);
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
      this.properties[paddingTop] = px(top);
    } else {
      delete this.properties[paddingTop];
    }

    if (right && right != 0) {
      this.properties[paddingRight] = px(right);
    } else {
      delete this.properties[paddingRight];
    }

    if (bottom && bottom != 0) {
      this.properties[paddingBottom] = px(bottom);
    } else {
      delete this.properties[paddingBottom];
    }

    if (left && left != 0) {
      this.properties[paddingLeft] = px(left);
    } else {
      delete this.properties[paddingLeft];
    }
  }

  set margin(margin: Margin) {
    const top = margin.top;
    const right = margin.right;
    const bottom = margin.bottom;
    const left = margin.left;

    const {marginTop, marginRight, marginBottom, marginLeft} = boxModel;

    if (top && top != 0) {
      this.properties[marginTop] = px(top);
    } else {
      delete this.properties[marginTop];
    }

    if (right && right != 0) {
      this.properties[marginRight] = px(right);
    } else {
      delete this.properties[marginRight];
    }

    if (bottom && bottom != 0) {
      this.properties[marginBottom] = px(bottom);
    } else {
      delete this.properties[marginBottom];
    }

    if (left && left != 0) {
      this.properties[marginLeft] = px(left);
    } else {
      delete this.properties[marginLeft];
    }
  }

  generate(): string {
    return this.getTemplate(this.selectors, this.properties)
  }
}
