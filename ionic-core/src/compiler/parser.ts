import { CompileOptions, CompilerContext, ComponentItem} from './interfaces';


export function parseComponentDecorator(content: string, opts?: CompileOptions, ctx?: CompilerContext) {
  const items: ComponentItem[] = [];

  if (!content || typeof content !== 'string' || !content.length) {
    return items;
  }

  var match: ComponentMeta;

  while ((match = getComponentMeta(content))) {
    items.push({
      hasValidComponent: true,
      template: content,
      templateUrl: match.templateUrl,
      inputComponentDecorator: match.component
    });

    content = content.replace(match.component, '');
  }


  return items;
}


export function getComponentMeta(str: string): ComponentMeta {
  let match = COMPONENT_REGEX.exec(str);
  if (match) {
    var meta = {
      start: match.index,
      end: match.index + match[0].length,
      component: match[0],
      data: match[5].trim(),
      templateUrl: '',
      template: '',
      selector: ''
    };

    if (!meta.data) {
      return null;
    }

    match = TEMPLATE_REGEX.exec(meta.data);
    if (match) {
      meta.template = match[2].trim();
    }

    match = TEMPLATE_URL_REGEX.exec(meta.data);
    if (match) {
      meta.templateUrl = match[2].trim();
    }

    match = SELECTOR_REGEX.exec(meta.data);
    if (match) {
      meta.selector = match[2].trim();
    }

    return meta;
  }
  return null;
}


export interface ComponentMeta {
  start: number;
  end: number;
  component: string;
  data: string;
  templateUrl: string;
  template: string;
  selector: string;
}

const COMPONENT_REGEX = /\@Component\s*?\(\s*?(\{([\s\S]*?)(\s*(.*?)\s*?)([\s\S]*?)}\s*?)\)/m;

const TEMPLATE_REGEX = /\s*template\s*:\s*(['"`])(.*?)(['"`])/m;

const TEMPLATE_URL_REGEX = /\s*templateUrl\s*:\s*(['"`])(.*?)(['"`])/m;

const SELECTOR_REGEX = /\s*selector\s*:\s*(['"`])(.*?)(['"`])/m;
