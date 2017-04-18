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

   reactTemplate(name: string, cssPath: string, content: string): string {
     return `
     import React from 'react';

     import '${cssPath}';

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

     // Generate the react component
     let childContent: string = "";
     for (const child of this._children) {
       childContent += child.generate(true);
     }

     if (this._children.length > 0) {
       let htmlModel = new HTMLModel(tags.div, [], childContent);
       childContent = htmlModel.generate();
     }

     const projectDirectory = globalIncludesMap['projectDirectory'];
     globalIncludesMap[this._name] = `${projectDirectory}/${this._name}`;

     const relativeStyleDirectory = globalIncludesMap['relativeStyleDirectory'];
     const cssFilePath = `${relativeStyleDirectory}/${this._name}`;

     const reactContent = this.reactTemplate(this._name, cssFilePath, childContent);
     const cssContent = this._cssModel.generate();

     console.log(reactContent);
     console.log(cssContent);

     // TODO: Save the CSS and JSX here.

     if (fromParent) {
       return this.childReactTemplate(this._name);
     } else {
       return reactContent;
     }

     // How to build includes
     // Need to scan through every object and create a global lookup table
     // Breath then depth
     // Then generate the corresponding

     // |----
     //    |
     //    |
     //    |----
     //    |   |
     //    |   |---
     //    |   |  |
     //    |   |

     // The CSS of the child determines padding
     // If the child contains a basic HTML tag, then render the content in the parent.
   }
}
