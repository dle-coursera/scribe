import {
  MSImageData,
} from './types';

let contextDocument;

export const getOutputDirectoryPath = (folderName) => {
  return `~/Desktop/${folderName}`
}

export const setContextDocument = (doc: any) => {
  contextDocument = doc;
}

export const createDirectoryIfNotExists = (path: string) => {
  const fileManager = NSFileManager.defaultManager();
  const dir = path.substring(0, path.lastIndexOf('/'));

  if (!fileManager.fileExistsAtPath(dir)) {
    fileManager.createDirectoryAtPath_withIntermediateDirectories_attributes_error_(
      dir, true, null, null
    );
  }
}

export const saveSvgToFile = (filename: string, layer: any) => {
  const rect = layer.absoluteRect().rect();
  var exportReq = MSExportRequest.exportRequestFromExportFormat_layer_inRect_useIDForName_(null, layer, rect, null);
  contextDocument.saveArtboardOrSlice_toFile_(exportReq, filename);
}

export const saveTextToFile = (filename: string, text: string) => {
  const contents = NSString.stringWithString(text);
  const path = NSString.stringWithString(filename).stringByExpandingTildeInPath();
  createDirectoryIfNotExists(path);

  const isSaved = contents.writeToFile_atomically_(path, true);
  if (!isSaved) {
    console.error('Text file failed to save');
  }
}

export const saveImageToFile = (filename: string, image: MSImageData) => {
  const path = NSString.stringWithString(filename).stringByExpandingTildeInPath();
  createDirectoryIfNotExists(path);

  const isSaved = image.data().writeToFile_atomically_(path, true);
  if (!isSaved) {
    console.error('Image file failed to save');
  }
}

export const getDirectoryContents = (path, onlyIsDirectory) => {
  const fileManager = NSFileManager.defaultManager();
  const fullPath = NSString.stringWithString(path).stringByExpandingTildeInPath();
  const contents = fileManager.contentsOfDirectoryAtPath_error_(fullPath, null);
  const contentsArray = [];

  for (let i = 0; i < contents.length; i++) {
    if (!onlyIsDirectory || fileManager.fileExistsAtPath(`${fullPath}/${contents[i]}/index.js`)) {
      contentsArray.push(contents[i]);
    }
  }

  return contentsArray;
}

export const createMappingFile = () => {
  const {relativeDebugDirectory, rootDirectory} = globalIncludesMap;
  const allExports = Object.keys(globalIncludesMap)
    .filter(key => key.indexOf('Directory') < 0)
    .map(cmp => `
      import ${cmp} from './${cmp}';
      import ${cmp}RawJS from '${relativeDebugDirectory}/${cmp}.json';
      import ${cmp}RawCSS from '${relativeDebugDirectory}/${cmp}CSS.json';
      components['${cmp}'] = {
        ReactComponent: ${cmp},
        rawJS: ${cmp}RawJS,
        rawCSS: ${cmp}RawCSS,
      };
    `)
    .join('');

  const exportString = `
    const components = {};
    ${allExports}
    export default components;
  `;

  saveTextToFile(`${globalIncludesMap.projectDirectory}/index.js`, exportString);

  const rootDirectoryContents = getDirectoryContents(rootDirectory, true);
  const rootExportString = rootDirectoryContents.map(project => `
    import {default as ${project}} from './${project}';
  `).join('') + `export default {${rootDirectoryContents.join(',')}};`;
  saveTextToFile(`${globalIncludesMap.rootDirectory}/mapping.js`, rootExportString);

}

export const fileFormats = {
  svg: '.svg',
};

// This is a map of all component names to their file paths on disk
export const globalIncludesMap = {

}
