// @flow
import { Tag } from '../types';

export default class HTMLModel {
  constructor(tag: Tag, classes: Array<string>, content: string) {
    self.tag = tag;
    self.content = content;
    self.classes = classes;
  }

  reactTemplate(tag: Tag, classes: Array<string>, content: string): string {
    return `
      <${tag} className="${classes}"
        ${content}
      </${tag}>
    `;
  }

  generate(): string {
    return this.reactTemplate(self.tag, self.classes, self.content);
  }
}
