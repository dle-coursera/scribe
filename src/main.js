import { processArtboards } from './layer-processors/artboardProcessor';
import { globalIncludesMap } from './fileSupport';

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
  const projectDirectory = `~/Documents/Scribe/${documentName}`;
  const testDirectory = `${projectDirectory}/__tests__`;
  const styleDirectory = `${projectDirectory}/__styles__`;

  globalIncludesMap['projectDirectory'] = projectDirectory;
  globalIncludesMap['testDirectory'] = testDirectory;
  globalIncludesMap['styleDirectory'] = styleDirectory;
  globalIncludesMap['relativeComponentDirectory'] = '.';
  globalIncludesMap['relativeTestDirectory'] = './__tests__';
  globalIncludesMap['relativeStyleDirectory'] = './__styles__';

  // TODO: Generate the folders here
}
