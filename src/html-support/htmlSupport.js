import {tags} from './tags'

const reactTagTemplate = (tag, className, content) => {
  return `
    <${tag} className="${className}"
      ${content}
    </${tag}>
  `;
}

export const pTag = (className, content) => {
  return reactTagTemplate(tags.p, className, content);
}
