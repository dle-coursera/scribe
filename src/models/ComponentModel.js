// @flow
import CSSModel from './CSSModel'
import HTMLModel from './HTMLModel'

export default class ComponentModel {
   constructor(htmlModel: HTMLModel, cssModel: CSSModel) {
     self.htmlModel = htmlModel;
     self.cssModel = cssModel;
     self.children = [];
   }

   get childern(): Array<ComponentModel> {
     return self.children;
   }

   get htmlModel(): HTMLModel {
     return self.htmlModel;
   }

   get cssModel(): CSSModel {
     return self.cssModel;
   }

   addChild(component: ComponentModel) {
     self.children.push(component);
   }

   generate() {
     // TODO: Generate the React component here
     // Content is the children inside of this component
   }
}
