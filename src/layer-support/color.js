export const hexColorForNSColor = (nsColor) => {
  const red = nsColor.redComponent();
  const green = nsColor.greenComponent();
  const blue = nsColor.blueComponent();

  const redHex = ("0" + red.toString(16)).toUpperCase().slice(-2);
  const greenHex = ("0" + green.toString(16)).toUpperCase().slice(-2);
  const blueHex = ("0" + blue.toString(16)).toUpperCase().slice(-2);

  return '#' + redHex + greenHex + blueHex;
}

export const opacityForNSColor = (nsColor) => {
  return nsColor.alphaComponent();
}
