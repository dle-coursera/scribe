export const getOutputDirectoryPath = (folderName) => {
  return `~/Desktop/${folderName}`
}

export const saveTextToFile = (filename, text) => {
  var contents = NSString.stringWithString(text);
  var path = NSString.stringWithString(filename).stringByExpandingTildeInPath();
  var isSaved = contents.writeToFile_atomically_(path, true);
  if (!isSaved) {
    console.error('File failed to save');
  }
}

export const createMappingFile = () => {
  const allExports = Object.keys(globalIncludesMap)
    .filter(key => key.indexOf('Directory') < 0)
    .map(cmp => `
      import ${cmp} from './${cmp}';
      import ${cmp}RawJS from './${cmp}.json';
      import ${cmp}RawCSS from './${cmp}CSS.json';
      components.${cmp} = ${cmp};
      rawJS.${cmp} = ${cmp}RawJS;
      rawCSS.${cmp} = ${cmp}RawCSS;
    `)
    .join('');

  const exportString = `
    const components = {};
    const rawJS = {};
    const rawCSS = {};
    ${allExports}
    export {components, rawJS, rawCSS}
  `;
    
  saveTextToFile(`${globalIncludesMap.projectDirectory}/mapping.js`, exportString);
}

// This is a map of all component names to their file paths on disk
export const globalIncludesMap = {

}
