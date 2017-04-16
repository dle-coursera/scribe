export default class ComponentModel {
     constructor(htmlTag, cssModel) {
       self.htmlTag = htmlTag;
       self.cssModel = cssModel;
     }

     updateCssWithPadding(topPadding = 0, rightPadding = 0, bottomPadding = 0, leftPadding = 0) {
       self.topPadding = topPadding;
       self.rightPadding = rightPadding;
       self.bottomPadding = bottomPadding;
       self.leftPadding = leftPadding;
     }
}
