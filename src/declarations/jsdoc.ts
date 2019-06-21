

export interface JsDoc {
  name: string;
  documentation: string;
  type: string;
  tags: JSDocTagInfo[];
  default?: string;
  parameters?: JsDoc[];
  returns?: {
    type: string;
    documentation: string;
  };
}

export interface JSDocTagInfo {
  name: string;
  text?: string;
}
