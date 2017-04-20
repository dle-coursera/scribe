import { processArtboards } from './layer-processors/artboardProcessor';
import { globalIncludesMap } from './fileSupport';
import { projectRoot } from '../config';

export default function (context) {
  context.document.showMessage('It\'s alive 333 🙌')
  const documentName = context.document.displayName();
  setupProjectDirectory(documentName);

  const document = context.document;
  const pages = document.pages();

  const pageEnumerator = pages.objectEnumerator();
  while (page = pageEnumerator.nextObject()) {
    console.log(`Page: ${page.name()}`);
    processArtboards(page.artboards());
  }
}

function setupProjectDirectory(documentName: string) {
  const rootDirectory = `${projectRoot}/public/components`;
  const projectDirectory = `${rootDirectory}/${documentName}`;
  const assetDirectory = `${projectDirectory}/__assets__`;
  const debugDirectory = `${projectDirectory}/__debug__`;
  const testDirectory = `${projectDirectory}/__tests__`;
  const styleDirectory = `${projectDirectory}/__styles__`;

  globalIncludesMap['rootDirectory'] = rootDirectory;
  globalIncludesMap['projectDirectory'] = projectDirectory;
  globalIncludesMap['assetDirectory'] = assetDirectory;
  globalIncludesMap['debugDirectory'] = debugDirectory;
  globalIncludesMap['testDirectory'] = testDirectory;
  globalIncludesMap['styleDirectory'] = styleDirectory;
  globalIncludesMap['relativeComponentDirectory'] = '.';
  globalIncludesMap['relativeAssetDirectory'] = './__assets__';
  globalIncludesMap['relativeDebugDirectory'] = './__debug__';
  globalIncludesMap['relativeTestDirectory'] = './__tests__';
  globalIncludesMap['relativeStyleDirectory'] = './__styles__';
  globalIncludesMap['serverAssetDirectory'] = `public/components/${documentName}/__assets__`;
}
