import { ComponentMeta} from './interfaces';


export function parseComponentSourceText(sourceText: string) {
  const components: ComponentMeta[] = [];

  if (!sourceText || typeof sourceText !== 'string' || !sourceText.length) {
    return components;
  }

  let match: ComponentParse;

  while ((match = getComponentMatch(sourceText))) {
    components.push({
      tag: match.tag,
      template: match.template,
      templateUrl: match.templateUrl,
      inputComponentDecorator: match.inputText,
      outputComponentDecorator: match.inputText,
    });

    sourceText = sourceText.replace(match.inputText, '');
  }

  return components;
}


export function getComponentMatch(str: string): ComponentParse {
  let match = COMPONENT_REGEX.exec(str);
  if (match) {
    var parsed: ComponentParse = {
      start: match.index,
      end: match.index + match[0].length,
      inputText: match[0],
      data: match[5].trim(),
      templateUrl: '',
      template: '',
      tag: ''
    };

    if (!parsed.data) {
      return null;
    }

    match = TEMPLATE_REGEX.exec(parsed.data);
    if (match) {
      parsed.template = match[2].trim();
    }

    match = TEMPLATE_URL_REGEX.exec(parsed.data);
    if (match) {
      parsed.templateUrl = match[2].trim();
    }

    match = TAG_REGEX.exec(parsed.data);
    if (match) {
      parsed.tag = match[2].trim();
    } else {
      match = SELECTOR_REGEX.exec(parsed.data);
      if (match) {
        parsed.tag = match[2].trim();
      }
    }

    return parsed;
  }

  return null;
}


export interface ComponentParse {
  start: number;
  end: number;
  inputText: string;
  data: string;
  templateUrl: string;
  template: string;
  tag: string;
}

const COMPONENT_REGEX = /\Component\s*?\(\s*?(\{([\s\S]*?)(\s*(.*?)\s*?)([\s\S]*?)}\s*?)\)/m;

const TEMPLATE_REGEX = /\s*template\s*:\s*(['"`])(.*?)(['"`])/m;

const TEMPLATE_URL_REGEX = /\s*templateUrl\s*:\s*(['"`])(.*?)(['"`])/m;

const TAG_REGEX = /\s*tag\s*:\s*(['"`])(.*?)(['"`])/m;

const SELECTOR_REGEX = /\s*selector\s*:\s*(['"`])(.*?)(['"`])/m;
