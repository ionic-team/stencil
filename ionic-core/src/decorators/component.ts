

export let Component: {
  (meta: {
    selector: string;
    template?: string;
    templateUrl?: string;
    stylesheets?: string[];
  }): any;
};


export let Input: {
  (): any;
};


export let Output: {
  (): any;
};