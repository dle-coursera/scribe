export const processShapeLayer = (shapeLayer) => {
  console.log("This is a shape layer");
  const layers = shapeLayer.layers()
  const layerEnumerator = layers.objectEnumerator();
  while (layer = layerEnumerator.nextObject()) {
    if (layer.isKindOfClass(MSRectangleShape)) { // A rectangle
      console.log("A rectangle");
    } else if (layer.isKindOfClass(MSOvalShape)) { // An oval
      console.log("An oval");
    } else if (layer.isKindOfClass(MSStarShape)) {
      console.log("A star");
    } else if (layer.isKindOfClass(MSPolygonShape)) {
      console.log("A polygon");
    } else if (layer.isKindOfClass(MSTriangleShape)) {
      console.log("A triangle");
    } else if (layer.isKindOfClass(MSShapePathLayer)) { // Can be a line or a line with arrow at the end
      console.log("Line or line with arrow");
    }
  }
}
