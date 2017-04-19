// @flow
import CSSModel from './CSSModel';
import HTMLModel from './HTMLModel';
import { tags } from '../html-support/tags';
import { globalIncludesMap } from '../fileSupport';

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
       otherImports = additionalFilePaths.reduce((first, second) => first + `import '${second}';`, '');
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

     // Generate the react component
     let childContent: string = "";
     const additionalFilePaths: Array<string> = [];
     for (const child of this._children) {
       if (child.name) {
         const childFilePath = globalIncludesMap[child.name];
         additionalFilePaths.push(childFilePath);
       }
       childContent += child.generate(true);
     }

     // Wrap content in a div if there is more than one child
     if (this._children.length > 1) {
       let htmlModel = new HTMLModel(tags.div, [], childContent);
       childContent = htmlModel.generate();
     }

     // CSS file path
     const relativeStyleDirectory = globalIncludesMap['relativeStyleDirectory'];
     const cssFilePath = `${relativeStyleDirectory}/${this._name}`;

     const reactContent = this.reactTemplate(this._name, childContent, cssFilePath, additionalFilePaths);
     const cssContent = this._cssModel.generate();

     console.log(reactContent);
     console.log(cssContent);

     // TODO: Save the CSS and JSX here.

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
}
