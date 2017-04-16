export const hexColorForNSColor = (nsColor) => {
  const red = nsColor.redComponent();
  const green = nsColor.greenComponent();
  const blue = nsColor.blueComponent();

  console.log(`r:${red} g:${green} b:${blue}`);
}
