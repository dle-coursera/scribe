// @flow
export type Tag = string;

export type Padding = {
  top: number,
  right: number,
  bottom: number,
  left: number,
}

export type Size = {
  width: number,
  height: number,
}

// Apple types
export type NSColor = any;

export type NSFont = any;

export type CGRect = any;

// Sketch types. Avoid importing these types if using isKindOfClass since it conflicts with the real types.
export type MSArtboardGroup = any;

export type MSLayerGroup = any;

export type MSShapeGroup = any;

export type MSTextLayer = any;

export type MSBitmapLayer = any;

export type MSRectangleShape = any;

export type MSOvalShape = any;

export type MSStarShape = any;

export type MSPolygonShape = any;

export type MSTriangleShape = any;

export type MSShapePathLayer = any;

export type MSStyle = any;

export type MSStyleFill = any;

export type MSStyleBorder = any;

export type MSColor = any;
