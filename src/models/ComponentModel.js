export default class ComponentModel {
     constructor(html, cssModel) {
       self.html = html;
       self.cssModel = cssModel;
     }

     get html() {
       return self.html;
     }

     get cssModel() {
       return self.cssModel;
     }

     updateCssWithPadding(topPadding = 0, rightPadding = 0, bottomPadding = 0, leftPadding = 0) {
       self.topPadding = topPadding;
       self.rightPadding = rightPadding;
       self.bottomPadding = bottomPadding;
       self.leftPadding = leftPadding;
     }
}
