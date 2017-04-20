// @flow
import { htmlAttributes } from '../html-support/htmlAttributes';
import { Tag } from '../types';

export default class HTMLModel {
  constructor(tag: Tag, classes: Array<string>, content: string) {
    this.tag = tag;
    this.content = content;
    this.classes = classes;
    this.attributes = {};
  }

  set src(value: string) {
    const {src} = htmlAttributes;
    this.attributes[src] = value;
  }

  reactTemplate(tag: Tag, classes: Array<string>, content?: string, attributes: any): string {
    const classNames = (classes.length > 0) ? ` className="${classes}"` : '';
    const attributeKeys = Object.keys(attributes);
    const attributeNames = (attributeKeys.length > 0) ?
      ' ' + attributeKeys.map(key => `${key}="${attributes[key]}"`).join(' ') : '';

    if (content) {
      return `
        <${tag}${classNames}${attributeNames}>
          ${content}
        </${tag}>
      `;
    } else {
      return `
        <${tag}${classNames}${attributeNames}>
        </${tag}>
      `;
    }
  }

  generate(): string {
    return this.reactTemplate(this.tag, this.classes, this.content, this.attributes);
  }
}
