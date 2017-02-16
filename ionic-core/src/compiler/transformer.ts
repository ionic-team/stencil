

export function transformTemplateContent(content: string) {

  content = transformIfConditionals(content);

  return content;
}


export function transformIfConditionals(content: string) {

  content = content.replace(/\*ngIf/g, 'v-if');
  content = content.replace(/\ng-if/g, 'v-if');

  return content;
}