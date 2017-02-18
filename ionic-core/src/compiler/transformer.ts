

export function transformTemplate(content: string) {
  content = transformIf(content);
  content = transformFor(content);
  return content;
}


export function transformIf(content: string) {
  content = content.replace(/\ \[if\]/g, ' v-if');

  return content;
}


export function transformFor(content: string) {
  content = content.replace(/\ \[for\]/g, ' v-for');

  return content;
}
