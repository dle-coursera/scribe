export default class CSSModel {
  /*
  selectors: An array of selectors.
  properties: A dictionary of css properties and their values
  */
  constructor(selectors, properties = {}) {
    this.selectors = selectors;
    this.properties = properties;
  }

  getTemplate(selectors, properties) {
    const annotatedSelectors = selectors
      .map(selector => '.' + selector)
      .reduce((first, second) => first + ', ' + second);

    let combinedProperties = [];
    for (var key in properties) {
      const value = properties[key];
      combinedProperties.push(`${key}: ${value};`);
    }

    const propertyString = combinedProperties.reduce((first, second) => first + second);

    return `
    ${annotatedSelectors} {
      ${propertyString}
    }
    `;
  }

  generate() {
    return this.getTemplate(this.selectors, this.properties)
  }
}
