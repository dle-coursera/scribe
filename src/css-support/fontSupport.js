// @flow
import { NSFont } from '../types';
import { textAndFont } from './cssProperties';
import { px } from './units';

const pointToValue = {
  6 : {
    px: 8, em:	0.5, percent: 50,
  },
  7: {
    px: 9, em: 0.55, percent:	55,
  },
  7.5: {
    px: 10, em:	0.625, percent:	62.5,
  },
  8: {
    px: 11,	em: 0.7, percent:	70,
  },
  9: {
    px: 12, em: 0.75, percent: 75,
  },
  10: {
    px: 13,	em: 0.8, percent:	80,
  },
  10.5: {
    px: 14, em: 0.875, percent:	87.5,
  },
  11: {
    px: 15,	em: 0.95, percent: 95,
  },
  12: {
    px: 16, em: 1, percent: 100,
  },
  13: {
    px: 17, em: 1.05, percent: 105,
  },
  13.5: {
    px: 18, em: 1.125, percent: 112.5,
  },
  14: {
    px: 19, em: 1.2, percent: 120,
  },
  14.5: {
    px: 20, em: 1.25, percent: 125,
  },
  15: {
    px: 21, em: 1.3, percent: 130,
  },
  16: {
    px: 22, em: 1.4, percent: 140,
  },
  17: {
    px: 23, em: 1.45, percent: 145,
  },
  18: {
    px: 24, em: 1.5, percent: 150,
  },
  20: {
    px: 26, em: 1.6, percent: 160,
  },
  22: {
    px: 29, em: 1.8, percent: 180,
  },
  24: {
    px: 32, em: 2, percent:	200,
  },
  26: {
    px: 35, em: 2.2, percent: 220,
  },
  27: {
    px: 36, em: 2.25, percent: 225,
  },
  28: {
    px: 37, em: 2.3, percent: 230,
  },
  29: {
    px: 38, em: 2.35, percent: 235,
  },
  30: {
    px: 40, em: 2.45, percent: 245,
  },
  32: {
    px: 42, em: 2.55, percent: 255,
  },
  34: {
    px: 45, em: 2.75, percent: 275,
  },
  36: {
    px: 48, em: 3, percent: 300,
  }
}

const fontWeights = {
  normal: 'normal',
  bold: 'bold',
};

const fontStyles = {
  normal: 'normal',
  italic: 'italic',
  oblique: 'oblique',
}

function pixelValueForFontPoints(pointValue: number): number {
  let pixels = pointToValue[pointValue];
  // Some times pointValue is off by a tiny bit, which won't match the table so try rounding it.
  if (!pixels) {
    pixels = pointToValue[Math.round(pointValue)];
  }
  if (pixels) {
    return pixels.px;
  } else {
    return 1.333333 * pointValue;
  }
}

export function cssFontStylesForFont(font: NSFont): any {
  const { fontFamily, fontSize, fontWeight, fontStyle } = textAndFont;

  // Sketch seems to be providing the actual pixel value. Might be a setting in Sketch, otherwise should use pixelValueForFontPoints
  const fontPixels = font.pointSize();

  // fontName ex. Helvetica-Bold, Helvetica-BoldOblique, Helvetical-LightOblique
  // Sketch font weights are Oblique, Light, Light Oblique, Bold, Bold Oblique
  const fontNameComponents = font.fontName().toLowerCase().split('-');
  let fontWeightValue = fontNameComponents.includes(fontWeights.bold) ? fontWeights.bold : fontWeights.normal;

  // Sketch does not have a way to set italics so we ignore it here
  let fontStyleValue: string;
  if (fontNameComponents.includes[fontStyles.oblique]) {
    fontStyleValue = fontStyles.oblique;
  } else {
    fontStyleValue = fontStyles.normal;
  }

  const fontFamilyValue = font.familyName().replace(/[^a-zA-Z0-9]/g, '');

  return {
    [fontFamily]: fontFamilyValue,
    [fontSize]: px(fontPixels),
    [fontWeight]: fontWeightValue,
    [fontStyle]: fontStyleValue,
  }
}
