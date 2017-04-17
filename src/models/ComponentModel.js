// @flow
import CSSModel from './CSSModel';
import HTMLModel from './HTMLModel';
import { tags } from '../html-support/tags';

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

   reactTemplate(name: string, content: string): string {
     return `
     class ${name} extends React.Component {
       render() {
         return (
           ${content}
         );
       }
     }

     module.exports = ${name};
     `
   }

   generate(): string {
     if (this._htmlModel) {
       return this._htmlModel.generate();
     }

     let content: string = "";
     for (const child of this._children) {
       content += child.generate();
     }

     if (this._children.length > 0) {
       let htmlModel = new HTMLModel(tags.div, [], content);
       content = htmlModel.generate();
     }

     return this.reactTemplate(this._name, content);


     // The CSS of the child determines padding
     // If the child contains a basic HTML tag, then render the content in the parent.
     // If the child a ReactModel, then use the ReactModel

     // TODO: Generate the React component here
     // Content is the children inside of this component
   }
}
