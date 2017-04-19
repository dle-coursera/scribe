// @flow
import CSSModel from './CSSModel';
import HTMLModel from './HTMLModel';
import { tags } from '../html-support/tags';
import { globalIncludesMap } from '../fileSupport';
import { saveTextToFile } from '../fileSupport';

export default class ComponentModel {
   constructor(cssModel: CSSModel) {
     this._cssModel = cssModel;
     this._children = [];
   }

   set name(name: string) {
     this._name = name;
   }

   get name(): string {
     return this._name;
   }

   set htmlModel(htmlModel: HTMLModel) {
     this._htmlModel = htmlModel;
   }

   get childern(): Array<ComponentModel> {
     return this._children;
   }

   get htmlModel(): HTMLModel {
     return this._htmlModel;
   }

   get cssModel(): CSSModel {
     return this._cssModel;
   }

   addChild(component: ComponentModel) {
     this._children.push(component);
   }

   reactTemplate(name: string, content: string, cssPath: string, additionalFilePaths: Array<string>): string {
     // Build file imports
     let otherImports: string = '';
     if (additionalFilePaths && additionalFilePaths.length > 0) {
       const first = `import '${additionalFilePaths[0]}';`;
       otherImports = additionalFilePaths.reduce((first, second) => first + `import ${second.replace('./', '')} from '${second}';`, '');
     }

     otherImports += `import '${cssPath}';`;

     return `
     import React from 'react';
     ${otherImports}

     class ${name} extends React.Component {
       render() {
         return (
           ${content}
         );
       }
     }

     module.exports = ${name};
     `;
   }

   childReactTemplate(name: string): string {
     return `
      <${name} />
     `;
   }

   generate(fromParent: bool = false): string {
     if (this._htmlModel) {
        return this._htmlModel.generate();
     }

     // This needs to be called before child.generate
     this.registerComponentFilePaths();

     // Generate the react compnent and CSS
     let cssContent = this._cssModel.generate();
     let reactChildContent: string = "";
     const additionalFilePaths: Array<string> = [];
     for (const child of this._children) {
       if (child.name) {
         const childFilePath = globalIncludesMap[child.name];
         additionalFilePaths.push(childFilePath);
       }
       reactChildContent += child.generate(true);
       cssContent += child.cssModel.generate();
     }

     // Wrap content in a div if there is more than one child
     if (this._children.length > 1) {
       let htmlModel = new HTMLModel(tags.div, [this._name], reactChildContent);
       reactChildContent = htmlModel.generate();
     }

     // CSS file path
     const relativeStyleDirectory = globalIncludesMap['relativeStyleDirectory'];
     // TODO: add back once we can create folder
     // const cssFilePath = `${relativeStyleDirectory}/${this._name}`;
     const cssFilePath = `./${this._name}.css`;
     const reactContent = this.reactTemplate(this._name, reactChildContent, cssFilePath, additionalFilePaths);

     console.log(reactContent);
     console.log(cssContent);

     this.saveCSS(cssContent);
     this.saveJSX(reactContent);

     if (fromParent) {
       return this.childReactTemplate(this._name);
     } else {
       return reactContent;
     }
   }

   registerComponentFilePaths() {
     // Breath traverse through all the child components and get their names.
     // This makes the child available deeper down the view hierarchy.
     const relativeDirPath = globalIncludesMap['relativeComponentDirectory'];
     for (const child of this._children) {
       if (child.name && !globalIncludesMap[child.name]) {
         globalIncludesMap[child.name] = `${relativeDirPath}/${child.name}`;
       }
     }

     globalIncludesMap[this._name] = `${relativeDirPath}/${this._name}`;
   }

   saveCSS(content: string) {
     const projectDirectory = globalIncludesMap.projectDirectory;
     saveTextToFile(`${projectDirectory}/${this._name}.css`, content);
     saveTextToFile(`${projectDirectory}/${this._name}CSS.json`, JSON.stringify(content));
   }

   saveJSX(content: string) {
     const projectDirectory = globalIncludesMap.projectDirectory;
     saveTextToFile(`${projectDirectory}/${this._name}.jsx`, content);
     saveTextToFile(`${projectDirectory}/${this._name}.json`, JSON.stringify(content));
   }
}
