// @flow
import { Tag } from '../types';

export default class HTMLModel {
  constructor(tag: Tag, classes: Array<string>, content: string) {
    this.tag = tag;
    this.content = content;
    this.classes = classes;
  }

  reactTemplate(tag: Tag, classes: Array<string>, content: string): string {
    return `
      <${tag} className="${classes}"
        ${content}
      </${tag}>
    `;
  }

  generate(): string {
    return this.reactTemplate(this.tag, this.classes, this.content);
  }
}
