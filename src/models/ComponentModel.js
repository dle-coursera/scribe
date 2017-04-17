// @flow
import CSSModel from './CSSModel'
import HTMLModel from './HTMLModel'

export default class ComponentModel {
   constructor(htmlModel: HTMLModel, cssModel: CSSModel) {
     self.htmlModel = htmlModel;
     self.cssModel = cssModel;
   }

   get htmlModel(): HTMLModel {
     return self.htmlModel;
   }

   get cssModel(): CSSModel {
     return self.cssModel;
   }
}
