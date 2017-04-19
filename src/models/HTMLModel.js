// @flow
import { Tag } from '../types';

export default class HTMLModel {
  constructor(tag: Tag, classes: Array<string>, content: string) {
    this.tag = tag;
    this.content = content;
    this.classes = classes;
  }

  reactTemplate(tag: Tag, classes: Array<string>, content?: string): string {
    if (classes.length > 0) {
      if (content) {
        return `
          <${tag} className="${classes}">
            ${content}
          </${tag}>
        `;
      } else {
        return `
          <${tag} className="${classes}">
          </${tag}>
        `;
      }
    } else {
      if (content) {
        return `
          <${tag}>
            ${content}
          </${tag}>
        `;
      } else {
        return `
          <${tag}>
          </${tag}>
        `;
      }
    }
  }

  generate(): string {
    return this.reactTemplate(this.tag, this.classes, this.content);
  }
}
