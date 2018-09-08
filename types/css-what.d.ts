declare module 'css-what' {

  function parse(selector: string): parse.ParseResults;

  namespace parse {
    interface Selector {
      type: 'tag' | 'child' | 'attribute' | 'universal';
      name: string;
      action: 'exists' | 'equals' | 'element';
      value: string;
    }

    type ParseResults = Selector[][];
  }

  export = parse;
}