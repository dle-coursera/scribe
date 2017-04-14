export default class CSSModel {
  /*
  selectors: An array of selectors.
  properties: A dictionary of css properties and their values
  */
  constructor(selectors, properties = {}) {
    this.selectors = selectors;
    this.properties = properties;
  }

  function template(selector, properties) {
    // The output should be like this
    /*
    .selector1, .selector2 {
      prop1: value1;
      prop2: value2;
      prop3: value3:
    }
    */
    console.log(properties);
    return `
    ${selector} {
      ${properties}
    }
    `;
  }

  function generateCSS() {
    // return template(this.selectors, this.properties)
    console.log("---Generating");
  }
}
