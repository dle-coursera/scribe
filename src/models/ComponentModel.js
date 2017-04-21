// @flow
import CSSModel from './CSSModel';
import HTMLModel from './HTMLModel';
import { MSImageData, CGRect } from '../types';
import { tags } from '../html-support/tags';
import { globalIncludesMap } from '../fileSupport';
import { saveImageToFile, saveTextToFile } from '../fileSupport';
import { px } from '../css-support/units';
import { colorTheme } from '../layer-support/color';
import { borderStyleValues, displayValues, alignItemsValues } from '../css-support/cssPropertyValues';

export default class ComponentModel {
   constructor(cssModel: CSSModel) {
     this._cssModel = cssModel;
     this._children = [];
     this._assets = [];
     this._isHorizontalLayout = false;
     this._hasBackground = false;
   }

   set isHorizontalLayout(value: boolean) {
     this._isHorizontalLayout = value;
   }

   get isHorizontalLayout() {
     return this._isHorizontalLayout;
   }

   set hasBackground(value: boolean) {
     this._hasBackground = value;
   }

   set frame(value: CGRect) {
     this._frame = value;
   }

   get frame(): CGRect {
     return this._frame;
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

   addAsset(asset: any) {
     this._assets.push(asset);
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
     // Check if we should handle primitive tags. ul and li are treated differently here
     let htmlModelTag: string;
     if (this._htmlModel) {
       htmlModelTag = this._htmlModel.htmlTag;
       if (htmlModelTag != tags.ul) {
          this.checkAssets();
          return this._htmlModel.generate();
       }
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

       // If this is a list(ul), then all the child should be wrapped inside a list item(li)
       if (htmlModelTag === tags.ul) {
         let listItemModel = new HTMLModel(tags.li, [this.listItemName()], child.generate(true));
         reactChildContent += listItemModel.generate();
       } else {
         reactChildContent += child.generate(true);
       }
       cssContent += child.cssModel.generate();
     }

     // Generate the list(ul)
     if (this._htmlModel && (htmlModelTag === tags.ul)) {
       // Create a border around each list item
       const listItemCssModel = new CSSModel([this.listItemName()])
       listItemCssModel.borderColor = colorTheme.black;
       listItemCssModel.borderWidth = px(1);
       listItemCssModel.borderStyle = borderStyleValues.solid;
       listItemCssModel.display = displayValues.flex;
       listItemCssModel.alignItems = alignItemsValues.center;
       listItemCssModel.size = {
         height: this._frame.size.height / this._children.length,
       }
       cssContent += listItemCssModel.generate();

       this._htmlModel.htmlContent = reactChildContent;
       reactChildContent = this._htmlModel.generate();
     } else if (this._children.length > 1 || this._hasBackground) { // Wrap content in a div if there is more than one child
       let htmlModel = new HTMLModel(tags.div, [this._name], reactChildContent);
       reactChildContent = htmlModel.generate();
     }

     // CSS file path
     const relativeStyleDirectory = globalIncludesMap['relativeStyleDirectory'];
     const cssFilePath = `${relativeStyleDirectory}/${this._name}.css`;

     const reactContent = this.reactTemplate(this._name, reactChildContent, cssFilePath, additionalFilePaths);

     console.log(reactContent);
     console.log(cssContent);

     this.saveCSS(cssContent);
     this.saveJSX(reactContent);

     // If we are inside a parent component, then render just the component tag
     if (fromParent) {
       return this.childReactTemplate(this._name);
     } else {
       return reactContent;
     }
   }

   listItemName(): string {
     return `${this._name}-item`;
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

   checkAssets() {
     if (this._assets.length) {
       const filename = new Date().getTime();
       if (this._htmlModel.htmlTag === tags.img) {
        this._htmlModel.attributes.src = `${globalIncludesMap.serverAssetDirectory}/${filename}.png`;
       } else {
        this._cssModel.background = `url('${globalIncludesMap.serverAssetDirectory}/${filename}.png')`;
       }
       this._assets.forEach(asset => this.saveAsset(asset, filename));
     }
   }

   saveAsset(content: MSImageData, filename: string) {
    const {assetDirectory} = globalIncludesMap;
    saveImageToFile(`${assetDirectory}/${filename}.png`, content);
   }

   saveCSS(content: string) {
     const {styleDirectory, debugDirectory} = globalIncludesMap;
     saveTextToFile(`${styleDirectory}/${this._name}.css`, content);
     saveTextToFile(`${debugDirectory}/${this._name}CSS.json`, JSON.stringify(content));
   }

   saveJSX(content: string) {
     const {projectDirectory, debugDirectory} = globalIncludesMap;
     saveTextToFile(`${projectDirectory}/${this._name}.jsx`, content);
     saveTextToFile(`${debugDirectory}/${this._name}.json`, JSON.stringify(content));
   }
}
